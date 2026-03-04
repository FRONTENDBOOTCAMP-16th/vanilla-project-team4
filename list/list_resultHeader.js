export function getSelectedGenreName(selectedGenreId, genreMap) {
  if (!selectedGenreId) return '전체';
  return genreMap[selectedGenreId] ?? '전체';
}

export function updateResultHeader(
  { resultTitleEl, resultCountEl, noResultsEl, filterStatusEl },
  { selectedGenreId, genreMap },
  count,
) {
  if (!resultTitleEl) return;

  const name = getSelectedGenreName(selectedGenreId, genreMap);

  const firstTextNode = [...resultTitleEl.childNodes].find((n) => n.nodeType === Node.TEXT_NODE);
  if (firstTextNode) firstTextNode.nodeValue = `${name} `;

  if (resultCountEl) resultCountEl.textContent = String(count);
  if (noResultsEl) noResultsEl.hidden = count !== 0;

  if (filterStatusEl) {
    filterStatusEl.textContent = `${name}로 필터링 되었습니다. 결과 ${count}개`;
  }
}
