
import axios from "axios";

export async function POST(req) {
  try {
    const body = await req.json();

    // Forward request to your backend
    const res = await axios.post(
      "https://mentoroid-production.up.railway.app/generate",
      body
    );

    return new Response(JSON.stringify(res.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Podcast generate error:", err.message);
    return new Response(
      JSON.stringify({ error: "Failed to start podcast generation" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
