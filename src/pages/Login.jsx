import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { saveToLocalStorage } from "../services/storage";

export default function Login() {
  const history = useHistory();
  const [user, setUser] = useState({ email: "", password: "" });
  const [isValid, setIsValid] = useState(false);

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = () => {
    saveToLocalStorage("user", { email: user.email });
    history.push("/meals");
  };

  useEffect(() => {
    const { email, password } = user;
    const MIN_PASSWORD_LENGTH = 6;
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    const fieldsValid =
      emailRegex.test(email) && password.length > MIN_PASSWORD_LENGTH;
    setIsValid(fieldsValid);
  }, [user]);

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: "100vw",
      height: "100vh",
      backgroundColor: "#050505",
      position: "fixed",
      top: 0,
      left: 0,
      fontFamily: "'Inter', sans-serif",
    },
    header: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginBottom: "50px",
    },
    title: {
      fontSize: "18px",
      letterSpacing: "0.6em",
      textTransform: "uppercase",
      fontWeight: "300",
      color: "#c5a47e",
      margin: "10px 0",
    },
    subtitle: {
      fontSize: "9px",
      letterSpacing: "0.8em",
      textTransform: "uppercase",
      color: "rgba(255,255,255,0.4)",
      fontWeight: "200",
    },
    card: {
      width: "100%",
      maxWidth: "360px",
      padding: "50px",
      backgroundColor: "rgba(255,255,255,0.01)",
      border: "1px solid rgba(197, 164, 126, 0.08)",
      borderRadius: "1px",
      backdropFilter: "blur(30px)",
      display: "flex",
      flexDirection: "column",
      gap: "35px",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    },
    input: {
      width: "100%",
      background: "transparent",
      border: "none",
      borderBottom: "1px solid rgba(197, 164, 126, 0.15)",
      padding: "15px 0",
      fontSize: "10px",
      letterSpacing: "0.2em",
      color: "#f4f4f4",
      outline: "none",
      textAlign: "center",
      textTransform: "lowercase",
      transition: "all 0.4s ease",
    },
    button: {
      width: "100%",
      padding: "22px",
      background: "transparent",
      border: "1px solid rgba(197, 164, 126, 0.3)",
      color: "#c5a47e",
      fontSize: "9px",
      letterSpacing: "0.5em",
      textTransform: "uppercase",
      cursor: "pointer",
      transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
      opacity: isValid ? 1 : 0.1,
      marginTop: "10px",
    },
  };

  return (
    <div style={styles.container}>
      {/* Brilho de Ambiente (Glow) */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          width: "400px",
          height: "400px",
          background:
            "radial-gradient(circle, rgba(197, 164, 126, 0.03) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <header style={styles.header}>
        <span style={styles.subtitle}>Arquivo Gastronômico</span>
        <h1 style={styles.title}>Culinária</h1>
        <div
          style={{
            height: "1px",
            width: "30px",
            backgroundColor: "#c5a47e",
            opacity: 0.3,
            marginTop: "10px",
          }}
        />
      </header>

      <form style={styles.card}>
        <input
          type="email"
          name="email"
          placeholder="seu@email.com"
          style={styles.input}
          value={user.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="senha"
          style={styles.input}
          value={user.password}
          onChange={handleChange}
        />

        <button
          type="button"
          disabled={!isValid}
          onClick={handleSubmit}
          style={styles.button}
          onMouseOver={(e) =>
            isValid && (e.target.style.background = "rgba(197, 164, 126, 0.05)")
          }
          onMouseOut={(e) => (e.target.style.background = "transparent")}
        >
          Descobrir Sabores
        </button>
      </form>

      {/* Linha de Gradiente Final */}
      <div
        style={{
          marginTop: "70px",
          height: "1px",
          width: "140px",
          background:
            "linear-gradient(90deg, transparent, rgba(197, 164, 126, 0.15), transparent)",
        }}
      />
    </div>
  );
}

Login.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
}.isRequired;
