import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Use service role key to bypass RLS for public stats
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase credentials");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Calculate 24 hours ago timestamp
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
    const twentyFourHoursAgoISO = twentyFourHoursAgo.toISOString();

    // Fetch total user count from auth
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
    if (usersError) throw usersError;
    const totalUsers = users?.length || 0;

    // Fetch total counts (system-wide, all users)
    const [notebooksResult, pagesResult, notesResult] = await Promise.all([
      supabase
        .from("notebooks")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("pages")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("notes")
        .select("id", { count: "exact", head: true }),
    ]);

    // Fetch 24h counts (system-wide, all users)
    const [notebooks24hResult, pages24hResult, notes24hResult] =
      await Promise.all([
        supabase
          .from("notebooks")
          .select("id", { count: "exact", head: true })
          .gte("created_at", twentyFourHoursAgoISO),
        supabase
          .from("pages")
          .select("id", { count: "exact", head: true })
          .gte("created_at", twentyFourHoursAgoISO),
        supabase
          .from("notes")
          .select("id", { count: "exact", head: true })
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
      totalUsers,
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
