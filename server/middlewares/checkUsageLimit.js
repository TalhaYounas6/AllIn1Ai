import asyncHandler from "express-async-handler";
import {STATUS_CODES,TEXTS} from "../config/constants.js";

export const checkUsageLimit = asyncHandler(async(req,res,next)=>{
    if (req.plan !== "premium" && req.free_usage>=10) {
    return res.status(STATUS_CODES.UNAUTHORIZED).json({
      statusCode: STATUS_CODES.UNAUTHORIZED,
      message: TEXTS.UPDATE_PLAN,
    });
  }
  next();
})