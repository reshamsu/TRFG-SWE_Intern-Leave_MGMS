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
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, LucidePlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function Dashboard() {
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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

        console.log("Frontend employee ID:", employee_id);

        const response = await fetch(
          `http://localhost:8000/api/leaves/my?employee_id=${employee_id}`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not fetch all leave requests");
        }
        setLeaves(Array.isArray(data.leaveRequests) ? data.leaveRequests : []);
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

  function createLeave() {
    navigate("/employee/leave/new");
  }

  function viewLeaves() {
    navigate("/employee/leave/history");
  }

  return (
    <div className="min-h-screen bg-red-50">
      <section className="max-w-6xl mx-auto py-10 px-6 md:px-10 2xl:px-0 flex flex-col">
        <div className="flex justify-between">
          <h2 className="text-lg font-semibold">Welcome Empl!</h2>

          <Button
            onClick={createLeave}
            size="sm"
            className="rounded-full px-4 cursor-pointer hover:scale-105 hover:shadow-xl duration-700 transition-all"
          >
            <LucidePlus size={16} /> New Request
          </Button>
        </div>

        <div className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 gap-4">
            <Card className="px-6 gap-2">
              <CardTitle className="font-semibold">All Requests</CardTitle>

              <CardDescription>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </CardDescription>
            </Card>
            <Card className="px-6 gap-2">
              <CardTitle className="font-semibold">Available Leaves</CardTitle>

              <CardDescription>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </CardDescription>
            </Card>
          </div>

          <div className="mt-6 grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-4">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold">My Recent Requests</h2>

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
                          <TableCell>{leave.employee_id}</TableCell>

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
              <h2 className="text-sm font-semibold">My Performance</h2>

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
