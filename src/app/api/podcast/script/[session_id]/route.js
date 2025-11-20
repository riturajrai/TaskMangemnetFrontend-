// File path: src/app/api/podcast/script/[session_id]/route.js


import axios from "axios";

export async function GET(req, context) {
  const params = context.params;
  const session_id = params?.session_id;

  console.log("Script API called with session_id:", session_id);

  if (!session_id) {
    return new Response(
      JSON.stringify({ error: "Missing session_id" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const backendUrl = `https://mentoroid-production.up.railway.app/podcast/script/${session_id}`;
  console.log("Fetching from backend:", backendUrl);

  try {
    const res = await axios.get(backendUrl, {
      headers: {
        "Accept": "text/plain, application/json, */*",
      },
    });

    console.log("Backend response status:", res.status);
    console.log("Backend response data:", res.data);

    return new Response(
      typeof res.data === "string" ? res.data : JSON.stringify(res.data),
      {
        status: 200,
        headers: {
          "Content-Type":
            typeof res.data === "string" ? "text/plain" : "application/json",
        },
      }
    );
  } catch (err) {
    console.error("Failed to fetch podcast script:", err);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch podcast script",
        details: err.response?.data || err.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
