/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Header from "../components/Header";
import RecipesContext from "../context/Context";
import Footer from "../components/Footer";

export default function Recipes() {
  const history = useHistory();
  const { pathname } = history.location;

  // Consumo do contexto global para gestão de receitas e filtros
  const {
    recipes,
    renderInitialRecipes,
    filters,
    renderFilters,
    renderFilteredRecipes,
  } = useContext(RecipesContext);

  const [activeFilter, setActiveFilter] = useState("");
  const [loading, setLoading] = useState(true);

  // Sincronização de dados baseada na rota atual (comidas/bebidas)
  useEffect(() => {
    const setup = async () => {
      setLoading(true);
      setActiveFilter("");
      if (renderFilters) await renderFilters(pathname);
      if (renderInitialRecipes) await renderInitialRecipes(pathname);
      setLoading(false);
    };
    setup();
  }, [pathname]);

  const styles = {
    // Definição da base e área útil da galeria
    wrapper: {
      backgroundColor: "var(--bg-pure)",
      minHeight: "100vh",
      position: "relative",
    },
    container: {
      padding: "100px 16px 140px 16px",
      maxWidth: "1200px",
      margin: "0 auto",
    },
    // Navegação de categorias com efeito de profundidade e fixação
    filterArea: {
      width: "100%",
      padding: "15px 0",
      position: "sticky",
      top: "0",
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(20px)",
      zIndex: 100,
      borderBottom: "1px solid rgba(197, 164, 126, 0.08)",
    },
    filterScroll: {
      display: "flex",
      gap: "32px",
      overflowX: "auto",
      padding: "10px 20px",
      justifyContent: "center",
      WebkitOverflowScrolling: "touch",
    },
    // Estilização tipográfica dos filtros com feedback visual de estado
    filterBtn: (isActive) => ({
      background: "none",
      border: "none",
      borderBottom: `1.5px solid ${isActive ? "var(--accent-gold)" : "transparent"}`,
      color: isActive ? "var(--text-main)" : "var(--text-muted)",
      fontSize: "10px",
      padding: "8px 0",
      letterSpacing: "0.4em",
      textTransform: "uppercase",
      cursor: "pointer",
      transition: "all 0.3s ease",
      flexShrink: 0,
      opacity: isActive ? 1 : 0.6,
    }),
    // Estrutura de grade responsiva para exibição das peças
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "48px 24px",
      marginTop: "40px",
    },
    card: {
      position: "relative",
      cursor: "pointer",
      width: "100%",
    },
  };

  return (
    <div key={pathname} style={styles.wrapper}>
      <Header />

      <main style={styles.container}>
        {/* Seção de filtros por categoria */}
        <div style={styles.filterArea}>
          <div
            style={styles.filterScroll}
            className="filter-scroll-container hide-scrollbar"
          >
            <button
              type="button"
              style={styles.filterBtn(activeFilter === "")}
              onClick={() => {
                renderInitialRecipes(pathname);
                setActiveFilter("");
              }}
              data-testid="All-category-filter"
            >
              All Collection
            </button>
            {filters?.slice(0, 5).map((f, i) => (
              <button
                key={i}
                type="button"
                style={styles.filterBtn(activeFilter === f.strCategory)}
                onClick={() => {
                  if (activeFilter === f.strCategory) {
                    renderInitialRecipes(pathname);
                    setActiveFilter("");
                  } else {
                    renderFilteredRecipes(pathname, f.strCategory);
                    setActiveFilter(f.strCategory);
                  }
                }}
                data-testid={`${f.strCategory}-category-filter`}
              >
                {f.strCategory}
              </button>
            ))}
          </div>
        </div>

        {/* Galeria de receitas (Exposição principal) */}
        <div style={styles.grid}>
          {loading ? (
            <div
              style={{
                gridColumn: "1/-1",
                textAlign: "center",
                padding: "100px 0",
              }}
            >
              <p
                style={{
                  letterSpacing: "1em",
                  fontSize: "9px",
                  color: "var(--accent-gold)",
                }}
              >
                LOADING EXHIBITION
              </p>
            </div>
          ) : (
            recipes?.slice(0, 12).map((r, i) => (
              <div
                key={r.idDrink || r.idMeal}
                data-testid={`${i}-recipe-card`}
                className="recipe-item"
                onClick={() =>
                  history.push(`${pathname}/${r.idDrink || r.idMeal}`)
                }
                style={styles.card}
              >
                {/* Moldura da imagem com proporção controlada */}
                <div
                  className="img-frame"
                  style={{
                    width: "100%",
                    position: "relative",
                    overflow: "hidden",
                    padding: "10px",
                    border: "1px solid var(--line-color)",
                    backgroundColor: "#FFF",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: "4/5",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={r.strDrinkThumb || r.strMealThumb}
                      alt={r.strDrink || r.strMeal}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "1.5s cubic-bezier(0.19, 1, 0.22, 1)",
                      }}
                      className="main-img"
                      data-testid={`${i}-card-img`}
                    />
                  </div>
                </div>

                {/* Bloco de informações e título premium */}
                <div
                  style={{
                    marginTop: "20px",
                    textAlign: "center",
                    padding: "0 8px",
                  }}
                >
                  <h2
                    className="premium-title"
                    data-testid={`${i}-card-name`}
                    style={{
                      fontSize: "11px",
                      letterSpacing: "0.6em",
                      margin: "0 auto",
                      lineHeight: "1.5",
                    }}
                  >
                    {r.strDrink || r.strMeal}
                  </h2>
                  <div
                    style={{
                      height: "1px",
                      width: "24px",
                      background: "var(--accent-gold)",
                      margin: "12px auto 0 auto",
                      opacity: 0.4,
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <Footer />

      {/* Ajustes finos para comportamento mobile e interações desktop */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @media (min-width: 1024px) {
          .recipe-item:hover .main-img { transform: scale(1.1); }
          .recipe-item:hover .img-frame { border-color: var(--accent-gold); }
        }

        .recipe-item {
          animation: revealUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes revealUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .premium-title { letter-spacing: 0.4em !important; }
          
          .filter-scroll-container { 
            justify-content: flex-start !important;
            scroll-snap-type: x proximity;
          }
          
          .filter-scroll-container button {
            scroll-snap-align: start;
          }

          div[style*="gridTemplateColumns"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
