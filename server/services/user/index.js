// import sql from "../config/db.js"
import {STATUS_CODES,TEXTS} from "../../config/constants.js"
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { Creation, Like } = require('../../models/index.cjs');
import { Op } from "sequelize";
import asyncHandler from "express-async-handler";




export const getUserCreations = asyncHandler(async(req,res)=>{
        try {
            const {userId} = req.auth();
            const {cursor} = req.query;
            const limit = 10;

            let whereClause = { user_id: userId};

            const totalCount = await Creation.count({
                where : {user_id :userId }
            });

            if (cursor){
                whereClause.createdAt = {
                    [Op.lt] : new Date(cursor)
                }
            }

            const creations = await Creation.findAll({
                        where: whereClause,
                        order: [["createdAt", "DESC"]],
                        limit : limit + 1
                        });


            let nextCursor = null;
            let hasMore = false;
            
            if(creations.length > limit){
                hasMore = true;
                creations.pop();
                nextCursor = creations[creations.length-1].createdAt;
            }else if(creations.length > 0){
                hasMore = false;
                nextCursor = creations[creations.length-1].createdAt;
            }

            res.json({success:true,creations,totalCount,nextCursor,hasMore})
        } catch (error) {
            return res.json({success:false, message: error.message})
        }
})

export const getPublishedCreations = asyncHandler(async(req,res)=>{
    try {

      const {userId} = req.auth();
    //  const publishedCreations= await sql `SELECT * from creations WHERE publish=true ORDER BY created_at DESC`;
     const creations = await Creation.findAll({where: { publish: true },order: [["createdAt", "DESC"]]});

    const publishedCreations = await Promise.all(  //creationwithlikes
    creations.map(async (item) => {
      const likeCount = await Like.count({
        where: { creation_id: item.id },
      });

      const liked = await Like.findOne({
        where: {
          creation_id: item.id,
          user_id: userId,
        },
      });

      return {
        ...item.toJSON(),
        likes: likeCount,
        liked: liked?true:false,
      };
    })
  );


     res.json({success:true,publishedCreations})

    } catch (error) {
        res.json({success:false,message:error.message})
    }
})

// export const toggleLikeCreation = asyncHandler(async(req,res)=>{
//     try {
//         const {userId} = req.auth();
//         const {id} = req.body; //creation id

//         // const [creation] = await sql`SELECT * from creations where id=${id}`;

//         // const currentLikes = creation.likes;
//         // const userIdStr = userId.toString();
//         // let updatedLikes;
//         // let message;

//         // if(currentLikes.includes(userIdStr)){
//         //     updatedLikes = currentLikes.filter((i)=> i!=userIdStr);
//         //     message="Creation Unliked";
//         // } else{
//         //     updatedLikes = [...currentLikes,userIdStr]
//         //     message = "Creation Liked";
//         // }

//         // const formattedarray = `{${updatedLikes.join(',')}}`

//         // await sql`UPDATE creations SET likes=${formattedarray}::text[] where id=${id}`
        
//         // if(!creation){
//         //     return res.json({success:false,message:"Creation not found"})
//         // }

//       const [creationExists, exists] = await Promise.all([
//       Creation.findOne({ where: { id: id } }),
//       Like.findOne({ where: { creation_id: id, user_id: userId } }),
//       ]);
//         if (!creationExists) {
//         return res.json({
//         statusCode: 404,
//         message: "NOT_FOUND",
//         });
//         }
//         if (exists) {
//             await Like.destroy({ where: { creation_id: id, user_id: userId } });
//             return res.json({
//             statusCode: 200,
//             message: "Creation Unliked",
//             liked: false,
//             });
//         }
//         await Like.create({ creation_id: id, user_id: userId });


//         res.json({
//           statusCode: 200,
//           message: "Creation Liked",
//           liked: true,
//          });


//     } catch (error) {
//         res.json({success:false,message:error.message})
//     }
// })

export const toggleLikeCreation = asyncHandler(async(req, res) => {
    try {
        const {userId} = req.auth();
        const {id} = req.body; // creation id

        const [creationExists, exists] = await Promise.all([
            Creation.findOne({ where: { id: id } }),
            Like.findOne({ where: { creation_id: id, user_id: userId } }),
        ]);


        if (!creationExists) {
            return res.json({
                statusCode: 404,
                message: "NOT_FOUND",
            });
        }

        if (exists) {
            const result = await Like.destroy({ 
                where: { 
                    creation_id: id, 
                    user_id: userId 
                } 
            });
            
            
            return res.json({
                statusCode: 200,
                message: "Creation Unliked",
                liked: false,
            });
        }

        // Create new like
        const newLike = await Like.create({ 
            creation_id: id, 
            user_id: userId 
        });
       

        res.json({
            statusCode: 200,
            message: "Creation Liked",
            liked: true,
        });

    } catch (error) {
        
        res.json({
            statusCode: 500,
            message: error.message
        });
    }
});