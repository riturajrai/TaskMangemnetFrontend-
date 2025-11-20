import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    // Optional: Basic validation
    if (!body?.topic || body.topic.length < 20) {
      return NextResponse.json(
        { error: "Topic is required and must be at least 20 characters long." },
        { status: 400 }
      );
    }

    const apiResponse = await axios.post(
      "https://mentoroid-production.up.railway.app/question_gen",
      body,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(apiResponse.data, { status: 200 });

  } catch (err) {
    console.error(
      "Question generation error:",
      err.response?.data || err.message
    );

    return NextResponse.json(
      {
        error: "Failed to generate questions",
        details: err.response?.data || err.message,
      },
      { status: err.response?.status || 500 }
    );
  }
}
