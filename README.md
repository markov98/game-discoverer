# GameDiscoverer

GameDiscoverer is a fast, focused game discovery app powered by the [RAWG Video Games Database API](https://rawg.io/apidocs). Browse a library of games, search by title, filter by genre or platform, and open a details page with ratings, release information, screenshots, and store links.

Deployed here: game-discoverer.vercel.app

## Features

- Search games by title
- Filter results by genre and platform
- Paginate through the game library
- View game ratings, release dates, genres, and descriptions
- Browse screenshots and links to official websites and stores
- Loading states for the home page and game detail pages
- Responsive layout for desktop and mobile screens

## Tech Stack

- [Next.js 16](https://nextjs.org/) with the App Router
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- RAWG API for game data

## Getting Started

### Prerequisites

- Node.js 20 or later
- A RAWG API key. Create one from the [RAWG developer page](https://rawg.io/apidocs).

### Installation

1. Clone the repository and move into the project directory.
2. Install dependencies:

	```bash
	npm install
	```

3. Create a `.env.local` file in the project root:

	```env
	RAWG_API_KEY=your_rawg_api_key
	```

4. Start the development server:

	```bash
	npm run dev
	```

5. Open [http://localhost:3000](http://localhost:3000).

The API key is read server-side and should not be committed to source control.

## Available Scripts

```bash
npm run dev    # Start the development server
npm run lint   # Run ESLint
npm run build  # Create a production build
npm run start  # Start the production server
```

## Routes

| Route | Description |
| --- | --- |
| `/` | Searchable and filterable game library |
| `/games/[id]` | Details for a specific game |

The home page accepts these query parameters:

- `search` for a title search
- `genre` for a RAWG genre slug
- `platform` for a RAWG platform ID
- `page` for pagination

Example: `/?search=elden%20ring&genre=role-playing-games-rpg&page=1`

## Project Structure

```text
app/
├── components/       # Reusable browser and header components
├── games/[id]/       # Game detail route and loading state
├── lib/              # RAWG API clients, types, and formatters
├── globals.css       # Global styles
├── layout.tsx        # Root layout and metadata
└── page.tsx          # Home page
```

## TODO

Potential future improvements:

- [ ] Add user accounts and authentication
- [ ] Let users save favorite games
- [ ] Add custom collections and wishlists
- [ ] Add sorting by rating, release date, popularity, and title
- [ ] Add filters for minimum rating and release year
- [ ] Add infinite scrolling as an alternative to pagination
- [ ] Add richer game metadata such as playtime, developers, and publishers
- [ ] Add related and similar game recommendations
- [ ] Add a comparison view for multiple games
- [ ] Add shareable filter and collection links
- [ ] Add automated tests for API helpers and filter behavior
- [ ] Add image optimization and caching for API media


