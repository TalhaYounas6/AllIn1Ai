import React, { useEffect, useState } from "react";
import { dummyCreationData } from "../assets/assets";
import { Gem, Sparkles } from "lucide-react";
import { Protect } from "@clerk/clerk-react";
import CreationItem from "../components/CreationItem";
import axios from "axios";
import {toast} from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";

axios.defaults.baseURL= import.meta.env.VITE_BASE_URL;

const Dashboard = () => {
  const [creations, setCreations] = useState([]);
  const [loading,setLoading] = useState(true);
  const [fetchingMore,setFetchingMore] = useState(false);
  const [nextCursor,setNextCursor] = useState(null);
  const [hasMore,setHasMore] = useState(false);
  const [totalCount,setTotalCount] = useState(null);

  const {getToken} = useAuth();

  const getCreationsData = async (cursor=null) => {
    try {
      if(!cursor)setLoading(true);
      else setFetchingMore(true);

    const url  = cursor?`/api/user/get-user-creations?cursor=${cursor}`: `/api/user/get-user-creations`;

      const {data} = await axios.get(url,{
        headers:{Authorization:`Bearer ${await getToken()}`}
      })
      
      if(data.success){
        setCreations(prev=> cursor? [...prev,...data.creations]:data.creations);

        setNextCursor(data.nextCursor);
        setHasMore(data.hasMore);
        setTotalCount(data.totalCount);
      }else{
        toast.error(data.message);
      }
    } catch (error) {
        toast.error(error.message);
    }finally{

      setLoading(false);
      setFetchingMore(false);
    }
  };

  useEffect(() => {
    getCreationsData();
  }, []);

  return !loading ? (
    <div className="h-full overflow-y-scroll p-6 pb-17">
      <div className="flex justify-start gap-4 flex-wrap">
        {/* Total Creations Card */}
        <div className="flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200">
          <div className="text-slate-600">
            <p className="text-sm">Total Creations</p>
            {/* Updated to use totalCount from backend */}
            <h2 className="text-xl font-semibold">{totalCount}</h2>
          </div>
          <div className=" w-10 h-10 rounded-lg bg-gradient-to-br from-[#3588f2] to-[#0bb0D7] text-white flex justify-center items-center">
            <Sparkles className="w-5 text-white" />
          </div>
        </div>
        
        {/* Active Plan Card (Unchanged) */}
        <div className="flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200">
          <div className="text-slate-600">
            <p className="text-sm">Active Plan</p>
            <h2 className="text-xl font-semibold">
              <Protect plan="premium" fallback="Free">Premium</Protect>
            </h2>
          </div>
          <div className=" w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF61C5] to-[#9E53EE] text-white flex justify-center items-center">
            <Gem className="w-5 text-white" />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <p className="mt-6 mb-4 font-bold">Recent Creations</p>
        {creations.map((item) => (
          <CreationItem key={item.id} item={item} />
        ))}
      </div>

      
      {hasMore && creations.length > 0 && (
        <div className="flex justify-center mt-6">
          <button 
            onClick={() => getCreationsData(nextCursor)}
            disabled={fetchingMore}
            className="px-6 py-2 bg-purple-600 hover:bg-black text-white cursor-pointer rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {fetchingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  ) : (
    <div className="h-full flex justify-center items-center">
      <span className="w-10 h-10 my-1 rounded-full border-3 border-primary border-t-transparent animate-spin"></span>
    </div>
  );
  
};

export default Dashboard;
