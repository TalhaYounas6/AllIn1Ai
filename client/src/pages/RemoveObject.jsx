import React, { use, useState } from "react";
import { Edit, Eraser, Hash, Scissors, Sparkles,Image } from "lucide-react";
import axios from 'axios';
import { useAuth } from "@clerk/clerk-react";
import {toast} from "react-hot-toast";
import {handleDownload} from "../utils/downloadImage.js"
import { useRef } from "react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveObject = () => {
  const [input, setInput] = useState("");
  const [object, setObject] = useState("");
  const [loading,setLoading] = useState(false);
  const [content,setContent] = useState("");
  const imageInputref = useRef(null);

  const {getToken} = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const trimmedObj = object.trim();
    const inputWords = trimmedObj.split(' ');
    if(inputWords[1]){
      toast.error("Only enter one word for the object to remove");
      return;
    }
    try {

      setLoading(true);
      const formData= new FormData();
      formData.append('image',input);
      formData.append('object',object);
      const {data} = await axios.post("/api/ai/remove-image-object",formData,{
        headers:{Authorization: `Bearer ${await getToken()}`}
      })

      

      if(data.success){
        setContent(data.content);
        
        
      }else{
        toast.error(data.message);
        
      }
      
    } catch (error) {
      toast.error(error.message);
      
    }
    setLoading(false);
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700 pb-17">
      {/* left column */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Object Removal</h1>
        </div>
        <p className="mt-6 text-sm font-medium">Upload Image</p>

        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={imageInputref}
          required
          onChange={(e) => setInput(e.target.files[0])}
        />
        <button
            type="button"
            className="flex justify-center  w-full text-white cursor-pointer rounded-lg mt-1 bg-green-500 py-2"
            onClick={() => imageInputref.current?.click()}
          >
            <Image size={20} />
          </button>

        <p className="mt-6 text-sm font-medium">
          Describe Your Object To Remove
        </p>

        <textarea
          rows={4}
          type="text"
          className=" w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          placeholder="Enter object name for e.g. pen,watch..."
          required
          onChange={(e) => setObject(e.target.value)}
          value={object}
        />

        <button  disabled={loading} className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#417DF6] to-[#8E37EB] text-white px-4 py-2 mt-6text-sm rounded-lg cursor-pointer mt-2">
          {
           loading? <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span> :<Scissors className="w-5" />
         }
          Remove Object
        </button>
      </form>
      {/* right column */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]">
        <div className="flex items-center gap-3">
          <Scissors className="w-5 h-5 test-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Processed Image</h1>
          <span>{content?<button onClick={()=>handleDownload(content)} className="flex-1 gap-2 bg-primary text-white px-3 py-1 text-sm rounded-lg cursor-pointer lg:ml-40">Download</button>:<div></div>}</span>
          
        </div>

        {loading?(
          <div className="flex-1 flex justify-center items-center flex-col gap-5">
            <span className="w-7 h-7 my-1 rounded-full border-2 border-t-transparent animate-spin text-black"></span> 
            <p className="text-gray-400">This may take a few seconds</p>
          </div>
        ):!content?(<div className="flex-1 flex justify-center items-center">
                  <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
                    <Scissors className="w-9 h-9" />
                    <p>Upload an image and click "Remove Object" to get started</p>
                  </div>
                </div>):(
                 <>
                   <div className="mt-4 h-full">
                     <img src={content} alt="image" className="w-full h-full"/>
                    </div>
                </>
        )}
      </div>
    </div>
  );
};

export default RemoveObject;
