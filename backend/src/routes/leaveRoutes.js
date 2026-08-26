import pool from "../config/db.js";

export async function handleLeavePOST(req, res) {
  try {
    // Defining the below values only from the DB table
    const { employee_id, leave_type_id, start_date, end_date, reason } =
      req.body ?? {};

    // Checking if these are entered, if not an error will be passed
    if (!employee_id || !leave_type_id || !start_date || !end_date || !reason) {
      return res.status(400).json({
        error:
          "employeeId, leaveTypeTd, startDate, endDate, reason are required",
      });
    }

    // Checking if the start date is only after the end date
    if (new Date(start_date) > new Date(end_date)) {
      return res.status(400).json({
        error: "The Start Date cannot be after the End Date",
      });
    }

    // Defining result to insert data into the db table in pool by query
    const result = await pool.query(
      `INSERT INTO public.leave_requests
        (
        employee_id,
        leave_type_id,
        start_date,
        end_date,
        total_days,
        reason, 
        status
        )
        VALUES 
      (
        $1,
        $2,
        $3,
        $4,
      ($4::date - $3::date) + 1,
      $5,
      'pending'
    )
      RETURNING
      id,
      employee_id,
      leave_type_id,
      start_date,
      end_date,
      total_days,
      reason,
      status,
      created_at`,
      [employee_id, leave_type_id, start_date, end_date, reason],
    );

    // Checking if new data passed successfully with successful response message
    return res.status(201).json({
      message: "Leave request submitted successfully",
      leaveRequests: result.rows[0],
    });

    // Checking if data is passed or no, if failed error will be displayed
  } catch (error) {
    console.error("Create leave request error: ", error);

    // Checking if server error issue, error message will be shown 
    return res.status(500).json({
      error: "Failed to fetch Leave POST",
    });
  }
}

export async function handleLeaveID(req, res) {
 
    try {
        // Defnining to find employee_id by id
        const { employee_id } = req.query;

        // Checking if the employee_id is entered before passing
        if (!employee_id) {
            return res.status(400).json({
                error: "Employee_Id is required",
            });
        }

        // Defining result by fetching an ID using select query
        const result = await pool.query(
            `SELECT
            id,
            employee_id,
            leave_type_id
            start_date,
            end_date,
            total_days,
            reason,
            status,
            approved_by,
            approved_at,
            rejection_reason,
            created_at,
            updated_at
            FROM public.leave_requests
            WHERE employee_id = $1
            ORDER BY created_at DESC`,
            [employee_id],
        );

        // Checking if record is fetched successfully leaveRequests it will display all rows
        return res.status(200).json({
            leaveRequests: result.rows,
        });

        // Checking if leave request record doesnt exist, error will be displayed
    } catch (error) {
        console.error("Fetching employee leave request error", error);

        // Checking if any issue last here it will result in the server runtime
        return res.status(500).json ({
            error: "Could not fetch employee leave requests",
        });
    }
}

export async function handleLeaveGET(req, res) {

    try {
        const result = await pool.query(
            `SELECT 
            id,
            employee_id,
            leave_type_id,
            start_date,
            end_date,
            total_days,
            reason,
            status,
            approved_by,
            approved_at,
            rejection_reason,
            created_at,
            updated_at
            FROM public.leave_requests
            ORDER BY created_at DESC`,
        );

        return res.status(200).json({
            leaveRequests: result.rows,
        });
    } catch (error) {
        console.error("Fetching leave requests error:", error);
        
        return res.status(500).json({
            error: "Could not fetch leave requests",
        });
    }
}

export function handleLeaveApprove(req, res) {
  return res.json({ message: "Handles Leave Approved" });
}

export function handleLeaveReject(req, res) {
  return res.json({ message: "Handles Leave Rejected" });
}
