import { fetchDeveloperGames } from "@/app/lib/games";

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
  } catch {
    return Response.json({ error: "Could not load more games." }, { status: 500 });
  }
}
