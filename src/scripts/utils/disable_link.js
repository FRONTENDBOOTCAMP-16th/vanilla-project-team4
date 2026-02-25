document.addEventListener('click', (e) => {
  const link = e.target.closest('a.disabled');
  if (!link) return;

  e.preventDefault();
});
