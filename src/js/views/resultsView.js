import View from './View';
import previewView from './previewView';

class ResultView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Plear try again';
  _message = '';

  _generateMarkup() {
    return this._data.map(rs => previewView.render(rs, false)).join('');
  }
}

export default new ResultView();
