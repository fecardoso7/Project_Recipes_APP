import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import RecipesContext from "../context/Context";

export default function SearchBar() {
  // Consumo do contexto global para gerenciar métodos e resultados de busca
  const {
    searchQuery,
    setSearchMethod,
    setSearchQuery,
    handleSearch,
    recipes,
  } = useContext(RecipesContext);

  const history = useHistory();

  // UX Refinement: Redireciona automaticamente se a busca retornar apenas um resultado
  useEffect(() => {
    if (
      recipes &&
      recipes.length === 1 &&
      history.location.pathname === "/meals"
    ) {
      const id = recipes[0].idMeal;
      history.push(`/meals/${id}`);
    }
    if (
      recipes &&
      recipes.length === 1 &&
      history.location.pathname === "/drinks"
    ) {
      const id = recipes[0].idDrink;
      history.push(`/drinks/${id}`);
    }
  }, [recipes, history]);

  const styles = {
    // Container com elevação sutil e bordas suavizadas
    container: {
      display: "flex",
      flexDirection: "column",
      gap: "25px",
      padding: "30px 20px",
      backgroundColor: "#FFFFFF",
      border: "1px solid var(--line-color)",
      borderRadius: "4px",
      marginTop: "10px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
      width: "100%",
    },
    // Input minimalista (apenas linha inferior) seguindo o padrão Premium
    input: {
      width: "100%",
      background: "transparent",
      border: "none",
      borderBottom: "1px solid var(--line-color)",
      padding: "15px 0",
      fontSize: "10px",
      letterSpacing: "0.2em",
      color: "var(--text-main)",
      outline: "none",
      textTransform: "uppercase",
      textAlign: "center",
      transition: "border-color 0.4s ease",
    },
    radioGroup: {
      display: "flex",
      justifyContent: "center",
      gap: "clamp(10px, 3vw, 25px)",
      flexWrap: "wrap",
    },
    // Labels com espaçamento de caracteres para legibilidade e elegância
    label: {
      fontSize: "9px",
      letterSpacing: "0.3em",
      textTransform: "uppercase",
      color: "var(--text-muted)",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      transition: "color 0.3s ease",
    },
    // Botão de execução com borda dourada e transição de estado preenchido
    button: {
      width: "100%",
      padding: "16px",
      background: "var(--bg-primary)",
      border: "1px solid var(--accent-gold)",
      color: "var(--accent-gold)",
      fontSize: "9px",
      letterSpacing: "0.5em",
      textTransform: "uppercase",
      cursor: "pointer",
      transition: "all 0.5s ease",
      marginTop: "5px",
    },
  };

  return (
    <div style={styles.container} className="search-bar-fade">
      {/* Campo de texto vinculado ao estado global */}
      <input
        data-testid="search-input"
        type="text"
        placeholder="O QUE VOCÊ BUSCA?"
        style={styles.input}
        className="search-input-field"
        value={searchQuery}
        onChange={({ target }) => setSearchQuery(target.value)}
      />

      {/* Grupo de seleção de método de busca */}
      <div style={styles.radioGroup}>
        <label style={styles.label} className="label-hover">
          <input
            type="radio"
            name="search"
            style={{ accentColor: "var(--accent-gold)" }}
            onChange={() => setSearchMethod("ingredient")}
            data-testid="ingredient-search-radio"
          />
          Ingrediente
        </label>

        <label style={styles.label} className="label-hover">
          <input
            type="radio"
            name="search"
            style={{ accentColor: "var(--accent-gold)" }}
            onChange={() => setSearchMethod("name")}
            data-testid="name-search-radio"
          />
          Nome
        </label>

        <label style={styles.label} className="label-hover">
          <input
            type="radio"
            name="search"
            style={{ accentColor: "var(--accent-gold)" }}
            onChange={() => setSearchMethod("firstLetter")}
            data-testid="first-letter-search-radio"
          />
          Letra
        </label>
      </div>

      <button
        type="button"
        data-testid="exec-search-btn"
        style={styles.button}
        className="search-exec-btn"
        onClick={() => handleSearch(history.location.pathname)}
      >
        Executar Busca
      </button>

      {/* Definição de animações e estados de hover via CSS-in-JS */}
      <style>{`
        .search-bar-fade { animation: fadeIn 0.8s ease forwards; }
        @keyframes fadeIn { 
          from { opacity: 0; transform: translateY(-5px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        
        .search-input-field:focus { border-color: var(--accent-gold) !important; }
        .label-hover:hover { color: var(--text-main) !important; }
        
        .search-exec-btn:hover { 
          background: var(--accent-gold) !important; 
          color: white !important; 
          box-shadow: 0 4px 15px rgba(197, 164, 126, 0.2);
        }
        
        .search-exec-btn:active { transform: scale(0.98); }
      `}</style>
    </div>
  );
}
