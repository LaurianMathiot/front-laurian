import Footer from "../../components/public/Footer";
import Header from "../../components/public/Header";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import Swal from "sweetalert2";
import { useState } from "react";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const HandleLoginSubmit = async (event) => {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    const loginResponse = await fetch(`http://localhost:3000/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ email, password }),
    });
    const responseJson = await loginResponse.json();

    if (loginResponse.status === 201) {
      const jwt = await responseJson.data;
      Cookies.set("jwt", await jwt);
      const jwtUser = Cookies.get("jwt");
      const user = await jwtDecode(jwtUser);
      setTimeout(() => {
        if (user.data.role === 1) {
          navigate("/admin/admin-dashboard");
        } else {
          navigate("/user/user-upload");
        }
      }, 0);
    } else {
      Swal.fire({
        title: "Erreur!",
        text: "Une erreur est survenue lors de votre inscription",
        icon: "error",
      });
    }
  };

  return (
    <>
      <Header />
      <section className="bg-login">
        <div className="main-container login-section flex-column-start">
          <h2>Connexion</h2>
          <form
            onSubmit={HandleLoginSubmit}
            className="login-form flex-column-start"
          >
            <div className="form-element flex-column-start">
              <label htmlFor="email">
                Email<span>*</span>
              </label>
              <input type="text" name="email" required />
            </div>
            <div className="flex-center password-input-wrap">
              <div className="form-element flex-column-start">
                <label htmlFor="password">
                  Mot de passe<span>*</span>
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                />
              </div>
              <button
                className=""
                type="button"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24"
                    viewBox="0 -960 960 960"
                    width="24"
                  >
                    <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24"
                    viewBox="0 -960 960 960"
                    width="24"
                  >
                    <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
                  </svg>
                )}
              </button>
            </div>
            <input
              type="submit"
              className="submit-btn btn btn-alt"
              value="Se connecter"
            />
          </form>
          <div className="signup-redirection">
            <p>Pas encore de compte ?</p>
            <Link className="btn btn-alt" to="/inscription">
              Inscrivez-vous ici
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Login;
