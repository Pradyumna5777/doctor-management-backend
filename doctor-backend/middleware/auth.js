import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1]; // 'Bearer <token>'
  if (!token) return res.status(401).json({ error: "Token missing" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // payload must contain {id, role}
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}


//
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = decoded;
    next();
  });
};