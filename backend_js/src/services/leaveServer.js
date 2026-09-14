import pool from "../config/db.js";

export async function createLeave({
  employee_id,
  start_date,
  end_date,
  reason,
}) {
  const result = await pool.query(
    `INSERT INTO public.leave_requests
        (
        employee_id,
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
        ($3::date - $2::date) + 1, 
        $4,
        'pending'
        )
        RETURNING
        id,
        employee_id,
        start_date,
        end_date,
        total_days,
        reason,
        status,
        created_at`,
    [employee_id, start_date, end_date, reason],
  );

  return result.rows[0];
}

export async function findLeaves(employeeId) {
  const result = await pool.query(
    `SELECT
        id,
        employee_id,
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
    [employeeId],
  );

  return result.rows;
}

// -----------------------------------------------------------------------------------

export async function approveLeave(id, approvedBy) {
  const result = await pool.query(
    `UPDATE public.leave_requests
     SET
       status = 'approved',
       approved_by = $1,
       approved_at = CURRENT_TIMESTAMP,
       updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
       AND status IN ('pending')
     RETURNING *`,
    [approvedBy, id],
  );

  return result.rows[0] ?? null;
}

export async function rejectLeave(id, approvedBy, rejectionReason) {
  const result = await pool.query(
    `UPDATE public.leave_requests
     SET
       status = 'rejected',
       approved_by = $1,
       rejection_reason = $2,
       updated_at = CURRENT_TIMESTAMP
     WHERE id = $3
       AND status IN ('pending', 'appr
     RETURNING *`,
    [approvedBy, rejectionReason, id],
  );

  return result.rows[0] ?? null;
}

export async function getAllLeaves() {
  const result = await pool.query(
    `SELECT
      id,
      employee_id,
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
     ORDER BY created_at ASC`,
  );

  return result.rows;
}

export async function cancelLeave(id) {
  const result = await pool.query(
    `UPDATE public.leave_requests
     SET status = 'cancelled',
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
       AND status IN ('pending', 'approved')
     RETURNING *`,
    [id],
  );

  return result.rows[0] ?? null;
}

export async function changeLeave(id, reason, startDate, endDate) {
  const result = await pool.query(
    `UPDATE public.leave_requests
     SET status = 'pending',
     reason = $2,
     start_date = $3,
     end_date = $4,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
       AND status = 'rejected'
     RETURNING *`,
    [id, reason, startDate, endDate],
  );

  return result.rows[0] ?? null;
}
