import {
  createLeave,
  findLeaves,
  cancelLeave,
  changeLeave,
} from "../services/leaveServer.js";

export async function handleCreateLeave(req, res) {
  try {
    const { employee_id, start_date, end_date, reason } = req.body ?? {};

    if (!employee_id || !start_date || !end_date || !reason) {
      return res.status(400).json({
        error: "employee_id, start_date, end_date, reason are required!",
      });
    }

    const leaveRequest = await createLeave({
      employee_id,
      start_date,
      end_date,
      reason,
    });

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

export async function handleGetMyLeave(req, res) {
  try {
    const { employee_id } = req.query;

    if (!employee_id) {
      return res.status(400).json({
        error: "employee_id is required",
      });
    }

    const leaveRequests = await findLeaves(employee_id);

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

export async function handleCancelMyLeave(req, res) {
  try {
    const { id } = req.params;

    const leave = await cancelLeave(id);

    if (!leave) {
      return res.status(404).json({
        error: "Leave request not found or cannot be cancelled",
      });
    }

    return res.status(200).json({
      message: "Leave cancelled successfully.",
      leave,
    });
  } catch (error) {
    console.error("cancel leave error:", error);

    return res.status(500).json({
      error: "Could not cancel leave.",
    });
  }
}

export async function handleChangeMyLeave(req, res) {
  try {
    const { id } = req.params;
    const { reason, startDate, endDate } = req.body;

    if (!reason || !startDate || !endDate) {
      return res.status(400).json({
        error: "Reason, start date, and end date are required.",
      });
    }

    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({
        error: "Start date cannot be after end date.",
      });
    }

    const leave = await changeLeave(id, reason, startDate, endDate);

    if (!leave) {
      return res.status(404).json({
        error: "Rejected leave request not found or cannot be changed.",
      });
    }

    return res.status(200).json({
      message: "Leave request changed and resubmitted successfully.",
      leave,
    });
  } catch (error) {
    console.error("change leave error:", error);

    return res.status(500).json({
      error: "Could not change leave.",
    });
  }
}
