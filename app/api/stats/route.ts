import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Calculate 24 hours ago timestamp
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
    const twentyFourHoursAgoISO = twentyFourHoursAgo.toISOString();

    // Fetch total counts
    const [notebooksResult, pagesResult, notesResult] = await Promise.all([
      supabase
        .from("notebooks")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id),
      supabase
        .from("pages")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id),
      supabase
        .from("notes")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id),
    ]);

    // Fetch 24h counts
    const [notebooks24hResult, pages24hResult, notes24hResult] =
      await Promise.all([
        supabase
          .from("notebooks")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id)
          .gte("created_at", twentyFourHoursAgoISO),
        supabase
          .from("pages")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id)
          .gte("created_at", twentyFourHoursAgoISO),
        supabase
          .from("notes")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id)
          .gte("created_at", twentyFourHoursAgoISO),
      ]);

    // Check for errors
    if (notebooksResult.error) throw notebooksResult.error;
    if (pagesResult.error) throw pagesResult.error;
    if (notesResult.error) throw notesResult.error;
    if (notebooks24hResult.error) throw notebooks24hResult.error;
    if (pages24hResult.error) throw pages24hResult.error;
    if (notes24hResult.error) throw notes24hResult.error;

    return NextResponse.json({
      totalNotebooks: notebooksResult.count || 0,
      totalPages: pagesResult.count || 0,
      totalNotes: notesResult.count || 0,
      notebooks24h: notebooks24hResult.count || 0,
      pages24h: pages24hResult.count || 0,
      notes24h: notes24hResult.count || 0,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
