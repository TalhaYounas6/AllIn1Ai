import React, { useState } from "react";
import { Edit, Eraser, Hash, Sparkles,Image,XCircle } from "lucide-react";
import axios from 'axios';
import { useAuth } from "@clerk/clerk-react";
import {toast} from "react-hot-toast";
import { handleDownload } from "../utils/downloadImage";
import { useRef } from "react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveBackground = () => {
  const [input, setInput] = useState("");
  const [loading,setLoading] = useState(false);
  const [content,setContent] = useState("");
  const [imagePreview,setImagePreview] = useState(null);
  const imageInputref = useRef(null);


  const {getToken} = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {

      setLoading(true);
      const formData= new FormData();
      formData.append('image',input);
      const {data} = await axios.post("/api/ai/remove-image-background",formData,{
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

  const handleImageChange = (e)=>{
    const file = e.target.files[0];
    if(!file.type.startsWith("image/")){
      toast.error("Please select an image file");
      return;
    }

    if(file){
      setImagePreview(URL.createObjectURL(file));
      // setContent(file);
      setInput(file);
    }
  }
  

  const removeImage = () => {
    setImagePreview(null);
    if (imageInputref.current) imageInputref.current.value = "";
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700 pb-17">
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#FF4938]" />
          <h1 className="text-xl font-semibold">Background Removal</h1>
        </div>
        <p className="mt-6 text-sm font-medium">Upload Image</p>
        {/* left column */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-3 mt-1">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-600
              flex items-center justify-center cursor-pointer"
              type="button"
            >
              <XCircle className="size-5" />
            </button>
          </div>
        </div>
      )}

        <input
          type="file"
          accept="image/*"
          // className=" w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600 cursor-pointer"
          className="hidden"
          required
          ref={imageInputref}
          onChange={handleImageChange}
        />
        <button
            type="button"
            className="flex justify-center  w-full text-white cursor-pointer rounded-lg mt-1 bg-green-500 py-2"
            onClick={() => imageInputref.current?.click()}
          >
            <Image size={20} />
          </button>

        <p className="text-xs text-gray-500 font-light mt-1">
          Supports JPG, PNG, and other image formats
        </p>
        <button  disabled={loading} className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#F6AB41] to-[#FF4938] text-white px-4 py-2 mt-6text-sm rounded-lg cursor-pointer mt-2">
          {
            loading? <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span> :<Eraser className="w-5" />
          }
          Remove Background
        </button>
      </form>
      {/* right column */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]">
        <div className="flex items-center gap-3">
          <Eraser className="w-5 h-5 test-[#FF4938]" />
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
            <Eraser className="w-9 h-9" />
            <p>Upload an image and click "Remove Background" to get started</p>
          </div>
        </div>):(
          <>
          <div className="flex-1 mt-4 overflow-hidden flex items-center justify-center">
            <img src={content} alt="image" className="max-h-full w-full object-contain rounded-lg"/>
          </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RemoveBackground;
