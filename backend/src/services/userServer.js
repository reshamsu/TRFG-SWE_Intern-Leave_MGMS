import pool from "../config/db.js";
// -----------------------------------------------------------------------------------

export async function approveUser(userId) {
  const result = await pool.query(
    `UPDATE public.users
     SET status = 'approved'
     WHERE id = $1
     RETURNING *`,
    [userId],
  );

  return result.rows[0];
}

export async function rejectUser(userId) {
  const result = await pool.query(
    `UPDATE public.users
     SET
       status = 'rejected'
     WHERE id = $1
       AND status = 'pending'
     RETURNING *`,
    [userId],
  );

  return result.rows[0] ?? null;
}

export async function getAllUsers() {
  const result = await pool.query(
    `SELECT id, name, email, role, status
     FROM public.users
     ORDER BY id ASC`,
  );

  return result.rows;
}