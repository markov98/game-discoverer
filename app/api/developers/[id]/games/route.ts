import { fetchDeveloperGames } from "@/app/lib/games";
import { isRawgUnavailable } from "@/app/lib/rawg-client";

const unavailableMessage = "RAWG is temporarily unavailable, so we couldn't load more games by this developer. Please try again later.";
const errorMessage = "Something went wrong while loading more games by this developer. Please try again.";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: idParam } = await params;
  const developerId = Number(idParam);
  const page = Number(new URL(request.url).searchParams.get("page"));

  if (!Number.isInteger(developerId) || developerId <= 0 || !Number.isInteger(page) || page <= 0) {
    return Response.json({ error: "Invalid developer or page." }, { status: 400 });
  }

  try {
    const data = await fetchDeveloperGames(developerId, page);
    return Response.json({ games: data.results, hasMore: Boolean(data.next) });
  } catch (error) {
    return Response.json(
      { error: isRawgUnavailable(error) ? unavailableMessage : errorMessage },
      { status: 500 },
    );
  }
}
