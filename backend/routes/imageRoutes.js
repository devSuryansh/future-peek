import express from "express";
import * as dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Simple GET route for testing
router.route("/").get((req, res) => {
  res.send("Hello from HF");
});

// POST route to generate image
router.route("/").post(async (req, res) => {
  try {
    const { prompt } = req.body;
    const apiKey = process.env.HF_ACCESS_TOKEN; // Ensure API key is loaded

    const response = await fetch(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: prompt,
          seed: Math.floor(Math.random() * 10000),
        }), // Adjust payload for HF API
      }
    );

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`Failed to generate image: ${response.statusText}`);
    }

    // Convert the response to a buffer (use buffer in Node.js)
    const arrayBuffer = await response.arrayBuffer(); // This is correct for Node.js

    const buffer = Buffer.from(arrayBuffer);

    // Set the correct content type for the image and send it as a buffer
    res.setHeader("Content-Type", "image/jpeg");
    // Convert the buffer to a base64-encoded string
    // const base64Image = buffer.toString("base64");

    // Send the base64-encoded image in a JSON response
    // res.status(200).json({
    //   photo: `data:image/jpeg;base64,${base64Image}`,
    // });
    console.log(response);
    console.log(buffer);
    res.send(buffer); // Send the image buffer to the client
  } catch (error) {
    console.error("Image generation error:", error.message);
    res
      .status(500)
      .json({ error: error.message || "Failed to generate image" });
  }
});

export default router;
