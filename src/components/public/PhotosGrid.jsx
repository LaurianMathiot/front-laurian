import React, { useState, useEffect } from "react";
import { ImageList, ImageListItem } from "@mui/material";

function PhotosGrid() {
  const [images, setImages] = useState([]);
  const [votedImages, setVotedImages] = useState([]);
  const [remainingVotes, setRemainingVotes] = useState(3);
  const [AddClass, setAddClass] = useState(null);

  localStorage.clear();

  // Fonction pour ouvrir la modale
  function openModal(imageSrc) {
    var modal = document.getElementById("myModal");
    var modalImage = document.getElementById("modalImage");

    modal.style.display = "block";
    modalImage.src = imageSrc;
  }

  // Fonction pour fermer la modale
  function closeModal() {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
  }

  const fetchImages = async () => {
    const response = await fetch(`http://localhost:3000/api/picture`);
    const responseJs = await response.json();
    setImages(responseJs.data);

    const randomImages = [...responseJs.data];
    for (let i = randomImages.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [randomImages[i], randomImages[j]] = [randomImages[j], randomImages[i]];
    }

    setImages(randomImages);
  };

  const addVote = async (id, index) => {
    if (remainingVotes > 0 && !votedImages.includes(id)) {
      console.log(id);
      const response = await fetch(
        `http://localhost:3000/api/picture/vote/${id}`,
        {
          method: "PUT",
        }
      );

      setRemainingVotes(remainingVotes - 1);

      // Informations du vote dans localStorage
      localStorage.setItem("votedImages", JSON.stringify(votedImages));
      localStorage.setItem("remainingVotes", remainingVotes - 1);

      // Réinitialisation du nombre de votes après 24 heures
      setTimeout(() => {
        localStorage.removeItem("votedImages");
        localStorage.removeItem("remainingVotes");
        setRemainingVotes(3);
      }, 24 * 60 * 60 * 1000); // 24 heures en millisecondes

      //Add Classe CSS
      setAddClass(index);

      setTimeout(() => {
        setAddClass(null);
      }, 800);
    }
  };

  useEffect(() => {
    fetchImages();

    // Récupération des informations de vote du stockage local au chargement de la page
    const storedVotedImages = JSON.parse(localStorage.getItem("votedImages"));
    const storedRemainingVotes = parseInt(
      localStorage.getItem("remainingVotes")
    );

    if (storedVotedImages && !isNaN(storedRemainingVotes)) {
      setVotedImages(storedVotedImages);
      setRemainingVotes(storedRemainingVotes);
    }
  }, []);

  return (
    <section className="main-container photos-section homepage-section">
      <h2>Photographies</h2>
      <p className="bold">Votez pour vos photos préférées !</p>
      <p>Vous pouvez voter 3 fois toutes les 24h.</p>
      <ImageList variant="masonry" cols={3} gap={25} className="masonry">
        {images.map(
          (image, index) =>
            image.status === "publié" && (
              <>
                <ImageListItem key={index} className="image-card">
                  <img
                    src={image.link}
                    alt={image.description}
                    className="image"
                    onClick={() => openModal(image.link)}
                  />
                  <button
                    className={`vote-btn btn ${
                      remainingVotes === 0 ? "disabled" : ""
                    } ${index === AddClass ? "vote-pop" : ""}`}
                    onClick={() => addVote(image.id, index)}
                    disabled={remainingVotes === 0}
                  >
                    {remainingVotes === 0 ? "Votes épuisés" : "Voter"}
                  </button>
                </ImageListItem>
                <div
                  id="myModal"
                  className="modal"
                  onClick={() => closeModal()}
                >
                  <button className="close btn" onClick={() => closeModal()}>
                    X
                  </button>
                  <img
                    id="modalImage"
                    className="modal-content"
                    src=""
                    alt="Image agrandie"
                  />
                </div>
              </>
            )
        )}
      </ImageList>
    </section>
  );
}

export default PhotosGrid;
