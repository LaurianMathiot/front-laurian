import React, { useState } from "react";
import Cookies from "js-cookie";

const UserUploadForm = () => {
  const token = Cookies.get("jwt");
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    setImage(selectedImage);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("image", image);
    formData.append("description", description);

    try {
      const responseCreate = await fetch("http://localhost:3000/api/picture", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (responseCreate.status === 201) {
        console.log("Téléchargement réussi");
        setImage(null);
        setDescription("");
      } else {
        const errorText = await responseCreate.text();
        console.error("Erreur lors de l'envoi de l'image :", errorText);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de la demande :", error);
    }
  };

  return (
    <form className="upload-form blur" onSubmit={handleSubmit}>
            <h3>Uploader une photo</h3>     {" "}
      <div className="upload-input flex">
               {" "}
        <input
          type="file"
          id="file"
          name="file"
          onChange={handleImageChange}
          accept="image/*"
        />
             {" "}
      </div>
           {" "}
      <div>
                <label htmlFor="description">Description</label>
               {" "}
        <input
          type="text"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
             {" "}
      </div>
            <input type="submit" className="submit-btn" />   {" "}
    </form>
  );
};

export default UserUploadForm;
