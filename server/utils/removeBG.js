import { v2 as cloudinary } from "cloudinary";


export const removeBackground = async(image)=>{
    const result = await cloudinary.uploader.upload(image.path,{
          transformation: [
            {
              effect:'background removal',
              background_removal: 'remove_the_background',
            }
          ]
        });

     return result.secure_url;   

}