import "./Auth.css";
import { useTheme } from "../hooks/useTheme";

export default function LoginLayout({ title, children, linkText, linkHref }) {
    const { isLight, toggleTheme } = useTheme();

    return (
        <div className="card">
            <div className="left">
                <div className="brand">
                    <img
                        src="/logo-removebg-preview-effect.png"
                        className="logo"
                        alt="RythMe Logo"
                    />
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
                <h2 className="title">{title}</h2>

                {children}

                <p className="register">
                    {linkText} <a href={linkHref}>Aquí</a>
                </p>
            </div>
        </div>
    );
}
