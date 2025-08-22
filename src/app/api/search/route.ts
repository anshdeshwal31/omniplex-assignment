import { NextRequest, NextResponse } from "next/server";

const SERPAPI_KEY = process.env.SERPAPI_API_KEY;
const SEARCH_URL = "https://serpapi.com/search.json";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q || typeof q !== "string") {
    return new NextResponse(
      JSON.stringify({
        message: 'Query parameter "q" is required and must be a string.',
      }),
      { status: 400 }
    );
  }

  if (!SERPAPI_KEY) {
    console.error(
      "SerpAPI key is undefined. Please check your .env.local file."
    );
    return new NextResponse(
      JSON.stringify({ message: "SerpAPI key is not configured." }),
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `${SEARCH_URL}?q=${encodeURIComponent(q)}&engine=google&api_key=${SERPAPI_KEY}`,
      {
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json",
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API request failed with status ${response.status}`);
      console.error(`Error response: ${errorText}`);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    // Transform SerpAPI response to match expected format
    const transformedData = {
      webPages: {
        value: data.organic_results?.map((result: any) => ({
          name: result.title,
          url: result.link,
          snippet: result.snippet,
          displayUrl: result.displayed_link || result.link,
        })) || []
      }
    };

    return NextResponse.json({ message: "Success", data: transformedData });
  } catch (error) {
    console.error("Search API request error:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
