import React, { useEffect, useState } from "react";
import AdminHeader from "../../components/admin/AdminHeader";
import Swal from "sweetalert2";
import UserFooter from "../../components/user/UserFooter";

const AdminValidatePhoto = () => {
  const [images, setImages] = useState([]);

  const fetchValidePhoto = async () => {
    try {
      const responseApi = await fetch("http://localhost:3000/api/picture");
      if (!responseApi.ok) {
        throw new Error("Erreur lors de la récupération des données");
      }
      const responseApiJson = await responseApi.json();
      setImages(responseApiJson.data);
    } catch (error) {
      console.error("Une erreur s'est produite :", error);
    }
  };

  const handleValidation = async (id) => {
    try {
      const responseApi = await fetch(
        `http://localhost:3000/api/picture/${id}`,
        {
          method: "PUT",
          body: JSON.stringify({ status: "publié" }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (responseApi.ok) {
        Swal.fire({
          title: "Valider",
          text: "image publié",
          icon: "success",
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        Swal.fire({
          title: "Erreur!",
          text: "Erreur lors du rejet de l'image",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Erreur!",
        text: "Une erreur s'est produite lors de la validation de l'image :",
        error,
        icon: "error",
      });
    }
  };

  const handleDismiss = async (id) => {
    try {
      const responseApi = await fetch(
        `http://localhost:3000/api/picture/${id}`,
        {
          method: "PUT",
          body: JSON.stringify({ status: "rejeté" }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (responseApi.ok) {
        Swal.fire({
          title: "Valider",
          text: "image rejeté",
          icon: "success",
        });
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        Swal.fire({
          title: "Erreur!",
          text: "Erreur lors du rejet de l'image",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Erreur!",
        text: "Une erreur s'est produite lors de la validation de l'image :",
        error,
        icon: "error",
      });
    }
  };
  const imagesNonPubliees = images.filter(
    (image) => image.status === "non publié"
  );

  useEffect(() => {
    fetchValidePhoto();
  }, []);

  return (
    <>
      <AdminHeader />
      <section className="images-validate-section main-container">
        <h2>Photos en attente de vérification</h2>
        <div className="images-validate-grid">
          {imagesNonPubliees.length === 0 ? (
            <div className="validate-nul-msg">
              <p>Aucune image en attente de validation</p>
            </div>
          ) : (
            imagesNonPubliees.map((image) => (
              <article key={image.id} className="image-validate-card">
                <img src={image.link} alt={image.description} />
                <div className="btns-container flex-center">
                  <button
                    className="btn btn-alt"
                    onClick={() => handleValidation(image.id)}
                  >
                    Valider
                  </button>
                  <button
                    className="btn btn-alt"
                    onClick={() => handleDismiss(image.id)}
                  >
                    Rejeter
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
      <UserFooter />
    </>
  );
};

export default AdminValidatePhoto;
