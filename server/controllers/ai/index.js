import express from "express";
import {auth} from "../../middlewares/auth.js";
import {checkUsageLimit} from "../../middlewares/checkUsageLimit.js";
import {checkPremiumPlan} from "../../middlewares/premiumCheck.js";
import * as aiServices from "../../services/ai/index.js";
import {upload} from "../../utils/multer.js";

const router = express.Router();

router.post("/api/ai/generate-article",auth,checkUsageLimit,aiServices.generateArticle);
router.post("/api/ai/generate-blog-title",auth,checkUsageLimit,aiServices.generateBlogTitle);
router.post("/api/ai/generate-image",auth,checkPremiumPlan,aiServices.generateImages);
router.post("/api/ai/remove-image-background",upload.single('image'),auth,checkPremiumPlan,aiServices.removeBg);
router.post("/api/ai/remove-image-object",upload.single('image'),auth,checkPremiumPlan,aiServices.removeObj);
router.post("/api/ai/review-resume",upload.single('resume'),auth,checkPremiumPlan,aiServices.resumeChecker);

export default router;