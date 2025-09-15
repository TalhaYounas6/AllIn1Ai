import React, { useEffect, useState } from "react";
import { useUser,useAuth } from "@clerk/clerk-react";
import { dummyPublishedCreationData } from "../assets/assets";
import { Heart } from "lucide-react";
import axios from "axios";
import {toast} from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Community = () => {
  const [creations, setCreation] = useState([]);
  const { user } = useUser();
  const [loading,setLoading] = useState(false);
  const [likeLoading,setLikeLoading] = useState(false)
  

  const {getToken} = useAuth();
  

  const fetchCreations = async () => {
    try {
      setLoading(true);
      const {data} = await axios.get('/api/user/get-published-creations',{
        headers:{Authorization:`Bearer ${await getToken()}`}
      })

      if(data.success){
        setCreation(data.publishedCreations);
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const toggleLike = async(id)=>{
    try {
      setLikeLoading(true); 
      const{data} = await axios.post("/api/user/toggle-like-button",{id},{
        headers:{Authorization:`Bearer ${await getToken()}`}
      })

      if (data.statusCode === 200) {
      const isNowLiked = data.liked;
      setCreation((prevCreations) =>prevCreations.map((creation) =>
          creation.id === id?{
                ...creation,
                liked: isNowLiked,
                likes: isNowLiked? creation.likes + 1: creation.likes - 1,
              }
            : creation
        )
      );
      toast.success(`${isNowLiked?'Post Liked':'Post Disliked'}`)
    } else {
      toast.error("Unexpected response from server.");
    }
  } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
    } else if (error.request) {
        toast.error("No response from server.");
    } else {
        toast.error("Unexpected error occurred.");
    }
    }finally{
        setLikeLoading(false);
    }
  }

  useEffect(() => {
    if (user) {
      fetchCreations();
    }
  }, [user]);

  return !loading?(
    <div className="flex-1 h-full flex flex-col gap-4 p-6 font-bold">
      Creations
      <div className="bg-white h-full w-full rounded-xl overflow-y-scroll">
        {creations.map((creation, index) => (
          <div
            key={index}
            className="relative group inline-block pl-3 pt-2 w-full sm:max-w-1/2 lg:max-w-1/3 "
          >
            <img
              src={creation.content}
              alt=""
              className="w-full h-full object-cover rounded-lg"
            />

            <div className="absolute bottom-0 top-0 right-0 left-3 flex gap-2 items-end justify-end group-hover:justify-between p-3 group-hover:bg-gradient-to-b from-transparent to-black/80 text-white rounded-lg">
              <p className="text-sm hidden group-hover:block">
                {creation.prompt}
              </p>
              <div className="flex gap-1 items-center">
                <p>{creation.likes}</p>
                
                <Heart
                  className={`min-w-5 h-5 hover:scale-110 cursor-pointer ${
                    creation.liked
                      ? "fill-red-500 text-red-600"
                      : "text-white"
                  }`} 
                  onClick={()=>toggleLike(creation.id)}
                  disabled={likeLoading}
                />
                
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ):(
    <div className="h-full flex justify-center items-center">
      <span className="w-10 h-10 my-1 rounded-full border-3 border-primary border-t-transparent animate-spin"></span>
    </div>
  )
};

export default Community;
