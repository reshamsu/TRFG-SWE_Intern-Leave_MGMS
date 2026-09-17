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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useEffect, useState } from "react";
<<<<<<< Updated upstream

import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// import { Link } from "react-router-dom";
=======
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowUpRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
>>>>>>> Stashed changes

export default function Dashboard() {
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isActionLoading, setIsActionLoading] = useState(false);
<<<<<<< Updated upstream
=======
  const [DialogOpen, setDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
  });
>>>>>>> Stashed changes

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        setIsLoading(true);
        setError("");

<<<<<<< Updated upstream
        const response = await fetch("http://localhost:8000/api/admin/users", {
=======
        const token = sessionStorage.getItem("token");

        if (!token) {
          throw new Error("No authentication token found. Please log in");
        }

        const response = await fetch(`http://localhost:8000/api/v1/leaves/my`, {
>>>>>>> Stashed changes
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not fetch all leave requests");
        }
<<<<<<< Updated upstream
        setUsers(Array.isArray(data.userRequests) ? data.userRequests : []);
=======
        setLeaves(Array.isArray(data.history) ? data.history : []);
>>>>>>> Stashed changes
      } catch (error) {
        console.log(error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaves();
  }, []);

<<<<<<< Updated upstream
  const pendingUsers = users.filter((user) => user.status === "pending");

=======
>>>>>>> Stashed changes
  if (isLoading) {
    return <p>Loading leave requests...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

<<<<<<< Updated upstream
  const handleApprove = async () => {
    if (selectedUsers.length !== 1) {
      toast.error("Select a user request first.");
      return;
    }

    const userId = selectedUsers[0];

=======
  const handleRegisterSubmit = async () => {
>>>>>>> Stashed changes
    try {
      setIsActionLoading(true);
      setError("");

<<<<<<< Updated upstream
      const response = await fetch(
        `http://localhost:8000/api/admin/users/${userId}/approve`,
        {
          method: "PUT",
          credentials: "include",
=======
      const token = sessionStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found. Please log in");
      }

      const response = await fetch(
        `http://localhost:8000/api/v1/users/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
>>>>>>> Stashed changes
        },
      );

      const data = await response.json();

      if (!response.ok) {
<<<<<<< Updated upstream
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
=======
        throw new Error(data.message || "Could not register new user.");
      }

      toast.success("User registered successfully!");
      setDialogOpen(false);
      setFormData({ name: "", email: "", password: "", role: "employee" }); //
    } catch (error) {
      console.error("Registeration error:", error);

      toast.error(error.message || "Something went wrong", {
>>>>>>> Stashed changes
        description: error.message,
      });
    } finally {
      setIsActionLoading(false);
    }
  };

<<<<<<< Updated upstream
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
=======
  function viewLeaves() {
    navigate("/dashboard/admin/leaves/");
  }

  return (
    <div className="bg-red-50">
      <section className="max-w-7xl mx-auto py-8 px-6 md:px-10 3xl:px-0 flex flex-col">
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold">Welcome Admin!</h3>
          <Button
            onClick={() => setDialogOpen(true)}
            size="sm"
            className="rounded-full px-4 cursor-pointer hover:scale-105 hover:shadow-xl duration-700 transition-all"
          >
            <Plus size={16} /> New User
          </Button>
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
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
=======
          <div className="mt-6 grid grid-cols-1 xl:grid-cols-[2fr_.64fr] gap-4">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold">Recent Leave Requests</h2>

                <Button
                  size="xs"
                  variant="outline"
                  onClick={viewLeaves}
                  className="rounded-full px-3 cursor-pointer hover:scale-105 hover:shadow-xl duration-700 transition-all"
                >
                  View All <ArrowUpRight size={20} />
                </Button>
>>>>>>> Stashed changes
              </div>

              <Card className="mt-3 px-6 gap-2">
                <Table>
                  <TableCaption className="lg:text-start xl:text-center">
                    A list of your recent leaves.
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
<<<<<<< Updated upstream
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
=======
                      <TableHead>Empl ID</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Leave Issued</TableHead>
                      <TableHead className="text-right">Status</TableHead>
>>>>>>> Stashed changes
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
                          <TableCell>{leave.id}</TableCell>

                          <TableCell>{leave.reason}</TableCell>

                          <TableCell>
                            {format(new Date(leave.start_date), "MMM dd, yyyy")}
                            {" - "}
                            {format(new Date(leave.end_date), "MMM dd, yyyy")}
                          </TableCell>

<<<<<<< Updated upstream
                          <TableCell>{user.id}</TableCell>

                          <TableCell>{user.name}</TableCell>

                          <TableCell>{user.email}</TableCell>

=======
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======

            <Dialog open={DialogOpen} onOpenChange={setDialogOpen}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Register New User</DialogTitle>
                  <DialogDescription>
                    Create a new user account profile here. Click save when
                    you're done.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="password">Set Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="grid gap-2 m-0">
                    <Label htmlFor="role">Assign Role</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) =>
                        setFormData({ ...formData, role: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Roles</SelectLabel>
                          <SelectItem value="employee">Employee</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <DialogFooter className="pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full px-3"
                      onClick={() => setDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="rounded-full px-3"
                      disabled={isActionLoading}
                    >
                      {isActionLoading ? "Registering..." : "Save User"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
>>>>>>> Stashed changes
          </div>
        </div>
      </section>
    </div>
  );
}
