import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const data = await response.text();
    return new NextResponse(data, {
      headers: { "Content-Type": response.headers.get("Content-Type") || "text/plain" },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch spec" },
      { status: 500 }
    );
  }
}
