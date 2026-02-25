document.addEventListener('click', (e) => {
  const link = e.target.closest('a.disabled');
  if (!link) return;

  e.preventDefault();
});

document.addEventListener('click', (e) => {
  const button = e.target.closest('button');

  if (!button) return;
});
