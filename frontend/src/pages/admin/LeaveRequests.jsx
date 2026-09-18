import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { InfoIcon } from "lucide-react";

export default function LeaveRequests() {
  const [leaves, setLeaves] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLeaves, setSelectedLeaves] = useState([]);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        setIsLoading(true);
        setError("");


        const token = sessionStorage.getItem("token");

        if (!token) {
          throw new Error("No authentication token found. Please log in");
        }

        const response = await fetch(
          "http://localhost:8000/api/v1/leaves/all",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );


        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Could not fetch all leave requests");
        }

        setLeaves(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log("Error here", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaves();
  }, []);

  if (isLoading) {
    return <p>Loading leave requests...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const handleApprove = async () => {
    if (selectedLeaves.length !== 1) {
      toast.error("Select a leave request first.");
      return;
    }

    // FIX 1: Extract the selected leave ID so it's accessible below
    const leaveId = selectedLeaves[0];
    const token = sessionStorage.getItem("token");

    if (!token) {
      toast.error("Authentication failed", {
        description: "No authentication token found. Please log in again.",
      });
      return;
    }

    try {
      setIsActionLoading(true);
      setError("");

      const response = await fetch(

        `http://localhost:8000/api/v1/leaves/${leaveId}/approve`,

        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, 
          },
          body: JSON.stringify({
            approvedBy: 1,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not approve leave request.");
      }

      // Update the table immediately
      setLeaves((currentLeaves) =>
        currentLeaves.map((leave) =>
          leave.id === leaveId ? { ...leave, status: "approved" } : leave,
        ),
      );

      // Clear checkbox selection
      setSelectedLeaves([]);

      toast.success("Leave request approved", {
        description: "The employee's leave request was approved.",
      });
    } catch (error) {
      console.error("Approval error:", error);
      toast.error("Approval failed", {
        description: error.message,
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (selectedLeaves.length !== 1) {
      toast.error("Please select exactly one leave request.");
      return;
    }

    const leaveId = selectedLeaves[0];
    const token = sessionStorage.getItem("token");

    if (!token) {
      toast.error("Authentication failed", {
        description: "No authentication token found. Please log in again.",
      });
      return;
    }

    // FIX 2: Safe string check assuming rejectionReason comes from component state
    const cleanReason = (rejectionReason || "").trim();

    if (!cleanReason) {
      setError("Please enter a reason for rejecting this leave request.");
      toast.error("Reason required", {
        description: "Rejection reason cannot be empty.",
      });
      return;
    }

    try {
      setIsActionLoading(true);
      setError("");

      const response = await fetch(

        `http://localhost:8000/api/v1/leaves/${leaveId}/reject`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Consistent token usage
          },
          body: JSON.stringify({
            approvedBy: 1,
            rejectionReason: cleanReason,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not reject leave request.");
      }

      // Update table immediately
      setLeaves((currentLeaves) =>
        currentLeaves.map((leave) =>
          leave.id === leaveId
            ? {
                ...leave,
                status: "rejected",
                rejection_reason: cleanReason,
              }
            : leave,
        ),
      );

      // Clear selection and dialog states
      setSelectedLeaves([]);
      setRejectionReason("");
      setRejectDialogOpen(false);

      toast.success("Leave request rejected", {
        description: "The employee's leave request was rejected.",
      });
    } catch (error) {
      console.error("Rejection error:", error); // Fixed typo label
      toast.error("Rejection failed", {
        description: error.message,
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const toggleLeave = (leaveId) => {
    setSelectedLeaves((current) =>
      current.includes(leaveId)
        ? current.filter((id) => id !== leaveId)
        : [...current, leaveId],
    );
  };

  const toggleAllLeaves = () => {
    if (selectedLeaves.length === leaves.length) {
      // Unselect all
      setSelectedLeaves([]);
    } else {
      // Select all
      setSelectedLeaves(leaves.map((leave) => leave.id));
    }
  };

  return (

    <div className="bg-red-50">
      <section className="max-w-7xl mx-auto py-8 px-6 md:px-10 3xl:px-0 flex flex-col px-4">

        <div className="flex justify-between">
          <h2 className="text-lg font-semibold">All Leave Requests</h2>
        </div>

        <div className="mt-4">
          <Alert className="border-border/60 bg-white shadow-sm">
            <InfoIcon className="h-4 w-4" />

            <AlertTitle className="font-medium">
              Review pending requests Leave Request Management
            </AlertTitle>
            <AlertDescription>
              Select a pending leave request to approve or reject it.
            </AlertDescription>
          </Alert>
        </div>

        <div className="mt-6">
          <Card className="px-6 gap-2">
            <Table>
              <TableCaption>A list of your recent leaves.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        leaves.length > 0 &&
                        selectedLeaves.length === leaves.length
                      }
                      onCheckedChange={toggleAllLeaves}
                      aria-label="Select all leave requests"
                    />
                  </TableHead>
                  <TableHead className="w-[90px]">Empl ID</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Leave Issued</TableHead>
                  <TableHead>Reason for Rejection</TableHead>
                  <TableHead>Total Days</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right font-bold">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {leaves.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      <p>No leave requests found.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  leaves.map((leave) => (
                    <TableRow key={leave.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedLeaves.includes(leave.id)}
                          onCheckedChange={() => toggleLeave(leave.id)}
                          aria-label={`Select leave request ${leave.id}`}
                        />
                      </TableCell>

                      <TableCell>{leave.id}</TableCell>

                      <TableCell>{leave.reason}</TableCell>

                      <TableCell>
                        {format(new Date(leave.start_date), "MMM dd, yyyy")}
                        {" - "}
                        {format(new Date(leave.end_date), "MMM dd, yyyy")}
                      </TableCell>

                      <TableCell>{leave.rejection_reason}</TableCell>

                      <TableCell>{leave.total_days}</TableCell>

                      <TableCell className="font-semibold capitalize">
                        <Badge
                          variant={
                            leave.status === "approved"
                              ? "secondary"
                              : leave.status === "rejected"
                                ? "destructive"
                                : "secondary"
                          }
                          className={
                            leave.status === "pending"
                              ? "primary"
                              : leave.status === "approved"
                                ? "success"
                                : leave.status === "rejected"
                                  ? "danger"
                                  : leave.status === "cancelled"
                                    ? "caution"
                                    : ""
                          }
                        >
                          {leave.status}
                        </Badge>
                      </TableCell>


                      <TableCell className="flex justify-end font-semibold capitalize">
                        <span className="flex gap-2">
                          <Button
                            size="xs"
                            onClick={handleApprove}
                            disabled={
                              selectedLeaves.length !== 1 || isActionLoading
                            }
                            className="rounded-full px-3 cursor-pointer hover:scale-105 hover:shadow-xl duration-700 transition-all"
                          >
                            <Check size={16} />{" "}
                            <span className="hidden md:flex">
                              {isActionLoading ? "Processing..." : "Approve"}
                            </span>
                          </Button>
                          <Button
                            size="xs"
                            onClick={() => {
                              if (selectedLeaves.length === 0) {
                                setError("Please select a leave request.");
                                return;
                              }

                              if (selectedLeaves.length > 1) {
                                setError(
                                  "Please select only one leave request.",
                                );
                                return;
                              }

                              setRejectionReason("");
                              setRejectDialogOpen(true);
                            }}
                            disabled={
                              selectedLeaves.length !== 1 || isActionLoading
                            }
                            variant="destructive"
                            className="rounded-full px-3 cursor-pointer hover:scale-105 hover:shadow-xl duration-700 transition-all"
                          >
                            <X size={16} />{" "}
                            <span className="hidden md:flex"> Reject </span>
                          </Button>
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader className="gap-1">
                  <DialogTitle>Reject Leave Request</DialogTitle>

                  <DialogDescription className="text-xs">
                    Please provide a reason for rejecting this leave request.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-2">
                  <Label htmlFor="rejection-reason">Rejection reason:</Label>

                  <Textarea
                    id="rejection-reason"
                    placeholder="Enter the reason for rejection..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={4}
                  />
                </div>

                <DialogFooter>
                  <DialogClose
                    render={
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full px-3"
                      >
                        Cancel
                      </Button>
                    }
                  />

                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={!rejectionReason.trim() || isActionLoading}
                    onClick={handleReject}
                    className="rounded-full px-4"
                  >
                    {isActionLoading ? "Rejecting..." : "Reject Leave"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Card>
        </div>
      </section>
    </div>
  );
}
