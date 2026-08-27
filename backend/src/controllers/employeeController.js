import { createLeave, findLeavesByEmployee } from "../services/leaveServer.js"

export async function createLeaveRequest(req, res) {
 try {
  const {
    employee_id,
    leave_type_id,
    start_date,
    end_date,
    reason,
  } = req.body ?? {};
  
  if (
    !employee_id || !leave_type_id || !start_date || !end_date || !reason
  ) {
    return res.status(400).json({
      error: "employee_id, leave_type_id, start_date, end_date, reason are required!",
    });
  }
  
    const leaveRequest = await createLeave(req.body);

    return res.status(201).json({
      message: "Leave request submitted successfully",
      leaveRequest,
    });
  } catch (error) {
    console.error("Create leave request error:", error);

    return res.status(500).json({
      error: "Could not create a leave request",
    });
  }
}
 

export async function getMyLeaveRequest(req, res) {
  try {
    const { employee_id } = req.query;

    if (!employee_id) {
      return res.status(400).json({
        error: "employee_id is required",
      });
    }

    const leaveRequests = await findLeavesByEmployee(employee_id);

    return res.status(200).json({
      leaveRequests,
    });
  } catch (error) {
    console.error("Fetch employee leave requests error", error);

    return res.status(500).json({
      error: "Could not fetch leave requests",
    });
  }
}
