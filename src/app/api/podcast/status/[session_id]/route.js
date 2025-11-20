
import axios from "axios";

export async function GET(req, context) {
  // Unwrap params properly
  const params = await context.params; // <--- await if params is a promise
  const session_id = params?.session_id;

  if (!session_id) {
    return new Response(
      JSON.stringify({ error: "Missing session_id" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const res = await axios.get(
      `https://mentoroid-production.up.railway.app/status/${session_id}`
    );

    return new Response(JSON.stringify(res.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Failed to fetch podcast status:", err);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch podcast status",
        details: err.response?.data || err.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
