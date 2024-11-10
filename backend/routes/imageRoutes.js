import express from "express";
import * as dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.route("/").get((req, res) => {
  res.send("Hello from HF");
});

router.route("/").post(async (req, res) => {
  try {
    const { prompt } = req.body;
    const apiKey = process.env.HF_ACCESS_TOKEN;

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
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to generate image: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();

    const buffer = Buffer.from(arrayBuffer);

    res.setHeader("Content-Type", "image/jpeg");

    console.log(response);
    console.log(buffer);
    res.send(buffer);
  } catch (error) {
    console.error("Image generation error:", error.message);
    res
      .status(500)
      .json({ error: error.message || "Failed to generate image" });
  }
});

export default router;
