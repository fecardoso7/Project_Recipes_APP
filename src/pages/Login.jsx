import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { saveToLocalStorage } from "../services/storage";

export default function Login() {
  const history = useHistory();
  
  // Estado para os campos de entrada
  const [user, setUser] = useState({ email: "", password: "" });
  
  // Estado para validar o formulário
  const [isValid, setIsValid] = useState(false);

  // Manipula as mudanças nos inputs
  const handleChange = ({ target }) => {
    const { name, value } = target;
    setUser({ ...user, [name]: value });
  };

  // Salva o login e redireciona
  const handleSubmit = () => {
    saveToLocalStorage("user", { email: user.email });
    history.push("/meals");
  };

  // Efeito para validar email e senha (mínimo 6 caracteres)
  useEffect(() => {
    const { email, password } = user;
    const MIN_PASSWORD_LENGTH = 6;
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    const fieldsValid = emailRegex.test(email) && password.length > MIN_PASSWORD_LENGTH;
    setIsValid(fieldsValid);
  }, [user]);

  // Definição dos estilos em JS
  const styles = {
    container: {
      width: "100vw",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "fixed",
      overflow: "hidden",
      backgroundColor: "#1a1a1a",
    },
    background: {
      position: "absolute",
      width: "110%",
      height: "110%",
      backgroundImage: "url('https://images.unsplash.com/photo-1543353071-873f17a7a088?q=80&w=2070&auto=format&fit=crop')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      filter: "brightness(0.75)",
      zIndex: 0,
    },
    glassPanel: {
      width: "90%",
      maxWidth: "420px",
      backgroundColor: "rgba(255, 255, 255, 0.65)",
      backdropFilter: "blur(25px) saturate(160%)",
      border: "1px solid rgba(255, 255, 255, 0.5)",
      borderRadius: "8px",
      padding: "60px 45px",
      display: "flex",
      flexDirection: "column",
      gap: "40px",
      boxShadow: "0 30px 60px -15px rgba(0, 0, 0, 0.3)",
      zIndex: 10,
      position: "relative",
    },
    header: {
      textAlign: "center",
      marginBottom: "10px",
    },
    subtitle: {
      fontSize: "10px",
      letterSpacing: "0.3em",
      textTransform: "uppercase",
      color: "#555",
      fontWeight: "500",
      marginBottom: "8px",
      display: "block",
      fontFamily: "'Inter', sans-serif",
    },
    title: {
      fontFamily: "'Playfair Display', serif",
      fontSize: "42px",
      letterSpacing: "-0.01em",
      fontWeight: "600",
      color: "#2D2A26",
      margin: 0,
    },
    form: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      gap: "24px",
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    label: {
      fontSize: "11px",
      color: "#333",
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      fontFamily: "'Inter', sans-serif",
    },
    input: {
      width: "100%",
      backgroundColor: "#FFFFFF",
      border: "1px solid rgba(0,0,0,0.08)",
      borderRadius: "4px",
      padding: "16px",
      fontSize: "14px",
      color: "#2D2A26",
      outline: "none",
      boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
      transition: "all 0.3s ease",
      fontFamily: "'Inter', sans-serif",
    },
    button: {
      width: "100%",
      padding: "18px",
      backgroundColor: "#A68A64",
      border: "none",
      borderRadius: "4px",
      color: "#FFFFFF",
      fontSize: "12px",
      letterSpacing: "0.15em",
      textTransform: "uppercase",
      fontWeight: "600",
      cursor: "pointer",
      marginTop: "10px",
      transition: "all 0.3s ease",
      opacity: isValid ? 1 : 0.6,
      boxShadow: "0 10px 20px -5px rgba(166, 138, 100, 0.3)",
    }
  };

  return (
    <div style={styles.container}>
      {/* Importação de fontes externas */}
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=Inter:wght@400;500;700&display=swap');`}
      </style>

      {/* Camada de fundo animada */}
      <div style={styles.background} className="bg-pan" />

      {/* Painel de Login */}
      <div style={styles.glassPanel} className="panel-enter">
        <header style={styles.header}>
          <span style={styles.subtitle}>Arquivo Gastronômico</span>
          <h1 style={styles.title}>Culinária</h1>
        </header>

        <form style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>E-mail</label>
            <input
              type="email"
              name="email"
              data-testid="email-input"
              style={styles.input}
              className="input-interaction"
              value={user.email}
              onChange={handleChange}
              placeholder="Digite seu e-mail"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Senha</label>
            <input
              type="password"
              name="password"
              data-testid="password-input"
              style={styles.input}
              className="input-interaction"
              value={user.password}
              onChange={handleChange}
              placeholder="Digite sua senha"
            />
          </div>

          <button
            type="button"
            data-testid="login-submit-btn"
            disabled={!isValid}
            onClick={handleSubmit}
            style={styles.button}
            className="btn-interaction"
          >
            Entrar
          </button>
        </form>
      </div>

      {/* Estilos CSS para animações e interações */}
      <style>{`
        .bg-pan {
          animation: panImage 40s ease-in-out infinite alternate;
        }
        @keyframes panImage {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }

        .panel-enter {
          animation: slideUpFade 1s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .input-interaction:focus {
          border-color: #A68A64 !important;
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.06) !important;
        }
        
        ::placeholder {
          color: #999;
          font-weight: 400;
          font-size: 13px;
        }

        .btn-interaction:hover {
          background-color: #8C7352 !important;
          transform: translateY(-2px);
          box-shadow: 0 15px 30px -5px rgba(166, 138, 100, 0.5) !important;
          letter-spacing: 0.2em !important;
        }
        
        .btn-interaction:disabled {
          cursor: not-allowed;
          transform: none;
        }
      `}</style>
    </div>
  );
}

Login.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
}.isRequired;