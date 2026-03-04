export function buildDetailUrls(movieNum) {
  return {
    detailUrl: `https://api.themoviedb.org/3/movie/${movieNum}?language=ko-KR`,
    creditsUrl: `https://api.themoviedb.org/3/movie/${movieNum}/credits?language=ko-KR`,
    stillsUrl: `https://api.themoviedb.org/3/movie/${movieNum}/images?include_image_language=null`,
    videosUrl: `https://api.themoviedb.org/3/movie/${movieNum}/videos?language=ko-KR&include_video_language=ko,en,null`,
    similarUrl: `https://api.themoviedb.org/3/movie/${movieNum}/similar?language=ko-KR&page=1`,
  };
}

async function fetchJson(url, options) {
  try {
    const res = await fetch(url, options);
    let data = null;

    try {
      if (res.ok) data = await res.json();
    } catch {
      data = null;
    }

    return { ok: res.ok, status: res.status, data, res };
  } catch (err) {
    return { ok: false, status: 0, data: null, err, res: null };
  }
}

export async function fetchDetail(url, options) {
  const { ok, status, data, err } = await fetchJson(url, options);
  return ok ? { ok: true, status, data } : { ok: false, status, data: null, err };
}

export async function fetchStills(url, options) {
  const { ok, status, data, err } = await fetchJson(url, options);
  return ok ? { ok: true, status, data } : { ok: false, status, data: null, err };
}

export async function fetchCredits(url, options) {
  const { ok, data } = await fetchJson(url, options);
  if (!ok || !data) return { cast: [] };
  return data;
}

export async function fetchTrailerKey(url, options) {
  const { ok, data } = await fetchJson(url, options);
  if (!ok || !data) return null;

  const results = Array.isArray(data?.results) ? data.results : [];

  const trailer =
    results.find((v) => v?.site === 'YouTube' && v?.type === 'Trailer' && v?.key) ||
    results.find((v) => v?.site === 'YouTube' && v?.type === 'Teaser' && v?.key) ||
    results.find((v) => v?.site === 'YouTube' && v?.key) ||
    null;

  return trailer?.key ?? null;
}
