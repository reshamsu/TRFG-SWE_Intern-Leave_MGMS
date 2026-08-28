import pool from "../config/db.js";
import {
  getAllLeaves,
  approveLeave,
  rejectLeave,
} from "../services/leaveServer.js";

export async function handleGETAllLeaves(req, res) {
  try {
    const leaveRequests = await getAllLeaves();

    return res.status(200).json({
      leaveRequests,
    });
  } catch (error) {
    console.error("Fetch all leaves error:", error);

    return res.status(500).json({
      error: "Could not fetch all leave requests",
    });
  }
}

export async function handleApproveLeave(req, res) {
  try {
    const { id } = req.params;
    const { approvedBy } = req.body;

    if (!approvedBy) {
      return res.status(400).json({
        message: "approvedBy is required",
      });
    }

    const result = await pool.query(
      `SELECT id
     FROM public.users
     WHERE id = $1
     AND role = 'admin'
     LIMIT 1`,
      [approvedBy],
    );

    if (result.rows.length === 0) {
      return res.status(403).json({
        message: "You are not authorized to approve requests",
      });
    }

    const leaveRequest = await approveLeave(id, approvedBy);

    if (!leaveRequest) {
      return res.status(404).json({
        error: "Pending leave request not found",
      });
    }

    return res.status(200).json({
      message: "Leave request approved successfully",
      leaveRequest,
    });
  } catch (error) {
    console.error("Approve leave error", error);

    return res.status(500).json({
      error: "Could not approve leave request",
    });
  }
}

export async function handleRejectLeave(req, res) {
  try {
    const { id } = req.params;
    const { approvedBy, rejectionReason } = req.body ?? {};

    if (!approvedBy || !rejectionReason) {
      return res.status(400).json({
        error: "approvedBy and rejectionReason are required",
      });
    }

    const result = await pool.query(
      `SELECT id
     FROM public.users
     WHERE id = $1
     AND role = 'admin'
     LIMIT 1`,
      [approvedBy],
    );

    if (result.rows.length === 0) {
      return res.status(403).json({
        message: "You are not authorized to reject requests",
      });
    }

    const leaveRequest = await rejectLeave(id, approvedBy, rejectionReason);

    if (!leaveRequest) {
      return res.status(404).json({
        error: "Pending leave request not found",
      });
    }

    return res.status(200).json({
      message: "Leave request rejected successfully",
      leaveRequest,
    });
  } catch (error) {
    console.error("Reject leave error:", error);

    return res.status(500).json({
      error: "Could not reject leave request",
    });
  }
}
