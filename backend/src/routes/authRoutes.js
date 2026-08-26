import bcrypt from "bcrypt";
import pool from "../config/db.js";


export async function handleLogin(req, res) {
  //   console.log("Handle Auth Login is working!");

  try {
    // Defining email and password request
    const { email, password } = req.body ?? {}; // Note: if req.body is empty it will use an empty object instead.

    // Checking if email and password is entered
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and Password are required. Please try again",
      });
    }

    // Defining result by checking db selector 
    const result = await pool.query(
      "SELECT id, email, password FROM public.users WHERE email = $1",
      [email],
    );

    console.log("Result Displaying", result);

    // Checking if email and password exists in the table
    if (result.rows.length === 0) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }
 
    // Defining user from db
    const user = result.rows[0];
    // Defining hashPassword using bcrypt password matches the entered passowrd
    const passwordMatches = await bcrypt.compare(password, user.password);

    // Checking if user password matches the entered email id
    if (!passwordMatches) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Returns if email and password is valid success message is shown
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
      },
    });
    // If email or password failed error response message gives "Login failed"
  } catch (error) {
    console.log("Login Error", error);

    return res.status(500).json({
      error: "Login Server Error",
    });
  }
}

export async function handleRegister(req, res) {
  //   console.log("Handle Auth Register is working!");

  try {
    // Definig email and password to send request 
    const { email, password } = req.body ?? {};

    // Check if email or password is entered before submitting
    if (!email || !password) {
        return res.status(400).json({
            error: "Email and password are required",
        });
    }

    // Checking if passowrd follows the requirements of at least 6 characters
    if (password.length < 6) {
        return res.status (400).json ({
            error: "Password must be at least 6 characters",
        });
    }

    // Defining "existingUser" from the DB table users
    const existingUser = await pool.query(
        "SELECT id FROM public.users WHERE email = $1", [email],
    );

    // Check if user is existing in the table
    if (existingUser.rows.length > 0) {
        return res.status (409).json({
            error: "Email is already registered",
        })
    }

    // Defining hashPassword using bcrypt password package to encrypt password when creation
    const hashedPassowrd = await bcrypt.hash(password, 10);

    // Passes the result into table if user doesnt exist
    const result = await pool.query(
        `INSERT INTO public.users (email, password) 
        VALUES ($1, $2) 
        RETURNING id, email`, 
        [email, hashedPassowrd],
    );

    // if user doesnt exist new user is passed to table with success message
    return res.status (201).json({
        message: "Registration Successful",
        user: result.rows[0],
    });

    // if user exists or server down, response sends error message "Failed"
  } catch (error) {
    console.log("Registration Failed", error);
    return res.status(500).json({
        error: "Registration Error",
    });
  }
}

// export async function handleAuthMe(req, res) {
//   //   console.log("Handle Auth Me is working!");
//   res.json({ message: "Me route is working!" });
// }
