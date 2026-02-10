import React from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import ContextProvider from "./context/ContextProvider";
import Login from "./pages/Login";
import Recipes from "./pages/Recipes";
import RecipeInProgress from "./pages/RecipeInProgress";
import RecipeDetails from "./pages/RecipeDetails";
import Profile from "./pages/Profile";
import DoneRecipes from "./pages/DoneRecipes";
import FavoriteRecipes from "./pages/FavoriteRecipes";

function App() {
  return (
    // Provedor de estado global que encapsula toda a aplicação
    <ContextProvider>
      <div className="app-main-wrapper">
        {/* Camada visual de iluminação fixa definida no CSS global */}
        <div className="premium-ambient-glow" />

        <main className="content-overlay">
          <Switch>
            {/* Rota inicial: Ponto de entrada para autenticação */}
            <Route exact path="/" component={Login} />
            
            {/* ROTAS ESPECÍFICAS: 
                Devem preceder as rotas genéricas para evitar conflitos de correspondência (match) 
            */}
            <Route exact path="/meals/:id/in-progress" component={RecipeInProgress} />
            <Route exact path="/drinks/:id/in-progress" component={RecipeInProgress} />
            <Route exact path="/meals/:id" component={RecipeDetails} />
            <Route exact path="/drinks/:id" component={RecipeDetails} />
            
            {/* ROTAS GENÉRICAS: 
                Listagem principal de receitas e bebidas 
            */}
            <Route exact path="/meals" component={Recipes} />
            <Route exact path="/drinks" component={Recipes} />
            
            {/* Rotas de gerenciamento de usuário e histórico */}
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/done-recipes" component={DoneRecipes} />
            <Route exact path="/favorite-recipes" component={FavoriteRecipes} />
          </Switch>
        </main>

        {/* Linha final de acabamento com gradiente sutil para manter o aspecto 'Premium' */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent bottom-0 fixed" />
      </div>
    </ContextProvider>
  );
}

export default App;