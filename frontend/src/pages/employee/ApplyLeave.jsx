import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";
// import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNavigate } from "react-router-dom";

export default function ApplyLeave() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const user = JSON.parse(sessionStorage.getItem("user"));

  async function handleCreateRequest(event) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      if (!date?.from || !date?.to) {
        throw new Error("Please select a start and end date.");
      }

      const response = await fetch("http://localhost:8000/api/leaves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_id: user.id,
          start_date: format(date.from, "yyyy-MM-dd"),
          end_date: format(date.to, "yyyy-MM-dd"),
          reason: formData.get("reason"),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Create Request Failed");
      }

      navigate("/employee/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const [date, setDate] = React.useState({
    from: undefined,
    to: undefined,
  });

  return (
    <div className="min-h-screen bg-red-50">
      <section className="max-w-6xl mx-auto py-10 px-6 md:px-10 2xl:px-0 flex flex-col min-h-screen px-4">
        <div className="flex justify-between">
          <h1 className="text-lg font-semibold">Apply for Leave</h1>
        </div>

        <div className="mt-4 w-full max-w-2xl bg-white rounded-3xl shadow-md p-7">
          <form onSubmit={handleCreateRequest}>
            {error && (
              <p className="text-sm text-center text-red-600 px-4 py-2 bg-red-100 border border-red-200 rounded-lg">
                {error}
              </p>
            )}

            <FieldGroup>
              <FieldSet>
                <FieldLegend className="mb-2">
                  Create New Leave Request
                </FieldLegend>
                <FieldDescription>
                  Note: All leave requests will be sent for approval
                </FieldDescription>

                <FieldGroup className="gap-6">
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

                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="range"
                          selected={date}
                          onSelect={setDate}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                  </Field>

                  <FieldSeparator />

                  <Field>
                    <FieldLabel htmlFor="reason">Reason for leave</FieldLabel>
                    <Textarea
                      id="reason"
                      name="reason"
                      autoComplete="off"
                      placeholder="Please mention your reason for leave"
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>

              <Field orientation="horizontal" className="gap-2">
                <Button
                  type="submit"
                  size="sm"
                  disabled={isLoading}
                  className="rounded-full px-5"
                >
                  {isLoading ? "Submitting..." : "Submit"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full px-4"
                  type="button"
                >
                  Cancel
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </div>
      </section>
    </div>
  );
}
