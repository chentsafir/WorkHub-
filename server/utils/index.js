import jwt from "jsonwebtoken";

/**
 * Generates a JSON Web Token (JWT) for a given user ID and sets it as a secure,
 * HTTP-only cookie on the response object. This is a standard method for creating
 * a user session after a successful login.
 */
const createJWT = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 days
  });
};

export default createJWT;
