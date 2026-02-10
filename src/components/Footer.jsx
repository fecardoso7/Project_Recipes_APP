import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import drinkIcon from "../images/drinkIcon.svg";
import mealIcon from "../images/mealIcon.svg";

export default function Footer() {
  const history = useHistory();
  const { pathname } = useLocation(); // Hook para identificar a rota atual e aplicar estados ativos

  const styles = {
    // Wrapper principal com efeito Glassmorphism (vidro fosco) e posição fixa
    footerWrapper: {
      width: "100%",
      height: "70px",
      position: "fixed",
      bottom: 0,
      left: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(255, 255, 255, 0.85)",
      backdropFilter: "blur(15px)",
      borderTop: "1px solid rgba(197, 164, 126, 0.08)",
      zIndex: 1000,
    },
    // Container limitado para manter os ícones centralizados em telas maiores
    navContainer: {
      width: "100%",
      maxWidth: "500px",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center",
    },
    // Estilização base dos botões de navegação
    button: {
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: "10px 20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "4px",
      transition: "0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    },
    // Lógica visual dos ícones: alteração de opacidade e posição se estiver ativo
    iconImg: (isActive) => ({
      width: "20px",
      height: "20px",
      filter:
        "brightness(0) saturate(100%) invert(71%) sepia(21%) saturate(545%) hue-rotate(334deg) brightness(92%) contrast(88%)",
      opacity: isActive ? 1 : 0.35,
      transform: isActive ? "translateY(-2px)" : "translateY(0)",
      transition: "0.4s ease",
    }),
    // Tipografia técnica seguindo o padrão de espaçamento do projeto
    label: (isActive) => ({
      fontSize: "8px",
      letterSpacing: "0.3em",
      textTransform: "uppercase",
      color: "var(--accent-gold)",
      opacity: isActive ? 1 : 0.4,
      fontWeight: isActive ? "600" : "400",
      transition: "0.4s ease",
      marginTop: "4px",
    }),
    // Linha de brilho superior (glow) para separação sutil de profundidade
    topGlow: {
      position: "absolute",
      top: "-1px",
      width: "40%",
      height: "1px",
      background:
        "linear-gradient(90deg, transparent, rgba(197, 164, 126, 0.3), transparent)",
    },
  };

  // Função de navegação com reset de scroll suave para melhor UX
  const navigateTo = (path) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    history.push(path);
  };

  return (
    <footer data-testid="footer" style={styles.footerWrapper}>
      {/* Elemento de acabamento visual */}
      <div style={styles.topGlow} />

      <div style={styles.navContainer}>
        {/* Navegação para Bebidas */}
        <button
          type="button"
          onClick={() => navigateTo("/drinks")}
          style={styles.button}
          className="footer-premium-btn"
        >
          <img
            src={drinkIcon}
            alt="bebidas"
            data-testid="drinks-bottom-btn"
            style={styles.iconImg(pathname === "/drinks")}
          />
          <span style={styles.label(pathname === "/drinks")}>Bebidas</span>
        </button>

        {/* Navegação para Pratos */}
        <button
          type="button"
          onClick={() => navigateTo("/meals")}
          style={styles.button}
          className="footer-premium-btn"
        >
          <img
            src={mealIcon}
            alt="pratos"
            data-testid="meals-bottom-btn"
            style={styles.iconImg(pathname === "/meals")}
          />
          <span style={styles.label(pathname === "/meals")}>Pratos</span>
        </button>
      </div>

      {/* Efeitos de interação via CSS interno */}
      <style>{`
        .footer-premium-btn:hover img {
          opacity: 1 !important;
          transform: translateY(-4px) scale(1.05) !important;
        }
        .footer-premium-btn:hover span {
          opacity: 1 !important;
          letter-spacing: 0.4em !important;
        }
      `}</style>
    </footer>
  );
}
