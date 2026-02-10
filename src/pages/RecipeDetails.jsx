/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { fetchMealByID } from '../services/theMealApi';
import { fetchDrinkByID } from '../services/theCocktailApi';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function RecipeDetails() {
  const history = useHistory();
  const { pathname } = history.location;
  const { id } = useParams();
  
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  // Busca os detalhes da receita com base no tipo (meal ou drink) e ID
  const fetchRecipe = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedData = pathname.includes('meals') 
        ? await fetchMealByID(id) 
        : await fetchDrinkByID(id);
      
      if (fetchedData) {
        setRecipe(Array.isArray(fetchedData) ? fetchedData : [fetchedData]);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    } finally {
      setLoading(false);
    }
  }, [id, pathname]);

  useEffect(() => {
    fetchRecipe();
  }, [fetchRecipe]);

  // Estado de carregamento com loader personalizado e glow
  if (loading) return (
    <div className="content-overlay" style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="glow-loader" />
      <p style={{ color: 'var(--accent-gold)', letterSpacing: '0.8em', fontSize: '9px', textTransform: 'uppercase', zIndex: 10 }}>Collecting</p>
    </div>
  );

  if (!recipe || recipe.length === 0) return null;
  const receipt = recipe[0];

  const styles = {
    // Container principal com compensação para Header e Footer fixos
    container: { 
      paddingBottom: '160px', 
      paddingTop: '80px', 
      minHeight: '100vh',
      position: 'relative',
      overflowX: 'hidden'
    },
    // Efeito visual de fundo (radial gradient) para profundidade
    glow: {
      position: 'absolute',
      top: '10%',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '600px',
      height: '600px',
      background: 'radial-gradient(circle, rgba(197, 164, 126, 0.08) 0%, transparent 70%)',
      zIndex: 0,
      pointerEvents: 'none',
    },
    // Caixa hero para destaque da imagem principal
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
      height: '450px',
      overflow: 'hidden', 
      borderRadius: '2px',
      backgroundColor: '#FFF',
      boxShadow: '0 30px 60px rgba(0,0,0,0.1)',
      border: '1px solid rgba(197, 164, 126, 0.1)'
    },
    heroImg: { 
      width: '100%', 
      height: '100%', 
      objectFit: 'cover'
    }
  };

  return (
    <div className="content-overlay" style={styles.container}>
      <div style={styles.glow} />
      
      <Header />
      
      <div style={styles.heroBox} className="reveal-fade">
        <div style={styles.imgContainer}>
          <img 
            src={receipt.strMealThumb || receipt.strDrinkThumb} 
            alt="" 
            style={styles.heroImg} 
            data-testid="recipe-photo" 
          />
          {/* Overlay gradiente inferior na imagem hero */}
          <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '40%', background: 'linear-gradient(to top, rgba(0,0,0,0.2), transparent)' }} />
        </div>
      </div>

      {/* Cabeçalho de Título e Categoria */}
      <div style={{ padding: '40px 20px', textAlign: 'center', position: 'relative', zIndex: 5 }}>
        <p style={{ fontSize: '9px', color: 'var(--accent-gold)', letterSpacing: '0.5em', textTransform: 'uppercase', marginBottom: '15px' }} data-testid="recipe-category">
          {pathname.includes('meals') ? receipt.strCategory : receipt.strAlcoholic}
        </p>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', margin: '20px 0' }}>
          <div style={{ height: '1px', width: '60px', background: 'linear-gradient(90deg, transparent, rgba(197, 164, 126, 0.3), transparent)' }} />
          <h1 style={{ fontSize: '24px', letterSpacing: '0.8em', textTransform: 'uppercase', fontWeight: '200', color: 'var(--text-main)' }} data-testid="recipe-title">
            {receipt.strMeal || receipt.strDrink}
          </h1>
          <div style={{ height: '1px', width: '60px', background: 'linear-gradient(90deg, transparent, rgba(197, 164, 126, 0.3), transparent)' }} />
        </div>
      </div>

      {/* Listagem Dinâmica de Ingredientes e Medidas */}
      <div style={{ padding: '0 24px', maxWidth: '700px', margin: '0 auto 60px auto', position: 'relative', zIndex: 5 }}>
        <h3 style={{ fontSize: '9px', letterSpacing: '0.5em', textTransform: 'uppercase', color: 'var(--accent-gold)', textAlign: 'center', marginBottom: '30px' }}>Ingredients</h3>
        {Object.keys(receipt)
          .filter((key) => key.includes('strIngredient') && receipt[key])
          .map((ingredient, index) => (
            <div key={index} data-testid={`${index}-ingredient-name-and-measure`} style={{ color: 'var(--text-main)', fontSize: '12px', padding: '18px 0', borderBottom: '1px solid rgba(197, 164, 126, 0.1)', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ opacity: 0.8 }}>{receipt[ingredient]}</span>
              <span style={{ color: 'var(--accent-gold)', fontWeight: '500' }}>
                {receipt[ingredient.replace('strIngredient', 'strMeasure')]}
              </span>
            </div>
          ))}
      </div>

      {/* Seção de Instruções de Preparo */}
      <div style={{ padding: '0 24px', maxWidth: '700px', margin: '0 auto 60px auto', position: 'relative', zIndex: 5 }}>
        <h3 style={{ fontSize: '9px', letterSpacing: '0.5em', textTransform: 'uppercase', color: 'var(--accent-gold)', textAlign: 'center', marginBottom: '30px' }}>Preparation</h3>
        <p data-testid="instructions" style={{ color: 'var(--text-main)', fontSize: '14px', lineHeight: '2.4', textAlign: 'justify', opacity: 0.7 }}>
          {receipt.strInstructions}
        </p>
      </div>

      {/* Botão de ação fixo para iniciar o progresso da receita */}
      <button
        type="button"
        style={{ position: 'fixed', bottom: '100px', left: '50%', transform: 'translateX(-50%)', padding: '22px 0', background: '#1a1a1a', border: 'none', color: '#FFF', fontSize: '9px', letterSpacing: '0.6em', textTransform: 'uppercase', cursor: 'pointer', zIndex: 100, borderRadius: '2px', width: '80%', maxWidth: '350px' }}
        className="btn-impact"
        data-testid="start-recipe-btn"
        onClick={() => history.push(`${pathname}/in-progress`)}
      >
        Acessar Preparo
      </button>

      <Footer />

      <style>{`
        .reveal-fade { animation: revealUp 1.2s cubic-bezier(0.16, 1, 0.3, 1); }
        .btn-impact:hover { background: var(--accent-gold) !important; letter-spacing: 0.8em !important; transform: translateX(-50%) translateY(-3px); }
      `}</style>
    </div>
  );
}