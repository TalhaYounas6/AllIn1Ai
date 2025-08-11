import sql from "../config/db.js"

export const getUserCreations = async(req,res)=>{
        try {
            const {userId} = req.auth();
            const creations = await sql`SELECT * from creations where user_id=${userId} ORDER BY created_at DESC`;

            res.json({success:true,creations})
        } catch (error) {
            return res.json({success:false, message: error.message})
        }
}

export const getPublishedCreations = async(req,res)=>{
    try {
     const publishedCreations= await sql `SELECT * from creations WHERE publish=true ORDER BY created_at DESC`;
     res.json({success:true,publishedCreations})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

export const toggleLikeCreation = async(req,res)=>{
    try {
        const {userId} = req.auth();
        const {id} = req.body;

        const [creation] = await sql`SELECT * from creations where id=${id}`;

        const currentLikes = creation.likes;
        const userIdStr = userId.toString();
        let updatedLikes;
        let message;

        if(currentLikes.includes(userIdStr)){
            updatedLikes = currentLikes.filter((i)=> i!=userIdStr);
            message="Creation Unliked";
        } else{
            updatedLikes = [...currentLikes,userIdStr]
            message = "Creation Liked";
        }

        const formattedarray = `{${updatedLikes.join(',')}}`

        await sql`UPDATE creations SET likes=${formattedarray}::text[] where id=${id}`
        
        if(!creation){
            return res.json({success:false,message:"Creation not found"})
        }

        res.json({success:true,message})


    } catch (error) {
        res.json({success:true,message:error.message})
    }
}