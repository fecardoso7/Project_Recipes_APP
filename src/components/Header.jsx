import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import SearchBar from "./SearchBar";
import searchIcon from "../images/searchIcon.svg";
import profileIcon from "../images/profileIcon.svg";

export default function Header() {
  const history = useHistory();

  // Estado centralizado para gerenciar o título dinâmico e a visibilidade da busca
  const [headerData, setHeaderData] = useState({
    title: "",
    renderSearchIcon: true,
    showSearchBar: false,
  });

  const { pathname } = history.location;

  // Efeito para sincronizar a interface com a rota atual
  useEffect(() => {
    // Mapeamento de rotas para definir títulos e comportamentos específicos
    const routeMap = {
      "/drinks": { title: "Bebidas", renderSearchIcon: true },
      "/profile": { title: "Perfil", renderSearchIcon: false },
      "/done-recipes": { title: "Feitas", renderSearchIcon: false },
      "/favorite-recipes": { title: "Favoritos", renderSearchIcon: false },
    };

    // Define 'Pratos' como padrão caso a rota não esteja no mapa
    const current = routeMap[pathname] || {
      title: "Pratos",
      renderSearchIcon: true,
    };
    setHeaderData((prev) => ({ ...prev, ...current }));
  }, [pathname]);

  const styles = {
    // Header fixo com Glassmorphism (efeito de desfoque no fundo)
    headerWrapper: {
      width: "100%",
      position: "fixed",
      top: 0,
      zIndex: 1000,
      backgroundColor: "rgba(255, 255, 255, 0.85)",
      backdropFilter: "blur(15px)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      borderBottom: "1px solid rgba(197, 164, 126, 0.05)",
    },
    topBar: {
      width: "100%",
      maxWidth: "1200px",
      height: "65px",
      padding: "0 20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    // Tipografia responsiva com tracking (espaçamento) e sombra suave
    title: {
      fontSize: "clamp(10px, 2.5vw, 13px)", // Tamanho fluido baseado no viewport
      letterSpacing: "clamp(0.8em, 4vw, 1.2em)", // Espaçamento largo característico da marca
      textTransform: "uppercase",
      color: "var(--text-main)",
      fontWeight: "300",
      margin: 0,
      textAlign: "center",
      flex: 1,
      textShadow: "0 0 12px rgba(197, 164, 126, 0.15)",
    },
    iconButton: {
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "0.4s ease",
    },
    // Filtro de cor (Champagne) aplicado via CSS para padronizar ícones SVG
    iconImg: {
      width: "18px",
      height: "18px",
      filter:
        "brightness(0) saturate(100%) invert(71%) sepia(21%) saturate(545%) hue-rotate(334deg) brightness(92%) contrast(88%)",
      opacity: 0.7,
    },
    // Linha de gradiente lateral para acabamento premium
    gradientLine: {
      width: "100%",
      height: "1px",
      background:
        "linear-gradient(90deg, transparent, rgba(197, 164, 126, 0.2), transparent)",
    },
  };

  return (
    <header style={styles.headerWrapper}>
      <div style={styles.topBar}>
        {/* Navegação para Perfil */}
        <button
          type="button"
          onClick={() => history.push("/profile")}
          style={styles.iconButton}
          className="header-btn"
        >
          <img
            src={profileIcon}
            alt="perfil"
            data-testid="profile-top-btn"
            style={styles.iconImg}
          />
        </button>

        <h1 data-testid="page-title" style={styles.title}>
          {headerData.title}
        </h1>

        {/* Renderização condicional do ícone de busca */}
        {headerData.renderSearchIcon ? (
          <button
            type="button"
            onClick={() =>
              setHeaderData({
                ...headerData,
                showSearchBar: !headerData.showSearchBar,
              })
            }
            style={styles.iconButton}
            className="header-btn"
          >
            <img
              src={searchIcon}
              alt="busca"
              data-testid="search-top-btn"
              style={styles.iconImg}
            />
          </button>
        ) : (
          /* Placeholder para manter o equilíbrio visual do título centralizado */
          <div style={{ width: "34px" }} />
        )}
      </div>

      <div style={styles.gradientLine} />

      {/* Barra de busca com animação de descida */}
      {headerData.showSearchBar && (
        <div
          style={{
            width: "100%",
            padding: "0 20px 25px 20px",
            maxWidth: "850px",
          }}
          className="search-anim"
        >
          <SearchBar />
        </div>
      )}

      <style>{`
        .header-btn:hover img {
          opacity: 1 !important;
          transform: translateY(-1px);
        }
        .search-anim {
          animation: slideDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  );
}
