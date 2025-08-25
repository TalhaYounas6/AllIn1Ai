import express from "express";
import {auth} from "../../middlewares/auth.js"
import * as userServices from "../../services/user/index.js"

const router = express.Router();

router.get("/api/user/get-user-creations",auth,userServices.getUserCreations);
router.get("/api/user/get-published-creations",auth,userServices.getPublishedCreations);
router.post("/api/user/toggle-like-button",auth,userServices.toggleLikeCreation);

export default router;