import { v2 as cloudinary } from "cloudinary";


export const removeObject = async(image,object)=>{
    const { public_id } = await cloudinary.uploader.upload(image.path)
    
    const imageUrl = cloudinary.url(public_id,{
      transformation:[{effect:`gen_remove:${object}`}],
      resource_type: 'image'
    })

    return imageUrl;
}