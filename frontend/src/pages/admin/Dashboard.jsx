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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Check, LucidePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [DialogOpen, setDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "User",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError("");

        const sessionData = sessionStorage.getItem("token");
        if (!sessionData) {
          throw new Error("No authentication token found. Please log in");
        }

        let token = sessionData;
        try {
          const parsed = JSON.parse(sessionData);
          if (parsed && parsed.token) token = parsed.token;
        } catch (error) {
          console.error("Approval error:", error);
        }

        const response = await fetch("http://localhost:8000/api/v1/admin/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        // console.log("👉 ACTUAL BACKEND RESPONSE DATA:", data);

        if (!response.ok) {
          throw new Error(data.message || "Could not fetch all user requests");
        }
        setUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log("Error here", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // console.log("CURRENT USERS STATE:", users);
  const pendingUsers = users.filter(
    (user) => user.status?.toLowerCase() === "pending",
  );

  if (isLoading) {
    return <p>Loading user requests...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const handleRegisterSubmit = async () => {
    try {
      setIsActionLoading(true);
      setError("");

      const sessionData = sessionStorage.getItem("token");
      let token = sessionData;
      try {
        const parsed = JSON.parse(sessionData || "");
        if (parsed && parsed.token) {
          token = parsed.token;
        }
      } catch (error) {
        console.warn("Token parsing skipped or failed:", error);
      }

      const response = await fetch(`http://localhost:8000/api/v1/admin/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not register new user.");
      }

      toast.success("User registered successfully!");
      setDialogOpen(false);
      setFormData({ name: "", email: "", password: "", role: "User" }); //
    } catch (error) {
      console.error("Register error:", error);

      toast.error(error.message || "Something went wrong", {
        description: error.message,
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleApprove = async () => {
    if (selectedUsers.length !== 1) {
      toast.error("Select a user request first.");
      return;
    }

    const userId = selectedUsers[0];

    try {
      setIsActionLoading(true);
      setError("");

      const token = sessionStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found. Please log in");
      }

      const response = await fetch(
        `http://localhost:8000/api/v1/admin/user/${userId}/approve`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not approve leave request.");
      }

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

      const token = sessionStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found. Please log in");
      }

      const response = await fetch(
        `http://localhost:8000/api/v1/admin/user/${userId}/reject`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
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
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((users) => users.id));
    }
  };

  return (
    <div className="min-h-screen bg-red-50">
      <section className="max-w-7xl mx-auto py-8 px-6 md:px-10 2xl:px-0 flex flex-col">
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold">Welcome Admin!</h3>
          <Button
            onClick={() => setDialogOpen(true)}
            size="sm"
            className="rounded-full px-4 cursor-pointer hover:scale-105 hover:shadow-xl duration-700 transition-all"
          >
            <LucidePlus size={16} /> New User
          </Button>
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
                      <TableHead>Role</TableHead>
                      <TableHead className="font-bold text-right">
                        Action
                      </TableHead>
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

                          <TableCell className="font-semibold capitalize">
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

                          <TableCell className="flex justify-end font-bold">
                            {" "}
                            <span className="flex gap-2">
                              <Button
                                size="xs"
                                variant="secondary"
                                onClick={handleApprove}
                                disabled={
                                  selectedUsers.length !== 1 || isActionLoading
                                }
                                className="success rounded-full px-3 cursor-pointer hover:scale-105 hover:shadow-xl duration-700 transition-all"
                              >
                                <Check size={16} />{" "}
                                {isActionLoading ? "Processing..." : "Approve"}
                              </Button>
                              <Button
                                size="xs"
                                onClick={handleReject}
                                disabled={
                                  selectedUsers.length !== 1 || isActionLoading
                                }
                                variant="destructive"
                                className="rounded-full px-3 cursor-pointer hover:scale-105 hover:shadow-xl duration-700 transition-all"
                              >
                                <X size={16} /> Reject
                              </Button>
                            </span>
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
                          <SelectItem value="user">User</SelectItem>
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
          </div>
        </div>
      </section>
    </div>
  );
}
