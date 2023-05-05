import View from './View';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const curpage = this._data.page;
    const page = Math.ceil(this._data.result.length / this._data.resultPage);

    if (curpage === 1 && page > 1) {
      return `
        <button data-goto="${
          curpage + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page ${curpage + 1}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
      `;
    }

    if (curpage === page && page > 1) {
      return `
        <button data-goto="${
          curpage - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curpage - 1}</span>
        </button>
      `;
    }

    if (curpage < page) {
      return `
        <button data-goto="${
          curpage - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curpage - 1}</span>
        </button>
        <button data-goto="${
          curpage + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page ${curpage + 1}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
      `;
    }

    return ` `;
  }
}

export default new PaginationView();
