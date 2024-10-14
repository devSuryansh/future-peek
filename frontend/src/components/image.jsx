import React, { useState } from 'react';
import axios from 'axios';

function ImageGenerator() {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Function to call the backend API
  const createImage = async (prompt) => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8080/api/v1/image/createimage', 
        { inputs: prompt }, 
        { responseType: 'blob' } // Important: we expect a blob in return
      );

      const blob = new Blob([response.data], { type: 'image/jpeg' });
      const imageUrl = URL.createObjectURL(blob); // Convert the blob to a URL

      setImageUrl(imageUrl); // Set the image URL to display it
      setLoading(false);
    } catch (err) {
      setError('Failed to generate image.');
      setLoading(false);
    }
  };

  // Function to handle the form submit
  const handleGenerate = (e) => {
    e.preventDefault();
    const prompt = e.target.elements.prompt.value;
    createImage(prompt); // Call the function with the entered prompt
  };

  return (
    <div>
      <h2>Image Generator</h2>

      {/* Input form to submit a prompt */}
      <form onSubmit={handleGenerate}>
        <input type="text" name="prompt" placeholder="Enter prompt" required />
        <button type="submit">Generate Image</button>
      </form>

      {/* Display loading state */}
      {loading && <p>Loading...</p>}

      {/* Display error message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display the generated image */}
      {imageUrl && <img src={imageUrl} alt="Generated" id="generated-image" />}
    </div>
  );
}

export default ImageGenerator;
