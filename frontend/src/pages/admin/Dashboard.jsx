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
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { ArrowUpRight, Check, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

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
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [DialogOpen, setDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
  });

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        setIsLoading(true);
        setError("");

        const token = sessionStorage.getItem("token");

        if (!token) {
          throw new Error("No authentication token found. Please log in");
        }

        const response = await fetch(`http://localhost:8000/api/v1/leaves/my`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        // console.log("👉 ACTUAL BACKEND RESPONSE DATA:", data);

        if (!response.ok) {
          throw new Error(data.message || "Could not fetch all leave requests");
        }
        setUsers(Array.isArray(data.history) ? data.history : []);
      } catch (error) {
        console.log(error);
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

  const handleRegisterSubmit = async () => {
    try {
      setIsActionLoading(true);
      setError("");

      const token = sessionStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found. Please log in");
      }

      const response = await fetch(
        `http://localhost:8000/api/v1/admin/users/register`,
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
        throw new Error(data.message || "Could not register new user.");
      }

      toast.success("User registered successfully!");
      setDialogOpen(false);
      setFormData({ name: "", email: "", password: "", role: "employee" }); //
    } catch (error) {
      console.error("Registeration error:", error);

      toast.error(error.message || "Something went wrong", {
        description: error.message,
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  function viewLeaves() {
    navigate("/dashboard/employee/leave/history");
  }

  return (
    <div className="min-h-screen bg-red-50">
      <section className="max-w-7xl mx-auto py-8 px-6 md:px-10 2xl:px-0 flex flex-col">
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
              </div>

              <Card className="mt-3 px-6 gap-2">
                <Table>
                  <TableCaption className="lg:text-start xl:text-center">
                    A list of your recent leaves.
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empl ID</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Leave Issued</TableHead>
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
                          <TableCell>{leave.id}</TableCell>

                          <TableCell>{leave.reason}</TableCell>

                          <TableCell>
                            {format(new Date(leave.start_date), "MMM dd, yyyy")}
                            {" - "}
                            {format(new Date(leave.end_date), "MMM dd, yyyy")}
                          </TableCell>

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
          </div>
        </div>
      </section>
    </div>
  );
}
