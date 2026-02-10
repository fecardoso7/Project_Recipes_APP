import React, { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import RecipesContext from './Context';
import {
  fetchMealByName,
  fetchMealsList,
  fetchFilteredMeals,
} from '../services/theMealApi';
import {
  fetchDrinkByName,
  fetchDrinksList,
  fetchFilteredDrinks,
  fetchDrinkByFirstLetter,
} from '../services/theCocktailApi';

function ContextProvider({ children }) {
  // Estados globais para receitas, filtros e parâmetros de busca
  const [recipes, setRecipes] = useState([]);
  const [filters, setFilters] = useState([]);
  const [searchMethod, setSearchMethod] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Normaliza o retorno das APIs para garantir o uso de arrays
  const dataExtractor = (data, type) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (type === 'meals' && data.meals) return data.meals;
    if (type === 'drinks' && data.drinks) return data.drinks;
    return [];
  };

  // Busca as categorias de filtros baseadas na rota atual
  const renderFilters = useCallback(async (pathname) => {
    const type = pathname === '/meals' ? 'meals' : 'drinks';
    const rawData = pathname === '/meals' ? await fetchMealsList() : await fetchDrinksList();
    setFilters(dataExtractor(rawData, type));
  }, []);

  // Realiza a busca inicial de receitas ao carregar as páginas
  const renderInitialRecipes = useCallback(async (pathname) => {
    try {
      setRecipes([]); 
      const type = pathname === '/meals' ? 'meals' : 'drinks';
      let rawData;

      if (pathname === '/meals') {
        rawData = await fetchMealByName('');
      } else {
        // Fallback para bebidas caso a busca por nome retorne vazio
        rawData = await fetchDrinkByName('');
        let cleanData = dataExtractor(rawData, 'drinks');

        if (cleanData.length === 0) {
          rawData = await fetchDrinkByFirstLetter('a');
        }
      }

      setRecipes(dataExtractor(rawData, type));
    } catch (error) {
      console.error("Erro no carregamento inicial:", error);
      setRecipes([]);
    }
  }, []);

  // Busca receitas filtradas por categoria específica
  const renderFilteredRecipes = useCallback(async (pathname, filter) => {
    const type = pathname === '/meals' ? 'meals' : 'drinks';
    const rawData = pathname === '/meals' 
      ? await fetchFilteredMeals(filter) 
      : await fetchFilteredDrinks(filter);
    setRecipes(dataExtractor(rawData, type));
  }, []);

  // Memorização do objeto de contexto para otimização de performance
  const contextValue = useMemo(() => ({
    recipes,
    filters,
    searchMethod,
    searchQuery,
    setSearchMethod,
    setSearchQuery,
    renderFilters,
    renderInitialRecipes,
    renderFilteredRecipes,
  }), [recipes, filters, searchMethod, searchQuery, renderFilters, renderInitialRecipes, renderFilteredRecipes]);

  return (
    <RecipesContext.Provider value={ contextValue }>
      {children}
    </RecipesContext.Provider>
  );
}

ContextProvider.propTypes = { children: PropTypes.node.isRequired };

export default ContextProvider;