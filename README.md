# GameDiscoverer

GameDiscoverer is a fast, focused game discovery app powered by the [RAWG Video Games Database API](https://rawg.io/apidocs). Browse a library of games, search by title, filter by genre, platform, and tag, and open detailed game pages with ratings, screenshots, store links, and recommendations.

The project is deployed here: [game-discoverer.vercel.app](game-discoverer.vercel.app)

## Features

- Search games by title from the home page and advanced search page
- Browse and search developers, ordered by game count
- Filter results by genre, platform, and tags
- Browse a featured game highlight, library cards, and pagination
- Scroll through a developer's games, loaded a page at a time
- View game ratings, release dates, genres, descriptions, and metadata
- Explore screenshots and official store links on each game detail page
- Discover more games from the same developer on the detail view
- Create an account and log in with Firebase Authentication
- Responsive layout for desktop and mobile screens

## Tech Stack

- [Next.js 16](https://nextjs.org/) with the App Router
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- RAWG API for game data

## Getting Started

### Prerequisites

- Node.js 20 or later
- A RAWG API key. Create one from the [RAWG developer page](https://rawg.io/apidocs).
- A Firebase project with Email/Password authentication enabled.

### Installation

1. Clone the repository and move into the project directory.
2. Install dependencies:

	```bash
	npm install
	```

3. Create a `.env.local` file in the project root:

	```env
	RAWG_API_KEY=your_rawg_api_key
	NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
	NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
	NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
	NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
	NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
	NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
	```

4. Start the development server:

	```bash
	npm run dev
	```

5. Open [http://localhost:3000](http://localhost:3000).

The RAWG API key is read server-side and should not be committed to source control. Firebase's web app configuration is public client configuration; configure it in the deployment environment as well. Developer-game pagination requests additional pages through `/api/developers/[id]/games`; the RAWG key is only used by the server-side handler.

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
| `/search` | Advanced search form with multi-select genre and tag filters |
| `/games/[id]` | Details for a specific game |
| `/developers` | Searchable, paginated developer directory |
| `/developers/[id]` | Developer details and an infinitely scrolling game list |
| `/api/developers/[id]/games?page=<page>` | Server-side pagination endpoint for a developer's games |
| `/login` | Log in with a Firebase Authentication account |
| `/register` | Create a Firebase Authentication account |

The home page accepts these query parameters:

- `search` for a title search
- `genre` for a RAWG genre slug (supports multiple values)
- `platform` for a RAWG platform ID
- `tag` for a RAWG tag slug (supports multiple values)
- `page` for pagination

Example: `/?search=elden%20ring&genre=role-playing-games-rpg&tag=singleplayer&page=1`

The developer directory accepts `search` for a developer name and `page` for pagination. For example: `/developers?search=valve&page=2`.

## Project Structure

```text
app/
├── components/       # Reusable browser and header components
├── api/              # Server-side API routes
├── developers/       # Developer directory and developer details
├── games/[id]/       # Game detail route, screenshots, and related games
├── search/           # Advanced search UI with multi-select filters
├── lib/              # RAWG API clients, types, and formatters
├── globals.css       # Global styles
├── layout.tsx        # Root layout and metadata
├── loading.tsx       # Shared loading state
├── page.tsx          # Home page
└── search/page.tsx   # Advanced search page
```