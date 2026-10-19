const filters = document.querySelectorAll('[data-filter]');
const papers = document.querySelectorAll('[data-category]');
filters.forEach(button => {
  button.addEventListener('click', () => {
    const category = button.dataset.filter;
    filters.forEach(item => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    let count = 0;
    papers.forEach(paper => {
      paper.hidden = category !== 'all' && paper.dataset.category !== category;
      if (!paper.hidden) count++;
    });
    document.querySelector('#filter-status').textContent = `Showing ${count} publications${category === 'all' ? '' : ` in ${button.textContent.trim()}`}.`;
  });
});
// Keep direct links to publications useful even after a different filter was selected.
function revealLinkedPaper() {
  const paper = document.getElementById(location.hash.slice(1));
  if (paper?.matches('[data-category]') && paper.hidden) {
    document.querySelector('[data-filter="all"]').click();
    paper.scrollIntoView({ block: 'start' });
  }
}
window.addEventListener('hashchange', revealLinkedPaper);
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', () => {
    const paper = document.getElementById(link.getAttribute('href').slice(1));
    if (paper?.matches('[data-category]') && paper.hidden) {
      document.querySelector('[data-filter="all"]').click();
    }
  });
});
revealLinkedPaper();

const figureDialog = document.querySelector('.figure-dialog');
document.querySelectorAll('.teaser-open').forEach(button => {
  button.addEventListener('click', () => {
    const figure = button.closest('.paper-teaser');
    const image = button.querySelector('img').cloneNode(true);
    image.loading = 'eager';
    figureDialog.querySelector('#figure-dialog-title').textContent = figure.dataset.figureTitle;
    const enlargedFigure = document.createElement('figure');
    enlargedFigure.append(image, figure.querySelector('figcaption').cloneNode(true));
    figureDialog.querySelector('.figure-dialog-content').replaceChildren(enlargedFigure);
    figureDialog.showModal();
  });
});
figureDialog.querySelector('.figure-close').addEventListener('click', () => figureDialog.close());
figureDialog.addEventListener('click', event => {
  if (event.target !== figureDialog) return;
  const box = figureDialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right ||
      event.clientY < box.top || event.clientY > box.bottom) figureDialog.close();
});
