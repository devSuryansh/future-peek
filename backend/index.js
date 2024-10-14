import express from "express";
import * as dotenv from "dotenv"; 
import cors from "cors"; 
import fetch from "node-fetch"; 

dotenv.config(); 

const app = express();
const PORT = 8080; // Define the server port
const apiKey = "niet ke momos bohot achhhe hai "

// Middleware to parse JSON and handle CORS
app.use(cors());
app.use(express.json({ limit: "50mb" })); 

// Route to create an image using Hugging Face's API
app.post("/api/v1/image/createimage", async (req, res) => {
  const { inputs } = req.body; 

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
      {
        headers: {
          Authorization: `Bearer ${apiKey}`, 
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs }), // Pass the prompt to the API
      }
    );

    // Check if the response is successful
    if (!response.ok) {
      throw new Error("Failed to generate image from the API");
    }

    // Convert the response to a buffer
    const result = await response.blob(); // Get the image as a blob
    const arrayBuffer = await result.arrayBuffer(); // Convert blob to array buffer
    const buffer = Buffer.from(arrayBuffer); // Convert array buffer to a Node.js buffer

    // Set headers and send the image back to the frontend
    res.setHeader("Content-Type", "image/jpeg"); // Set content type as JPEG
    res.send(buffer); // Send the image buffer as response
  } catch (error) {
    console.error("Image generation error:", error);
    res.status(500).json({ error: "Failed to generate image" }); // Send error response in case of failure
  }
});

// Root route
app.get("/", (req, res) => {
  res.send("Hello, this is your image generation server!");
});

// Start the server
const startServer = async () => {
  try {
    app.listen(PORT, () =>
      console.log(`Server has started on http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error("Server failed to start:", error);
  }
};

// Start the server
startServer();
