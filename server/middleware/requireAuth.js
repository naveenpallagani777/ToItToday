import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

dotenv.config();

const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Authorization token required" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error(`JWT Verification Error: ${error.message}`);
        res.status(401).json({ error: "Invalid or expired token" });
    }
};

export default requireAuth;