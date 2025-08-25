import asyncHandler from "express-async-handler";
import {STATUS_CODES,TEXTS} from "../config/constants.js";

export const checkPremiumPlan = asyncHandler(async(req,res,next)=>{
    if (req.plan !== "premium" ) {
    return res.status(STATUS_CODES.UNAUTHORIZED).json({
      statusCode: STATUS_CODES.UNAUTHORIZED,
      message: TEXTS.PREMIUM_PLAN,
    });
  }
  next();
})