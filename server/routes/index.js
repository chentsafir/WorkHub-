import express from "express";
import userRoutes from "./userRoute.js";
import taskRoutes from "./taskRoute.js";

const router = express.Router();

/**
 * This file serves as the main entry point for all API routes.
 * It delegates requests to more specific route files based on the URL prefix.
 */

router.use("/user", userRoutes);  //api/user/login
router.use("/task", taskRoutes);

export default router;
