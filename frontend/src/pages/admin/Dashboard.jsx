// import React from 'react'
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";

import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// import { Link } from "react-router-dom";

export default function Dashboard() {
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
          throw new Error(data.message || "Could not fetch all user requests");
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

  const pendingUsers = users.filter((user) => user.status === "pending");

  if (isLoading) {
    return <p>Loading user requests...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const handleApprove = async () => {
    if (selectedUsers.length !== 1) {
      toast.error("Select a user request first.");
      return;
    }

    const userId = selectedUsers[0];

    try {
      setIsActionLoading(true);
      setError("");

      const response = await fetch(
        `http://localhost:8000/api/admin/users/${userId}/approve`,
        {
          method: "PUT",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not approve leave request.");
      }

      // Update the table immediately
      setUsers((currentUsers) =>
        currentUsers.filter((user) => user.id !== userId),
      );
      setSelectedUsers([]);

      toast.success("User request approved", {
        description: "The employee's user request was approved.",
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
      toast.error("Select a user id first.");
      return;
    }

    const userId = selectedUsers[0];

    try {
      setIsActionLoading(true);
      setError("");

      const response = await fetch(
        `http://localhost:8000/api/admin/users/${userId}/reject`,
        {
          method: "PUT",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not reject user request.");
      }

      // Update table immediately
      setUsers((currentUsers) =>
        currentUsers.filter((user) => user.id !== userId),
      );
      setSelectedUsers([]);

      toast.success("User request rejected", {
        description: "The employee's user request was rejected.",
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
      setSelectedUsers(users.map((users) => users.id));
    }
  };

  return (
    <div className="min-h-screen bg-red-50">
      <section className="max-w-6xl mx-auto py-10 px-6 md:px-10 2xl:px-0 flex flex-col">
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold">Welcome Admin!</h3>
        </div>

        <div className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 gap-4">
            <Card className="px-6 gap-2">
              <CardTitle className="font-semibold">All Employees</CardTitle>

              <CardDescription>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </CardDescription>
            </Card>
            <Card className="px-6 gap-2">
              <CardTitle className="font-semibold">All Requests</CardTitle>

              <CardDescription>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </CardDescription>
            </Card>
            <Card className="px-6 gap-2">
              <CardTitle className="font-semibold">Available Leave</CardTitle>

              <CardDescription>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </CardDescription>
            </Card>
            <Card className="px-6 gap-2">
              <CardTitle className="font-semibold">On Leave</CardTitle>

              <CardDescription>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </CardDescription>
            </Card>
          </div>

          <div className="mt-6 grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-4">
            <div className="flex flex-col items-start justify-between">
              <div className="flex items-center justify-between w-full">
                <h2 className="text-sm font-semibold">Recent User Requests</h2>

                <span className="flex gap-2">
                  <Button
                    size="xs"
                    onClick={handleApprove}
                    disabled={selectedUsers.length !== 1 || isActionLoading}
                    className="rounded-full px-3 cursor-pointer hover:scale-105 hover:shadow-xl duration-700 transition-all"
                  >
                    <Check size={16} />{" "}
                    {isActionLoading ? "Processing..." : "Approve"}
                  </Button>
                  <Button
                    size="xs"
                    onClick={handleReject}
                    disabled={selectedUsers.length !== 1 || isActionLoading}
                    variant="destructive"
                    className="rounded-full px-3 cursor-pointer hover:scale-105 hover:shadow-xl duration-700 transition-all"
                  >
                    <X size={16} /> Reject
                  </Button>
                </span>
              </div>

              <Card className="mt-3 px-6 gap-2 w-full">
                <Table>
                  <TableCaption>A list of all recent registers.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={
                            users.length > 0 &&
                            selectedUsers.length === users.length
                          }
                          onCheckedChange={toggleAllUsers}
                          aria-label="Select all user requests"
                        />
                      </TableHead>
                      <TableHead>User ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-right">Role</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {pendingUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          <p>No users requests found.</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      pendingUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedUsers.includes(user.id)}
                              onCheckedChange={() => toggleUser(user.id)}
                              aria-label={`Select users request ${user.id}`}
                            />
                          </TableCell>

                          <TableCell>{user.id}</TableCell>

                          <TableCell>{user.name}</TableCell>

                          <TableCell>{user.email}</TableCell>

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

            <div>
              <h2 className="text-sm font-semibold">Overall Performance</h2>

              <Card className="mt-3 px-6 gap-2">
                <CardTitle className="font-semibold">Status Body</CardTitle>

                <CardDescription>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </CardDescription>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
