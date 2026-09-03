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
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { toast } from "sonner";

export default function UserRequests() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch("http://localhost:8000/api/admin/users", {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not fetch all users");
        }
        setUsers(Array.isArray(data.userRequests) ? data.userRequests : []);
      } catch (error) {
        console.log("Error here", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (isLoading) {
    return <p>Loading users...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const handleApprove = async () => {
    if (selectedUsers.length !== 1) {
      toast.error("Select a leave request first.");
      return;
    }

    const userId = selectedUsers[0];

    try {
      setIsActionLoading(true);
      setError("");

      const response = await fetch(
        `http://localhost:8000/api/admin/leaves/${userId}/approve`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
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
      setUsers((currentLeaves) =>
        currentLeaves.map((user) =>
          user.id === userId
            ? {
                ...user,
                status: "approved",
              }
            : user,
        ),
      );

      // Clear checkbox
      setSelectedUsers([]);

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
    if (selectedUsers.length === 0) {
      setError("Please select a leave request.");
      return;
    }

    if (selectedUsers.length > 1) {
      setError("Please select only one leave request.");
      return;
    }

    const userId = selectedUsers[0];

    // const rejectionReason = window.prompt(
    //   "Enter the reason for rejecting this leave request:",
    // );

    try {
      setIsActionLoading(true);
      setError("");

      const response = await fetch(
        `http://localhost:8000/api/admin/leaves/${userId}/reject`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            approvedBy: 1,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not reject leave request.");
      }

      // Update table immediately
      setUsers((currentLeaves) =>
        currentLeaves.map((user) =>
          user.id === userId
            ? {
                ...user,
                status: "rejected",
              }
            : user,
        ),
      );

      // Clear selection
      setSelectedUsers([]);

      toast.success("Leave request rejected", {
        description: "The employee's leave request was rejected.",
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

  const toggleUser = (userId) => {
    setSelectedUsers((current) =>
      current.includes(userId)
        ? current.filter((id) => id !== userId)
        : [...current, userId],
    );
  };

  const toggleAllUsers = () => {
    if (selectedUsers.length === users.length) {
      // Unselect all
      setSelectedUsers([]);
    } else {
      // Select all
      setSelectedUsers(users.map((user) => user.id));
    }
  };

  return (
    <div className="min-h-screen bg-red-50">
      <section className="max-w-6xl mx-auto py-10 px-6 md:px-10 2xl:px-0 flex flex-col min-h-screen px-4">
        <div className="flex justify-between">
          <h2 className="text-lg font-semibold">All Users</h2>

          <span className="flex gap-3">
            <Button
              size="sm"
              onClick={handleApprove}
              disabled={selectedUsers.length !== 1 || isActionLoading}
              className="rounded-full px-4 cursor-pointer hover:scale-105 hover:shadow-xl duration-700 transition-all"
            >
              <Check size={16} />{" "}
               <span className="hidden md:flex">{isActionLoading ? "Processing..." : "Approve"}</span>
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleReject}
              disabled={selectedUsers.length !== 1 || isActionLoading}
              className="rounded-full px-4 cursor-pointer hover:scale-105 hover:shadow-xl duration-700 transition-all"
            >
              <X size={16} /> <span className="hidden md:flex"> Reject</span>
            </Button>
          </span>
        </div>

        <div className="mt-4">
          <Card className="px-6 gap-2">
            <Table>
              <TableCaption>All available users registered.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        users.length > 0 &&
                        selectedUsers.length === users.length
                      }
                      onCheckedChange={toggleAllUsers}
                      aria-label="Select all users"
                    />
                  </TableHead>
                  <TableHead className="w-[140px]">User ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      <p>No users found.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={() => toggleUser(user.id)}
                          aria-label={`Select user ${user.id}`}
                        />
                      </TableCell>

                      <TableCell>{user.id}</TableCell>

                      <TableCell>{user.name}</TableCell>

                      <TableCell>{user.email}</TableCell>

                      <TableCell className="capitalize">{user.role}</TableCell>

                      <TableCell className="text-right font-semibold capitalize">
                        <Badge
                          variant={
                            user.status === "approved"
                              ? "secondary"
                              : user.status === "rejected"
                                ? "destructive"
                                : "secondary"
                          }
                          className={
                            user.status === "pending"
                              ? "primary"
                              : user.status === "approved"
                                ? "success"
                                : user.status === "rejected"
                                  ? "danger"
                                  : user.status === "cancelled"
                                    ? "caution"
                                    : ""
                          }
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      </section>
    </div>
  );
}
