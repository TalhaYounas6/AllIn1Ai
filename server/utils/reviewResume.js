import fs from 'fs';
import pdf from 'pdf-parse/lib/pdf-parse.js';
import asyncHandler from "express-async-handler";
import {AI} from "../config/ai.js"



export const reviewResume = asyncHandler(async(resume)=>{
    
//    if(resume.size > (5 * 1024 * 1024)){
//     return res.json({success:false, message:"File size exceeds the limit of 5 MB"})
//    }

   const dataBuffer = fs.readFileSync(resume.path);
   const pdfData = await pdf(dataBuffer);

   const prompt =`Review this resume and provide contructive feedback on its 
    strengths,limitations, and areas of improvement. The feedback and review should be 
    according to modern standards. Resume Content: /n/n ${pdfData.text}`;


    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = response.choices[0].message.content;
    
    return content;

})