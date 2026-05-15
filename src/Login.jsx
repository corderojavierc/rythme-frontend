import { useState } from "react";
import "./login.css";
import logoImg from "./logo-removebg-preview-effect.png";

export default function Login() {
  const [isLight, setIsLight] = useState(false);

  const toggleTheme = () => {
    setIsLight(!isLight);
    if (!isLight) {
      document.body.classList.add("light");
    } else {
      document.body.classList.remove("light");
    }
  };

  return (
    <div className="card">
      <div className="left">
        <div className="brand">
          <img src={logoImg} className="logo" alt="RythMe Logo" />
          <h2 className="brand-text">
            <span className="blue">Ryth</span>
            <span className="pink">Me</span>
          </h2>
        </div>
        <p className="slogan">Conecta con la música</p>
        <button className="theme-toggle" onClick={toggleTheme}>
          {isLight ? "Oscuro" : "Claro"}
        </button>
      </div>

      <div className="right">
        <h2 className="title">
          <span className="blue">Iniciar</span>
          <span className="pink"> sesión</span>
        </h2>
        <form>
          <input type="text" placeholder="Nombre de usuario" required />
          <input type="password" placeholder="Contraseña" required />
          <button type="submit" className="btn">
            Iniciar sesión
          </button>
        </form>
        <p className="register">
          ¿No tienes cuenta? <a href="/register">Regístrate</a>
        </p>
      </div>
    </div>
  );
}
