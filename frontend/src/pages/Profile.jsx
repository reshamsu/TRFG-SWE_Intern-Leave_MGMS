// import * as React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";

export default function EditProfile() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isActionLoading, setIsActionLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        setError("");

        const token = sessionStorage.getItem("token");

        if (!token) {
          throw new Error("No authentication token found. Please log in");
        }

        const response = await fetch("http://localhost:8000/api/v1/users/my", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not fetch current users");
        }

        if (data && Array.isArray(data.current) && data.current.length > 0) {
          const currentUser = data.current[0];

            setUser(currentUser.id || currentUser._id);
            setFormData({
              name: currentUser.name || "",
              email: currentUser.email || "",
              password: "",
            });
          
        }
      } catch (error) {
        console.log(error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleEdit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("User ID not found. Cannot update profile");
      return;
    }

    try {
      setIsActionLoading(true);
      setError("");

      const token = sessionStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found. Please log in");
      }

      const updateData = {
        name: formData.name,
        email: formData.email,
      };
      if (formData.password.trim() !== "") {
        updateData.password = formData.password;
      }

      const response = await fetch(
        `http://localhost:8000/api/v1/users/${user}/edit`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not edit user info.");
      }

      toast.success("Profile updated successfully", {
        description: "Your profile was edited.",
      });

      setFormData((prev) => ({ ...prev, password: "" }));
    } catch (error) {
      console.error("Profile edit error:", error);
      toast.error("Profile edit failed", {
        description: error.message,
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-red-50">
        <p className="text-sm text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="bg-red-50 min-h-screen">
      <section className="max-w-7xl mx-auto py-8 px-6 md:px-10 3xl:px-0 flex flex-col">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">My Profile</h2>
        </div>

        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-md p-7">
          <form onSubmit={handleEdit}>
            {error && (
              <p className="text-sm text-center text-red-600 px-4 mb-4 py-2 bg-red-100 border border-red-200 rounded-lg">
                {error}
              </p>
            )}

            <FieldGroup>
              <FieldSet>
                <FieldLegend className="mb-2 text-base font-medium text-foreground">
                  Edit Profile Information
                </FieldLegend>
                <FieldDescription>
                  Update your display configurations inside the platform.
                </FieldDescription>

                <FieldGroup className="gap-6 mt-4">
                  <Field>
                    <FieldLabel htmlFor="input-field-username">
                      Your Name
                    </FieldLabel>
                    <Input
                      id="input-field-username"
                      type="text"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="input-field-email">
                      Your Email Address
                    </FieldLabel>
                    <Input
                      id="input-field-email"
                      type="email"
                      placeholder="Enter your Email Address"
                      value={formData.email}
                      disabled
                      className="bg-zinc-50 border-zinc-200 text-muted-foreground cursor-not-allowed"
                    />
                    <FieldDescription className="text-xs">
                      You cannot alter your email address.
                    </FieldDescription>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="input-field-password">
                      Update New Password
                    </FieldLabel>
                    <Input
                      id="input-field-password"
                      type="password"
                      placeholder="Leave blank to keep current password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>

              <Field
                orientation="horizontal"
                className="gap-2 flex justify-end mt-6"
              >
                <Button
                  type="submit"
                  disabled={isActionLoading}
                  className="rounded-full px-6 transition-all active:scale-95 duration-200"
                >
                  {isActionLoading ? "Updating..." : "Update Profile"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </div>
      </section>
    </div>
  );
}
