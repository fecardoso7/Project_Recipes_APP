import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import copy from 'clipboard-copy';
import shareIcon from '../images/shareIcon.svg';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function DoneRecipes() {
  const [doneRecipes, setDoneRecipes] = useState([]);
  const [linkCopied, setLinkCopied] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const history = useHistory();

  // Carrega as receitas do storage e garante que o estado receba um array
  const loadRecipes = useCallback(() => {
    const stored = localStorage.getItem('doneRecipes');
    const parsed = stored ? JSON.parse(stored) : [];
    setDoneRecipes(Array.isArray(parsed) ? parsed : []);
  }, []);

  useEffect(() => {
    loadRecipes();
  }, [loadRecipes]);

  // Gerencia a cópia da URL e o feedback visual temporário
  const clipboardUrl = (type, id) => {
    const url = `${window.location.origin}/${type}s/${id}`;
    copy(url);
    setLinkCopied(id);
    setTimeout(() => setLinkCopied(''), 2000);
  };

  // Filtra as receitas exibidas sem alterar o conteúdo do localStorage
  const handleFilter = (filter) => {
    setActiveFilter(filter);
    const allRecipes = JSON.parse(localStorage.getItem('doneRecipes')) || [];
    if (filter === 'all') {
      setDoneRecipes(allRecipes);
    } else {
      setDoneRecipes(allRecipes.filter((r) => r.type === filter));
    }
  };

  const styles = {
    // Configurações de layout principal e espaçamentos
    main: { 
      padding: '100px 20px 160px 20px', 
      maxWidth: '850px', 
      margin: '0 auto',
      width: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    // Barra de navegação interna fixa durante o scroll
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
    // Estilo condicional para os botões de filtro (All, Meals, Drinks)
    filterBtn: (isActive) => ({
      background: 'none', 
      border: 'none', 
      color: isActive ? 'var(--accent-gold)' : 'var(--text-muted)',
      fontSize: 'clamp(8px, 2vw, 10px)', 
      letterSpacing: '0.4em', 
      textTransform: 'uppercase',
      cursor: 'pointer',
      paddingBottom: '8px',
      borderBottom: isActive ? '1px solid var(--accent-gold)' : '1px solid transparent',
      transition: '0.3s'
    }),
    // Estrutura visual do card de receita finalizada
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
      marginBottom: '8px', 
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
    date: { fontSize: '10px', color: 'var(--text-muted)', marginBottom: '15px', opacity: 0.7 },
    tagContainer: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
    tag: { 
      fontSize: '8px', padding: '4px 10px', 
      backgroundColor: 'rgba(197, 164, 126, 0.08)',
      color: 'var(--accent-gold)', 
      textTransform: 'uppercase', 
      letterSpacing: '0.1em',
      borderRadius: '2px'
    },
    shareBtn: { 
      position: 'absolute', top: '15px', right: '15px', 
      background: 'rgba(255,255,255,0.9)', border: '1px solid var(--line-color)', 
      padding: '8px', borderRadius: '50%', cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 10
    }
  };

  return (
    <div className="content-overlay" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      <main style={styles.main}>
        {/* Renderização da barra de navegação de categorias */}
        <section style={styles.filterBar}>
          {['all', 'meal', 'drink'].map((t) => (
            <button
              key={t}
              data-testid={`filter-by-${t}-btn`}
              style={styles.filterBtn(activeFilter === t)}
              onClick={() => handleFilter(t)}
            >
              {t === 'all' ? 'Histórico' : t === 'meal' ? 'Pratos' : 'Bebidas'}
            </button>
          ))}
        </section>

        {/* Listagem das receitas com tratamento de array vazio */}
        <section style={{ width: '100%' }}>
          {doneRecipes.length > 0 ? doneRecipes.map((recipe, i) => (
            <div key={i} style={styles.card} className="done-card-anim">
              <div style={styles.imgBox} onClick={() => history.push(`/${recipe.type}s/${recipe.id}`)}>
                <img src={recipe.image} alt={recipe.name} data-testid={`${i}-horizontal-image`} style={styles.image} className="card-img" />
              </div>

              <div style={styles.content}>
                <p style={styles.meta} data-testid={`${i}-horizontal-top-text`}>
                  {recipe.type === 'meal' ? `${recipe.nationality} • ${recipe.category}` : recipe.alcoholicOrNot}
                </p>
                
                <button style={styles.name} className="premium-title" data-testid={`${i}-horizontal-name-button`} onClick={() => history.push(`/${recipe.type}s/${recipe.id}`)}>
                  <span data-testid={`${i}-horizontal-name`}>{recipe.name}</span>
                </button>

                <p style={styles.date} data-testid={`${i}-horizontal-done-date`}>
                  Finalizada em {new Date(recipe.doneDate).toLocaleDateString('pt-BR')}
                </p>

                {/* Tags da receita limitada às duas primeiras */}
                <div style={styles.tagContainer}>
                  {recipe.tags?.slice(0, 2).map((tag, tIdx) => (
                    <span key={tIdx} style={styles.tag} data-testid={`${i}-${tag}-horizontal-tag`}>{tag}</span>
                  ))}
                </div>

                <button style={styles.shareBtn} className="icon-hover" data-testid={`${i}-horizontal-share-btn`} onClick={() => clipboardUrl(recipe.type, recipe.id)}>
                  <img src={shareIcon} alt="share" style={{ width: '14px' }} />
                </button>
                
                {/* Balão informativo de cópia bem-sucedida */}
                {linkCopied === recipe.id && (
                  <span style={{ position: 'absolute', top: '55px', right: '15px', fontSize: '7px', color: 'var(--accent-gold)', letterSpacing: '0.1em', fontWeight: 'bold' }}>COPIADO</span>
                )}
              </div>
            </div>
          )) : (
            <div style={{ textAlign: 'center', padding: '120px 0', opacity: 0.5 }}>
              <p className="premium-title" style={{ fontSize: '10px' }}>Nenhuma receita registrada.</p>
            </div>
          )}
        </section>
      </main>

      <Footer />

      {/* Definições de animação CSS e responsividade mobile */}
      <style>{`
        header { z-index: 1000 !important; }
        .done-card-anim { transition: transform 0.4s ease, box-shadow 0.4s ease; }
        .done-card-anim:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.06); }
        .card-img:hover { transform: scale(1.06); }
        .icon-hover:hover { border-color: var(--accent-gold) !important; transform: scale(1.1); }
        
        @media (max-width: 600px) {
          .done-card-anim { min-height: 140px !important; }
        }
      `}</style>
    </div>
  );
}