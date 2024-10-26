import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import axios from "axios";

import { preview } from "../assets";
import { getRandomPrompt } from "../utils";
import { FormField, Loader } from "../components";

const CreatePost = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    prompt: "",
    photo: "",
  });

  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  };

  // const generateImage = async () => {
  //   if (form.prompt) {
  //     try {
  //       setGeneratingImg(true);

  //       // Correct the fetch request
  //       const response = await fetch("http://localhost:8080/api/v1/image", {
  //         method: "POST", // Specify the method
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           prompt: form.prompt, // Send the prompt as body
  //         }),
  //       });

  //       if (!response.ok) {
  //         throw new Error("Failed to fetch the image");
  //       }

  //       const blob = await response.blob(); // Convert the response to a blob
  //       const imageURL = URL.createObjectURL(blob); // Create an image URL from the blob

  //       // const data = await response.json();

  //       // Update the form with the photo field
  //       setForm({ ...form, photo: imageURL });
  //     } catch (error) {
  //       console.log("Error generating image:", error.message);
  //     } finally {
  //       setGeneratingImg(false);
  //     }
  //   } else {
  //     alert("Please enter a prompt.");
  //   }
  // };

  const generateImage = async () => {
    if (form.prompt) {
      try {
        setGeneratingImg(true);

        const response = await fetch("https://future-peek-backend.onrender.com/api/v1/image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: form.prompt, // Send the prompt as body
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch the image");
        }

        const blob = await response.blob();
        const reader = new FileReader();

        reader.onloadend = () => {
          // Convert the image blob to base64 and update the form with the base64 string
          const base64data = reader.result;
          setForm({ ...form, photo: base64data }); // base64data contains the base64 string
        };

        reader.readAsDataURL(blob); // Convert blob to data URL (base64)
      } catch (error) {
        console.log("Error generating image:", error.message);
      } finally {
        setGeneratingImg(false);
      }
    } else {
      alert("Please enter a prompt.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.prompt && form.photo) {
      setLoading(true);

      try {
        const response = await fetch("https://future-peek-backend.onrender.com/api/v1/post", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...form }), // This will now send the base64 image
        });

        await response.json();
        navigate("/");
      } catch (e) {
        alert(e);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please enter a prompt and generate an image");
    }
  };

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">Create</h1>
        <p className="mt-2 text-[#666e75] text-[14px] max-w-[500px]">
          Bring your imagination to life and share it with the community
        </p>
      </div>

      <form className="mt-16 max-w-3xl" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <FormField
            labelName="Your Name"
            type="text"
            name="name"
            placeholder="Ex., john doe"
            value={form.name}
            handleChange={handleChange}
          />

          <FormField
            labelName="Prompt"
            type="text"
            name="prompt"
            placeholder="A robot playing chess"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />

          <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 max-w-96 p-3 max-h-96 flex justify-center items-center aspect-square">
            {form.photo ? (
              <img
                src={form.photo}
                alt={form.prompt}
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={preview}
                alt="preview"
                className="w-9/12 h-9/12 object-contain opacity-40"
              />
            )}

            {generatingImg && (
              <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                <Loader />
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 flex gap-5">
          <button
            type="button"
            onClick={generateImage}
            className=" text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {generatingImg ? "Generating..." : "Generate"}
          </button>
        </div>

        <div className="mt-10">
          <p className="mt-2 text-[#666e75] text-[14px]">
            ** Once you have created the image you want, you can share it with
            others in the community **
          </p>
          <button
            type="submit"
            className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {loading ? "Sharing..." : "Share with the Community"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreatePost;
