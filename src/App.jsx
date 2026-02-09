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
    <ContextProvider>
      {/* Container Principal com Fundo Dinâmico */}
      <div className="app-main-wrapper">
        {/* Camada de Brilho (Glow) de Fundo */}
        <div className="premium-ambient-glow" />

        <main className="content-overlay">
          <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/meals" component={Recipes} />
            <Route exact path="/drinks" component={Recipes} />
            <Route exact path="/drinks/:id" component={RecipeDetails} />
            <Route exact path="/meals/:id" component={RecipeDetails} />
            <Route
              exact
              path="/meals/:id/in-progress"
              component={RecipeInProgress}
            />
            <Route
              exact
              path="/drinks/:id/in-progress"
              component={RecipeInProgress}
            />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/done-recipes" component={DoneRecipes} />
            <Route exact path="/favorite-recipes" component={FavoriteRecipes} />
          </Switch>
        </main>

        {/* Linha Final de Gradiente para fechamento visual */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent bottom-0 fixed" />
      </div>
    </ContextProvider>
  );
}

export default App;
