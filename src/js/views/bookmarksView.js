import View from './View';
import previewView from './previewView';

class bookmarkView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errormessage = '还没有喜欢的菜谱，去添加吧！';
  _message = '';

  _generateMarkup() {
    // console.log(this._data);
    // console.log(this._data.map(this._generateMarkupPreview));
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }

  addHandlerRender(handler) {
    window.addEventListener('load', handler());
  }
}

export default new bookmarkView();
