export function buildDetailUrls(movieNum) {
  return {
    detailUrl: `https://api.themoviedb.org/3/movie/${movieNum}?language=ko-KR`,
    creditsUrl: `https://api.themoviedb.org/3/movie/${movieNum}/credits?language=ko-KR`,
    stillsUrl: `https://api.themoviedb.org/3/movie/${movieNum}/images?include_image_language=null`,
    videosUrl: `https://api.themoviedb.org/3/movie/${movieNum}/videos?language=ko-KR&include_video_language=ko,en,null`,
    similarUrl: `https://api.themoviedb.org/3/movie/${movieNum}/similar?language=ko-KR&page=1`,
  };
}

export async function fetchJsonOrThrow(url, options) {
  const res = await fetch(url, options);
  return { res, data: res.ok ? await res.json() : null };
}

export async function fetchDetail(url, options) {
  try {
    const { res, data } = await fetchJsonOrThrow(url, options);
    if (!res.ok) return { ok: false, status: res.status, data: null };
    return { ok: true, status: res.status, data };
  } catch (err) {
    return { ok: false, status: 0, data: null, err };
  }
}

export async function fetchCredits(url, options) {
  try {
    const { res, data } = await fetchJsonOrThrow(url, options);
    if (!res.ok || !data) return { cast: [] };
    return data;
  } catch {
    return { cast: [] };
  }
}

export async function fetchStills(url, options) {
  try {
    const { res, data } = await fetchJsonOrThrow(url, options);
    if (!res.ok) return { ok: false, status: res.status, data: null };
    return { ok: true, status: res.status, data };
  } catch (err) {
    return { ok: false, status: 0, data: null, err };
  }
}

export async function fetchTrailerKey(url, options) {
  try {
    const { res, data } = await fetchJsonOrThrow(url, options);
    if (!res.ok || !data) return null;

    const results = Array.isArray(data?.results) ? data.results : [];

    const trailer =
      results.find((v) => v?.site === 'YouTube' && v?.type === 'Trailer' && v?.key) ||
      results.find((v) => v?.site === 'YouTube' && v?.type === 'Teaser' && v?.key) ||
      results.find((v) => v?.site === 'YouTube' && v?.key) ||
      null;

    return trailer?.key ?? null;
  } catch {
    return null;
  }
}
