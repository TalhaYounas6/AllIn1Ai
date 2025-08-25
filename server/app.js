import express from "express";
import cors from "cors";
import "dotenv/config";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import connectCloudinary from "./config/cloudinary.js";
import routes from "./routes/index.js"


const app = express();



async function connectionToCloudinary(){
    try {
      await connectCloudinary();
      console.log("Connectin to cloudinary successful");
    } catch (error) {
        console.log("Error in connection to cloudinary: ",error);
        process.exit(1);
    }
}

connectionToCloudinary();


app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.get("/", (req, res) => {
  res.send("server is live");
});

app.use(requireAuth());

app.use(routes);

export default app;


