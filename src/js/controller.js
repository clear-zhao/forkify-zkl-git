import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import addrecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { API_URL } from './config.js';
import bookmarkView from './views/bookmarksView.js';

// if (module.hot) {
//   module.hot.accept();
// }

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
// const api = 'https://forkify-api.herokuapp.com/api/v2/recipes/';

const showRecipe = async function () {
  try {
    // 1.loading recipe
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();

    // 标记选中菜谱和书签
    resultView.update(model.getSearchResultPage());
    bookmarkView.update(model.state.bookmarks);

    // 从model里面获取数据
    await model.loadRecipe(API_URL, id);

    // 2.redern recipe  渲染数据到view里面
    recipeView.render(model.state.recipe);
  } catch (e) {
    console.error(e);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // 1.获取输入
    const query = searchView.getQuery();
    if (!query) return;

    resultView.renderSpinner();
    // 2.查询结果
    await model.loadSearchResults(query);

    // 3.渲染结果
    resultView.render(model.getSearchResultPage());

    // 4.渲染分页按钮
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (gotoPage) {
  // 1.渲染新结果
  resultView.render(model.getSearchResultPage(gotoPage));

  // 2.渲染新分页按钮
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  model.updateServings(newServings);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // 渲染图标
  recipeView.update(model.state.recipe);
  // 渲染书签列表
  bookmarkView.render(model.state.bookmarks);
};

const controlBookmarrks = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // 1.接收新菜单
    // console.log(newRecipe);
    addrecipeView.renderSpinner();

    // 2.上传新菜单
    await model.uploadRecipe(newRecipe);

    // 3.渲染新菜谱
    recipeView.render(model.state.recipe);

    // 4.输出成功信息
    addrecipeView.renderMessage();

    // 5.渲染订阅界面
    bookmarkView.render(model.state.bookmarks);

    // 6. 修改页面URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // 7.关闭窗口
    setTimeout(function () {
      addrecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC);
  } catch (err) {
    console.error('💥', err);
    addrecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarkView.addHandlerRender(controlBookmarrks);
  recipeView.addHandlerRender(showRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandelClick(controlPagination);
  addrecipeView.addHandlerUpload(controlAddRecipe);
  console.log('欢迎 ！');
};
init();
