export const PAGE_GROUP_SIZE = 10;
export const MAX_PAGES = 500;

export const state = {
  currentPage: 1,
  totalPages: 1,
  genreMap: {}, // { [id]: name }
  selectedGenreId: null, // null이면 전체
};
