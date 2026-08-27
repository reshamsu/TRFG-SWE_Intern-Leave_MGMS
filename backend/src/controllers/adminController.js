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
    const { approved_by } = req.body ?? {};

    if (!approved_by) {
      return res.status(400).json({
        error: "approved_by is required",
      });
    }

    const leaveRequests = await approveLeave(id, approved_by);

    if (!leaveRequests) {
      return res.status(404).json({
        error: "Pending leave request not found",
      });
    }

    return res.status(200).json({
      message: "Leave request approved successfully",
      leaveRequests,
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
    const { approved_by, rejection_reason } = req.body ?? {};

    if (!approved_by || !rejection_reason) {
      return res.status(400).json({
        error: "approved_by and rejection_reason are required",
      });
    }

    const leaveRequest = await rejectLeave(
      id,
      approved_by,
      rejection_reason,
    );

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