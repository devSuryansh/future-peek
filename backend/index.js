import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

import connectDB from "./database/connect.js";
import postRoutes from "./routes/postRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(
  cors({
    origin: ["https://future-peek.onrender.com", "http://localhost:3000"],
  })
);
app.use(express.json({ limit: "50mb" }));

app.use("/api/v1/post", postRoutes);
app.use("/api/v1/image", imageRoutes);

app.get("/", async (req, res) => {
  res
    .status(200)
    .json({ message: "Hello, this is your image generation server!" });
});

const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL);
    app.listen(PORT, () =>
      console.log(`Server has started on http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error("Server failed to start:", error);
  }
};

startServer();
