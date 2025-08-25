import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import FormData from 'form-data';


export const generateImage = async(prompt)=>{
    const formData = new FormData();
    formData.append("prompt", prompt);

    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API_KEY,
        },
        responseType: "arraybuffer",
      }
    );

    const base64image = `data:image/png;base64,${Buffer.from(
      data,
      "binary"
    ).toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64image);
    
    return result.secure_url;
}