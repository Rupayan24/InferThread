import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "No token provided, authorization denied." });
  }

  const token = authHeader.split(" ")[1]?.trim();

  if (!token) {
    return res.status(401).json({ message: "Malformed authorization header." });
  }

  if (!process.env.JWT_SECRET) {
    console.error("FATAL: JWT_SECRET environment variable is not defined.");
    return res
      .status(500)
      .json({ message: "Internal server configuration error." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired." });
    }
    return res.status(401).json({ message: "Token is invalid." });
  }
};

export default authMiddleware;
