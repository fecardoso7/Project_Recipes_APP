/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import copy from 'clipboard-copy';
import { fetchMealByID } from '../services/theMealApi';
import { fetchDrinkByID } from '../services/theCocktailApi';
import { saveFavoriteRecipe } from '../services/storage';
import shareIcon from '../images/shareIcon.svg';
import blackFavoriteIcon from '../images/blackHeartIcon.svg';
import whiteFavoriteIcon from '../images/whiteHeartIcon.svg';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function RecipeInProgress() {
  // Estados para gerenciar dados da receita, favoritos, feedback de cópia e checklist
  const [recipe, setRecipe] = useState(null);
  const [favorite, setFavorite] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [usedIngredients, setUsedIngredients] = useState([]);
  
  const { id } = useParams();
  const history = useHistory();
  const { pathname } = history.location;

  // Busca os detalhes da receita através da API correspondente (comida ou bebida)
  const fetchRecipe = useCallback(async () => {
    const fetchedData = pathname.includes('meals') 
      ? await fetchMealByID(id) 
      : await fetchDrinkByID(id);
    const dataArray = Array.isArray(fetchedData) ? fetchedData : [fetchedData];
    setRecipe(dataArray);
  }, [id, pathname]);

  // Verifica se o ID atual já está salvo nos favoritos do localStorage
  const checkFavorite = useCallback(() => {
    const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
    setFavorite(favoriteRecipes.some((fav) => fav.id === id));
  }, [id]);

  // Recupera o progresso salvo de ingredientes já marcados para esta receita específica
  const checkUsedIngredients = useCallback(() => {
    const inProgressRecipes = JSON.parse(localStorage.getItem('inProgressRecipes')) || { meals: {}, drinks: {} };
    const type = pathname.includes('meals') ? 'meals' : 'drinks';
    if (inProgressRecipes[type]?.[id]) {
      setUsedIngredients(inProgressRecipes[type][id]);
    }
  }, [id, pathname]);

  useEffect(() => {
    fetchRecipe();
    checkFavorite();
    checkUsedIngredients();
  }, [fetchRecipe, checkFavorite, checkUsedIngredients]);

  // Alterna a receita entre favorita e não-favorita no localStorage
  const toggleFavorite = () => {
    const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
    const isAlreadyFavorite = favoriteRecipes.some((fav) => fav.id === id);

    if (isAlreadyFavorite) {
      const removedFavorite = favoriteRecipes.filter((fav) => fav.id !== id);
      localStorage.setItem('favoriteRecipes', JSON.stringify(removedFavorite));
      setFavorite(false);
    } else if (recipe?.[0]) {
      const item = recipe[0];
      const favoriteObj = {
        id: item.idMeal || item.idDrink,
        type: pathname.includes('meals') ? 'meal' : 'drink',
        nationality: item.strArea || '',
        category: item.strCategory || '',
        alcoholicOrNot: item.strAlcoholic || '',
        name: item.strMeal || item.strDrink,
        image: item.strMealThumb || item.strDrinkThumb,
      };
      saveFavoriteRecipe(favoriteObj);
      setFavorite(true);
    }
  };

  // Atualiza a lista de ingredientes usados e persiste o progresso no storage
  const handleUsedIngredients = (ingredient) => {
    const newIngredients = usedIngredients.includes(ingredient)
      ? usedIngredients.filter((i) => i !== ingredient)
      : [...usedIngredients, ingredient];
    
    setUsedIngredients(newIngredients);
    const stored = JSON.parse(localStorage.getItem('inProgressRecipes')) || { drinks: {}, meals: {} };
    const type = pathname.includes('meals') ? 'meals' : 'drinks';
    if (!stored[type]) stored[type] = {};
    stored[type][id] = newIngredients;
    localStorage.setItem('inProgressRecipes', JSON.stringify(stored));
  };

  // Salva a receita na lista de finalizadas e redireciona o usuário
  const handleFinish = (item) => {
    const doneRecipes = JSON.parse(localStorage.getItem('doneRecipes')) || [];
    const newDone = {
      id: item.idMeal || item.idDrink,
      type: pathname.includes('meals') ? 'meal' : 'drink',
      nationality: item.strArea || '',
      category: item.strCategory || '',
      alcoholicOrNot: item.strAlcoholic || '',
      name: item.strMeal || item.strDrink,
      image: item.strMealThumb || item.strDrinkThumb,
      doneDate: new Date().toISOString(),
      tags: item.strTags ? item.strTags.split(',') : [],
    };
    localStorage.setItem('doneRecipes', JSON.stringify([...doneRecipes, newDone]));
    history.push('/done-recipes');
  };

  const styles = {
    container: {
      paddingTop: '80px', 
      paddingBottom: '160px',
      minHeight: '100vh',
      position: 'relative',
      overflowX: 'hidden'
    },
    glow: {
      position: 'absolute',
      top: '5%',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '600px',
      height: '600px',
      background: 'radial-gradient(circle, rgba(197, 164, 126, 0.08) 0%, transparent 70%)',
      zIndex: 0,
      pointerEvents: 'none',
    },
    heroBox: { 
      width: '100%', 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      zIndex: 5,
      position: 'relative'
    },
    imgContainer: { 
      position: 'relative', 
      width: '100%', 
      height: '400px',
      overflow: 'hidden', 
      borderRadius: '2px',
      backgroundColor: '#FFF',
      boxShadow: '0 25px 50px rgba(0,0,0,0.1)',
      border: '1px solid rgba(197, 164, 126, 0.1)'
    },
    heroImg: { width: '100%', height: '100%', objectFit: 'cover' },
    actionTray: { 
        position: 'absolute', 
        top: '40px', 
        right: '40px', 
        display: 'flex', 
        gap: '12px',
        zIndex: 10
    },
    iconBtn: { 
      background: 'rgba(255, 255, 255, 0.85)', 
      backdropFilter: 'blur(10px)', 
      border: '1px solid rgba(197, 164, 126, 0.2)', 
      padding: '12px', 
      borderRadius: '2px', 
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    titleSection: {
        textAlign: 'center',
        padding: '40px 20px',
        position: 'relative',
        zIndex: 5
    },
    title: { 
      fontSize: '24px', 
      letterSpacing: '0.8em',
      textTransform: 'uppercase',
      fontWeight: '200',
      color: 'var(--text-main)',
      margin: '15px 0'
    },
    section: { 
        padding: '0 24px', 
        maxWidth: '700px', 
        margin: '0 auto 60px auto',
        position: 'relative',
        zIndex: 5
    },
    sectionTitle: { 
        fontSize: '9px', 
        letterSpacing: '0.5em', 
        textTransform: 'uppercase', 
        color: 'var(--accent-gold)',
        textAlign: 'center',
        marginBottom: '30px'
    },
    ingredientLabel: (isChecked) => ({
        display: 'flex', 
        alignItems: 'center', 
        gap: '16px', 
        padding: '20px 0',
        borderBottom: '1px solid rgba(197, 164, 126, 0.1)',
        color: isChecked ? 'var(--text-muted)' : 'var(--text-main)',
        textDecoration: isChecked ? 'line-through' : 'none',
        fontSize: '12px',
        letterSpacing: '0.05em',
        transition: '0.3s',
        cursor: 'pointer',
        opacity: isChecked ? 0.5 : 1
    }),
    finishBtn: (disabled) => ({
      position: 'fixed', 
      bottom: '100px', 
      left: '50%', 
      transform: 'translateX(-50%)',
      padding: '22px 0', 
      background: disabled ? '#f4f1ec' : '#1a1a1a',
      border: 'none', 
      color: disabled ? '#ccc' : '#FFF',
      fontSize: '9px', 
      letterSpacing: '0.6em', 
      textTransform: 'uppercase', 
      zIndex: 100, 
      borderRadius: '2px', 
      width: '80%', 
      maxWidth: '350px',
      transition: '0.4s',
      cursor: disabled ? 'not-allowed' : 'pointer',
      boxShadow: disabled ? 'none' : '0 20px 40px rgba(0,0,0,0.2)'
    })
  };

  return (
    <div className="content-overlay" style={styles.container}>
      <div style={styles.glow} />
      <Header />
      
      <div style={styles.contentArea}>
        {recipe?.map((item) => (
          <main key={item.idMeal || item.idDrink} className="reveal-fade">
            <div style={styles.heroBox}>
              <div style={styles.imgContainer}>
                <img src={item.strMealThumb || item.strDrinkThumb} alt="" style={styles.heroImg} />
                <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '30%', background: 'linear-gradient(to top, rgba(0,0,0,0.2), transparent)' }} />
              </div>
              <div style={styles.actionTray}>
                <button 
                    onClick={() => { copy(window.location.href.replace('/in-progress', '')); setLinkCopied(true); setTimeout(() => setLinkCopied(false), 2000); }} 
                    style={styles.iconBtn}
                    className="hover-scale"
                >
                  <img src={shareIcon} alt="share" style={{ width: '16px' }} />
                </button>
                <button 
                    onClick={toggleFavorite} 
                    style={styles.iconBtn}
                    className="hover-scale"
                >
                  <img src={favorite ? blackFavoriteIcon : whiteFavoriteIcon} alt="fav" style={{ width: '16px' }} />
                </button>
              </div>
            </div>

            <div style={styles.titleSection}>
                <p style={{ color: 'var(--accent-gold)', fontSize: '9px', letterSpacing: '0.5em', textTransform: 'uppercase' }}>
                    {item.strCategory}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', margin: '15px 0' }}>
                    <div style={{ height: '1px', width: '40px', background: 'linear-gradient(90deg, transparent, rgba(197, 164, 126, 0.3), transparent)' }} />
                    <h1 style={styles.title} data-testid="recipe-title">
                        {item.strMeal || item.strDrink}
                    </h1>
                    <div style={{ height: '1px', width: '40px', background: 'linear-gradient(90deg, transparent, rgba(197, 164, 126, 0.3), transparent)' }} />
                </div>
            </div>

            <section style={styles.section}>
              <h3 style={styles.sectionTitle}>Checklist</h3>
              {Object.keys(item).filter((k) => k.includes('strIngredient') && item[k]).map((ing, idx) => (
                <label 
                    key={idx} 
                    style={styles.ingredientLabel(usedIngredients.includes(item[ing]))} 
                    data-testid={`${idx}-ingredient-step`}
                >
                  <input 
                    type="checkbox" 
                    style={{ accentColor: 'var(--accent-gold)', width: '16px', height: '16px', cursor: 'pointer' }} 
                    onChange={() => handleUsedIngredients(item[ing])} 
                    checked={usedIngredients.includes(item[ing])} 
                  />
                  <span>{item[ing]}</span>
                  <span style={{ opacity: 0.4, fontSize: '10px', marginLeft: 'auto' }}>
                    {item[ing.replace('strIngredient', 'strMeasure')]}
                  </span>
                </label>
              ))}
            </section>

            <section style={styles.section}>
              <h3 style={styles.sectionTitle}>Instructions</h3>
              <p style={{ fontSize: '14px', lineHeight: '2.4', color: 'var(--text-main)', textAlign: 'justify', opacity: 0.7, letterSpacing: '0.02em' }} data-testid="instructions">
                {item.strInstructions}
              </p>
            </section>

            {/* O botão é habilitado apenas quando todos os ingredientes forem marcados */}
            <button
              data-testid="finish-recipe-btn"
              disabled={Object.keys(item).filter((k) => k.includes('strIngredient') && item[k]).length !== usedIngredients.length}
              style={styles.finishBtn(Object.keys(item).filter((k) => k.includes('strIngredient') && item[k]).length !== usedIngredients.length)}
              onClick={() => handleFinish(item)}
              className="btn-impact"
            >
              Finalizar Preparo
            </button>
          </main>
        ))}
      </div>

      {linkCopied && (
        <div className="copy-toast">LINK COPIADO</div>
      )}

      <Footer />

      <style>{`
        .reveal-fade { animation: revealUp 1.2s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes revealUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        
        .hover-scale:active { transform: scale(0.9); }
        
        .btn-impact:not(:disabled):hover {
            background: var(--accent-gold) !important;
            letter-spacing: 0.8em !important;
            transform: translateX(-50%) translateY(-3px);
        }

        .copy-toast {
            position: fixed;
            bottom: 200px;
            left: 50%;
            transform: translateX(-50%);
            background: #1a1a1a;
            color: #FFF;
            padding: 12px 24px;
            font-size: 8px;
            letter-spacing: 0.4em;
            z-index: 1000;
            border: 1px solid var(--accent-gold);
            animation: fadeInOut 2s ease forwards;
        }

        @keyframes fadeInOut {
            0% { opacity: 0; transform: translateX(-50%) translateY(10px); }
            20% { opacity: 1; transform: translateX(-50%) translateY(0); }
            80% { opacity: 1; }
            100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}