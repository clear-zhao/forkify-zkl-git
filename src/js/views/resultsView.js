import View from './View';
import previewView from './previewView';

class resultView extends View {
  _parentElement = document.querySelector('.results');
  _errormessage = '没有找到您想要的菜谱。。。';
  _message = '';

  _generateMarkup() {
    // console.log(this._data);
    // console.log(this._data.map(this._generateMarkupPreview));
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new resultView();
