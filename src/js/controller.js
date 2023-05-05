import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarkView from './views/bookmarkView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();

    //1.update results view to mark selected result
    resultsView.update(model.getSearchResultsPage());

    //2.update bookmark view
    bookmarkView.update(model.state.bookmarks);

    //3.loading recipe
    await model.loadRecipe(id);

    //4.rendering recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    console.log(error);
    recipeView.renderError(error);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    //1.get query
    const query = searchView.getQuery();
    if (!query) return;

    //2.load search results
    await model.loadSearchResults(query);

    //3.render search results
    resultsView.render(model.getSearchResultsPage());

    //4.pagination
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
    resultsView.renderError(error);
  }
};

const controlPagination = function (goToPage) {
  //1.render search results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //2.pagination
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //1.update the recipe servings (in state)
  model.updateServings(newServings);

  //2.update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //1. add remove bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookMark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }

  //2. update recipe view
  recipeView.update(model.state.recipe);

  //3. render bookmarks
  bookmarkView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //1.show loading spinner
    addRecipeView.renderSpinner();

    //2.upload the new recipe data
    await model.uploadRecipe(newRecipe);

    //3.render recipe
    recipeView.render(model.state.recipe);

    //4.render success message
    addRecipeView.renderMessage();

    //5.render bookmark view
    bookmarkView.render(model.state.bookmarks);

    //6.change id in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //7.close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
      addRecipeView.removeMessage();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.log(error);
    addRecipeView.renderError(error.message);
  }
};

const init = function () {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  console.log('welcome!');
  console.log('new feature');
};

init();
