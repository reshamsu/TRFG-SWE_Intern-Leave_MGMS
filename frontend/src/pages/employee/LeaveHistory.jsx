// import React from 'react'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, InfoIcon, Pen, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";

export default function LeaveHistory() {
  const [leaves, setLeaves] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLeaves, setSelectedLeaves] = useState([]);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [DialogOpen, setDialogOpen] = useState(false);
  const [changeReason, setChangeReason] = useState("");
  const [date, setDate] = useState({
    from: undefined,
    to: undefined,
  });

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        setIsLoading(true);
        setError("");

        const storedUser = sessionStorage.getItem("user");

        if (!storedUser) {
          throw new Error("User session not found.");
        }

        const user = JSON.parse(storedUser);
        const employee_id = user.id;

        const response = await fetch(
          `http://localhost:8000/api/leaves/my?employee_id=${employee_id}`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        const data = await response.json();

        console.log("Leave API response:", data);

        if (!response.ok) {
          throw new Error(data.error || "Could not fetch leave requests");
        }

        setLeaves(Array.isArray(data.leaveRequests) ? data.leaveRequests : []);
      } catch (error) {
        console.error("Fetch leaves error:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaves();
  }, []);

  if (isLoading) {
    return (
      <p className="flex justify-center text-center">
        Loading leave requests...
      </p>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  const handleCancel = async () => {
    if (selectedLeaves.length !== 1) {
      toast.error("Select a leave request first.");
      return;
    }

    const leaveId = selectedLeaves[0];

    try {
      setIsActionLoading(true);
      setError("");

      const response = await fetch(
        `http://localhost:8000/api/leaves/${leaveId}/cancel`,
        {
          method: "PUT",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not cancel leave request.");
      }

      // Update the table immediately
      setLeaves((currentLeaves) =>
        currentLeaves.map((leave) =>
          leave.id === leaveId
            ? {
                ...leave,
                status: "cancelled",
              }
            : leave,
        ),
      );

      // Clear checkbox
      setSelectedLeaves([]);

      toast.success("Leave request cancelled", {
        description: "Your leave request was cancelled.",
      });
    } catch (error) {
      console.error("Cancellation error:", error);

      toast.error("Cancellation failed", {
        description: error.message,
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleChange = async () => {
    if (selectedLeaves.length !== 1) {
      setError("Please select a leave request.");
      return;
    }

    const leaveId = selectedLeaves[0];

    try {
      setIsActionLoading(true);
      setError("");

      const response = await fetch(
        `http://localhost:8000/api/leaves/${leaveId}/change`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            startDate: format(date.from, "yyyy-MM-dd"),
            endDate: format(date.to, "yyyy-MM-dd"),
            reason: changeReason.trim(),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not change leave request.");
      }

      // Update table immediately
      setLeaves((currentLeaves) =>
        currentLeaves.map((leave) =>
          leave.id === leaveId
            ? {
                ...leave,
                status: "pending",
                start_date: format(date.from, "yyyy-MM-dd"),
                end_date: format(date.to, "yyyy-MM-dd"),
              }
            : leave,
        ),
      );

      // Clear selection
      setSelectedLeaves([]);
      setChangeReason("");
      setDate({
        from: undefined,
        to: undefined,
      });
      setDialogOpen(false);

      toast.success("Leave request resubmitted", {
        description:
          "The leave request has been updated and return to pending review.",
      });
    } catch (error) {
      console.error("Change error:", error);

      toast.error("Change request failed", {
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
    <div className="min-h-screen bg-red-50">
      <section className="max-w-6xl mx-auto py-10 px-6 md:px-10 2xl:px-0 flex flex-col min-h-screen px-4">
        <div className="flex justify-between">
          <h2 className="text-lg lg:text-xl font-semibold">View History</h2>

          <span className="flex gap-3">
            <Button
              size="sm"
              onClick={() => {
                if (selectedLeaves.length === 0) {
                  setError("Please select a leave request.");
                  return;
                }

                if (selectedLeaves.length > 1) {
                  setError("Please select only one leave request.");
                  return;
                }

                setChangeReason("");
                setDialogOpen(true);
              }}
              disabled={selectedLeaves.length !== 1 || isActionLoading}
              className="rounded-full px-4 gap-2 cursor-pointer hover:scale-105 hover:shadow-xl duration-700 transition-all"
            >
              <Pen size={14} />{" "}
             <span className="hidden md:flex"> {isActionLoading ? "Processing..." : "Request Change"}</span>
            </Button>
            <Button
              size="sm"
              onClick={handleCancel}
              variant="outline"
              disabled={selectedLeaves.length !== 1 || isActionLoading}
              className="rounded-full px-4 gap-2 cursor-pointer hover:scale-105 hover:shadow-xl duration-700 transition-all"
            >
              <X size={14} />  <span className="hidden md:flex"> {isActionLoading ? "Cancelling..." : "Cancel"} </span>
            </Button>
          </span>
        </div>

        <div className="mt-4">
          <Alert className="border-border/60 bg-white shadow-sm">
            <InfoIcon className="h-4 w-4" />

            <AlertTitle className="font-medium">
              Review any pending requests and report to Management
            </AlertTitle>
            <AlertDescription className="text-xs md:text-sm">
              View all your leave requests managed here.
            </AlertDescription>
          </Alert>
        </div>

        <div className="mt-6">
          <Card className="px-6 gap-2">
            <Table>
              <TableCaption>A list of all your leaves.</TableCaption>
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
                  <TableHead className="lg:w-[120px]">Empl ID</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Leave Issued</TableHead>
                  <TableHead>Total Days</TableHead>
                  <TableHead>Reason for Rejection</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {leaves.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
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

                      <TableCell>{leave.employee_id}</TableCell>

                      <TableCell>{leave.reason}</TableCell>

                      <TableCell>
                        {format(new Date(leave.start_date), "MMM dd, yyyy")}
                        {" - "}
                        {format(new Date(leave.end_date), "MMM dd, yyyy")}
                      </TableCell>

                      <TableCell>{leave.total_days}</TableCell>

                      <TableCell>{leave.rejection_reason}</TableCell>

                      <TableCell className="text-right font-semibold capitalize">
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
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            <Dialog open={DialogOpen} onOpenChange={setDialogOpen}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Change Leave Request</DialogTitle>

                  <DialogDescription>
                    Update the reason and leave dates before resubmitting this
                    rejected request for review.
                  </DialogDescription>
                </DialogHeader>

                {selectedLeaves.length === 1 &&
                  (() => {
                    const selectedLeave = leaves.find(
                      (leave) => leave.id === selectedLeaves[0],
                    );

                    if (!selectedLeave) {
                      return (
                        <p className="text-sm text-red-500">
                          Leave request not found.
                        </p>
                      );
                    }

                    return (
                      <FieldGroup className="gap-4">
                        <FieldSeparator />

                        <Field>
                          <FieldLabel htmlFor="reason">
                            Reason for leave
                          </FieldLabel>
                          <Textarea
                            id="reason"
                            name="reason"
                            value={changeReason}
                            onChange={(e) => setChangeReason(e.target.value)}
                            autoComplete="off"
                            placeholder="Please mention your reason for leave"
                          />
                        </Field>

                        <Field className="w-60">
                          <FieldLabel htmlFor="date-picker-range">
                            Enter Leave Duration:
                          </FieldLabel>
                          <Popover>
                            <PopoverTrigger>
                              <Button
                                variant="outline"
                                id="date-picker-range"
                                className="flex justify-start px-2.5 font-normal w-full"
                              >
                                <CalendarIcon data-icon="inline-start" />

                                {date?.from ? (
                                  date.to ? (
                                    <>
                                      {format(date.from, "LLL dd, y")} -{" "}
                                      {format(date.to, "LLL dd, y")}
                                    </>
                                  ) : (
                                    format(date.from, "LLL dd, y")
                                  )
                                ) : (
                                  <span>Pick dates</span>
                                )}
                              </Button>
                            </PopoverTrigger>

                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="range"
                                selected={date}
                                onSelect={setDate}
                                numberOfMonths={2}
                              />
                            </PopoverContent>
                          </Popover>
                        </Field>
                      </FieldGroup>
                    );
                  })()}

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full px-4"
                    onClick={() => {
                      setDialogOpen(false);
                      setChangeReason("");
                      setDate({
                        from: undefined,
                        to: undefined,
                      });
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="button"
                    disabled={isActionLoading}
                    className="rounded-full px-4"
                    onClick={handleChange}
                  >
                    {isActionLoading ? "Resubmitting..." : "Resubmit Leave"}
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
