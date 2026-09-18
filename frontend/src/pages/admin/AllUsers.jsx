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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Pen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function UserRequests() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [DialogOpen, setDialogOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError("");

        const token = sessionStorage.getItem("token");

        if (!token) {
          throw new Error("No authentication token found. Please log in");
        }

        const response = await fetch("http://localhost:8000/api/v1/users/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not fetch all users");
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

  const openEditDialog = (user) => {
    setEditingUserId(user.id);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      password: user.passowrd,
      role: user.role || "employee",
    });
    setDialogOpen(true);
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    const userId = editingUserId || selectedUsers[0];

    try {
      setIsActionLoading(true);
      setError("");

      const token = sessionStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found. Please log in");
      }

      const response = await fetch(
        `http://localhost:8000/api/v1/users/${userId}/edit`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not approve leave request.");
      }

      setUsers((currentLeaves) =>
        currentLeaves.map((user) =>
          user.id === userId
            ? {
                ...user,
              }
            : user,
        ),
      );

      // Clear checkbox
      setSelectedUsers([]);
      setEditingUserId(null);
      setDialogOpen(false);

      toast.success("Profile updated successfully", {
        description: "Your profile was edited.",
      });
    } catch (error) {
      console.error("Profile edit error:", error);
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

  if (isLoading) {
    return <p>Loading users...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="bg-red-50">
      <section className="max-w-7xl mx-auto py-8 px-6 md:px-10 3xl:px-0 flex flex-col px-4">
        <div className="flex justify-between">
          <h2 className="text-lg font-semibold">All Users</h2>
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
                  <TableHead className="w-[90px]">User ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right font-bold">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
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

                      <TableCell className="font-semibold capitalize">
                        <Badge
                          variant={
                            user.status === "active"
                              ? "secondary"
                              : user.status === "deleted"
                                ? "destructive"
                                : "secondary"
                          }
                          className={
                            user.status === "active"
                              ? "primary"
                              : user.status === "deleted"
                                ? "danger"
                                : user.status === "suspended"
                                  ? "caution"
                                  : ""
                          }
                        >
                          {user.status}
                        </Badge>
                      </TableCell>

                      <TableCell className="flex justify-end font-semibold capitalize">
                        <span className="flex gap-2">
                          <Button
                            size="xs"
                            varient="secondary"
                            onClick={() => openEditDialog(user)}
                            disabled={
                              selectedUsers.length !== 1 || isActionLoading
                            }
                            className="rounded-full px-3 cursor-pointer hover:scale-105 hover:shadow-xl duration-700 transition-all"
                          >
                            <Pen size={16} />{" "}
                            <span className="hidden md:flex">
                              {isActionLoading ? "Processing..." : "Edit"}
                            </span>
                          </Button>
                          <Button
                            size="xs"
                            variant="destructive"
                            onClick={0}
                            disabled={
                              selectedUsers.length !== 1 || isActionLoading
                            }
                            className="rounded-full px-3 cursor-pointer hover:scale-105 hover:shadow-xl duration-700 transition-all"
                          >
                            <X size={16} />{" "}
                            <span className="hidden md:flex"> Delete</span>
                          </Button>
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>

          <Dialog open={DialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Update new information on account profile here. Click save
                  when you're done.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleEdit} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="edit-name"
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
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">Confrim Password</Label>
                  <Input
                    id="edit-password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
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
                    {isActionLoading ? "updating..." : "Update Profile"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </div>
  );
}
