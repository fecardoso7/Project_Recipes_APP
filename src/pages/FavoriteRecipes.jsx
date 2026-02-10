import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import copy from 'clipboard-copy';
import shareIcon from '../images/shareIcon.svg';
import blackFavoriteIcon from '../images/blackHeartIcon.svg';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function FavoriteRecipes() {
  // Estados para gerenciar receitas favoritas, feedback de cópia e filtros
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [linksCopied, setLinksCopied] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const history = useHistory();

  // Carrega as receitas favoritas do localStorage ao iniciar
  const loadFavorites = useCallback(() => {
    const favoriteRecipesStorage = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
    setFavoriteRecipes(favoriteRecipesStorage);
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // Remove uma receita dos favoritos e atualiza o estado local
  const removeFavorite = (id) => {
    const favoriteRecipesStorage = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
    const filteredRecipes = favoriteRecipesStorage.filter((recipe) => recipe.id !== id);
    localStorage.setItem('favoriteRecipes', JSON.stringify(filteredRecipes));
    setFavoriteRecipes(filteredRecipes);
  };

  // Copia a URL da receita e exibe mensagem temporária de sucesso
  const clipboardUrl = (type, id) => {
    const url = `${window.location.origin}/${type}s/${id}`;
    copy(url);
    setLinksCopied(id);
    setTimeout(() => setLinksCopied(''), 2000);
  };

  // Aplica filtros de categoria sem modificar o armazenamento original
  const handleFilter = (filter) => {
    setActiveFilter(filter);
    const favoriteRecipesStorage = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
    if (filter === 'all') {
      setFavoriteRecipes(favoriteRecipesStorage);
    } else {
      const filtered = favoriteRecipesStorage.filter((recipe) => recipe.type === filter);
      setFavoriteRecipes(filtered);
    }
  };

  const styles = {
    // Layout do container principal com respiro para elementos fixos
    main: { 
      padding: '100px 20px 160px 20px', 
      maxWidth: '850px', 
      margin: '0 auto',
      width: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    // Barra de filtros com comportamento sticky para navegação fluida
    filterBar: { 
      display: 'flex', 
      justifyContent: 'center', 
      gap: 'clamp(15px, 5vw, 40px)', 
      padding: '30px 0',
      position: 'sticky',
      top: '52px', 
      backgroundColor: 'var(--bg-primary)',
      zIndex: 100,
      width: '100%'
    },
    // Estilo visual dos botões de filtro com indicação de ativo
    filterBtn: (isActive) => ({
      background: 'none', 
      border: 'none', 
      color: isActive ? 'var(--accent-gold)' : 'var(--text-muted)',
      fontSize: 'clamp(8px, 2vw, 10px)', 
      letterSpacing: '0.4em', 
      textTransform: 'uppercase',
      cursor: 'pointer', 
      transition: '0.4s ease',
      borderBottom: isActive ? '1px solid var(--accent-gold)' : '1px solid transparent',
      paddingBottom: '8px'
    }),
    // Estrutura premium do card de receita
    card: {
      display: 'flex', 
      backgroundColor: '#FFFFFF',
      border: '1px solid var(--line-color)', 
      marginBottom: '24px',
      borderRadius: '4px', 
      overflow: 'hidden', 
      position: 'relative', 
      minHeight: '160px',
      width: '100%',
      boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
    },
    imgBox: { 
      width: 'clamp(120px, 35%, 260px)', 
      cursor: 'pointer', 
      overflow: 'hidden',
      flexShrink: 0 
    },
    image: { width: '100%', height: '100%', objectFit: 'cover', transition: '0.8s ease' },
    content: { 
      padding: 'clamp(15px, 3vw, 30px)', 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center',
      minWidth: 0 
    },
    meta: { 
      fontSize: '9px', 
      letterSpacing: '0.2em', 
      color: 'var(--accent-gold)', 
      textTransform: 'uppercase', 
      marginBottom: '6px',
      fontWeight: '500' 
    },
    name: { 
      fontSize: 'clamp(14px, 2.5vw, 18px)', 
      color: 'var(--text-main)', 
      marginBottom: '12px', 
      cursor: 'pointer', 
      background: 'none', 
      border: 'none', 
      textAlign: 'left', 
      padding: 0,
      width: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    actionTray: { display: 'flex', gap: '20px', alignItems: 'center' },
    iconBtn: { 
        background: 'none', 
        border: 'none', 
        cursor: 'pointer', 
        padding: '5px', 
        transition: '0.3s',
        opacity: 0.7
    },
    iconImg: { width: '18px' }
  };

  return (
    <div className="content-overlay" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={styles.main}>
        {/* Seção de filtros da galeria */}
        <section style={styles.filterBar}>
          {['all', 'meal', 'drink'].map((t) => (
            <button
              key={t}
              data-testid={`filter-by-${t}-btn`}
              style={styles.filterBtn(activeFilter === t)}
              onClick={() => handleFilter(t)}
            >
              {t === 'all' ? 'Coleção' : t === 'meal' ? 'Pratos' : 'Bebidas'}
            </button>
          ))}
        </section>

        {/* Listagem dinâmica de favoritos */}
        <section style={{ width: '100%' }}>
          {favoriteRecipes.length > 0 ? (
            favoriteRecipes.map((recipe, i) => (
              <div key={recipe.id} style={styles.card} className="fav-card-anim">
                <div style={styles.imgBox} onClick={() => history.push(`/${recipe.type}s/${recipe.id}`)}>
                  <img src={recipe.image} alt={recipe.name} data-testid={`${i}-horizontal-image`} style={styles.image} className="fav-img" />
                </div>

                <div style={styles.content}>
                  <p style={styles.meta} data-testid={`${i}-horizontal-top-text`}>
                    {recipe.type === 'meal' ? `${recipe.nationality} • ${recipe.category}` : recipe.alcoholicOrNot}
                  </p>
                  
                  <button style={styles.name} className="premium-title" data-testid={`${i}-horizontal-name-button`} onClick={() => history.push(`/${recipe.type}s/${recipe.id}`)}>
                    <span data-testid={`${i}-horizontal-name`}>{recipe.name}</span>
                  </button>

                  <div style={styles.actionTray}>
                    <button style={styles.iconBtn} className="icon-hover" data-testid={`${i}-horizontal-share-btn`} onClick={() => clipboardUrl(recipe.type, recipe.id)}>
                      <img src={shareIcon} alt="share" style={styles.iconImg} />
                    </button>

                    <button style={styles.iconBtn} className="icon-hover" onClick={() => removeFavorite(recipe.id)}>
                      <img src={blackFavoriteIcon} alt="unfav" data-testid={`${i}-horizontal-favorite-btn`} style={styles.iconImg} />
                    </button>
                    
                    {/* Feedback visual de link copiado */}
                    {linksCopied === recipe.id && (
                      <span style={{ fontSize: '8px', color: 'var(--accent-gold)', letterSpacing: '0.1em', fontWeight: '600' }}>LINK COPIADO</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            /* Mensagem de estado vazio */
            <div style={{ textAlign: 'center', padding: '120px 0', opacity: 0.5 }}>
                <div className="premium-title" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Galeria de Favoritos Vazia</div>
            </div>
          )}
        </section>
      </main>
      <Footer />
      {/* Estilos para animações de hover e responsividade mobile */}
      <style>{`
        header { z-index: 1000 !important; }
        .fav-card-anim { transition: transform 0.4s ease, box-shadow 0.4s ease; }
        .fav-card-anim:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.06); }
        .fav-img:hover { transform: scale(1.06); }
        .icon-hover:hover { opacity: 1 !important; transform: scale(1.1); color: var(--accent-gold) !important; }
        
        @media (max-width: 600px) {
          .fav-card-anim { min-height: 140px !important; }
        }
      `}</style>
    </div>
  );
}