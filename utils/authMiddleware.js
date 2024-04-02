import JWT from "jsonwebtoken";

export const requireSignin = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "Authentication header missing" });
    }
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.body.userId = decode.userId;
    next();
  } catch (error) {
    console.error(error);
    if (error.name === "TokenExpiredError") {
      res.status(401).json({ message: "JWT expired" });
    } else {
      res.status(401).json({ message: "Invalid authentication" });
    }
  }
};
