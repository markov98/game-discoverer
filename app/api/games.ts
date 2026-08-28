const RAWG_API_KEY = process.env.RAWG_API_KEY;
const RAWG_API_URL = 'https://api.rawg.io/api';

function fetchGames(query: string, page: number = 1, pageSize: number = 10) {
  const url = `${RAWG_API_URL}/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}`;
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error fetching games: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => data.results);
}

export { fetchGames };