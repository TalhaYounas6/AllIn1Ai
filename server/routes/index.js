import express from "express"
import aiRoutes from "../controllers/ai/index.js";
import userRoutes from "../controllers/user/index.js"




const router = express.Router();

router.use(aiRoutes);
router.use(userRoutes);

export default router;