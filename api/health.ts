import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({
      status: "error",
      message: "Method not allowed",
    });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({
      status: "error",
      message: "Health check configuration is missing",
    });
  }

  try {
    const response = await fetch(
      `${supabaseUrl.replace(/\/$/, "")}/rest/v1/uptime_checks?select=id&limit=1`,
      {
        method: "GET",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        signal: AbortSignal.timeout(10000),
      },
    );

    if (!response.ok) {
      const details = await response.text();

      console.error("Supabase health check failed:", {
        status: response.status,
        details,
      });

      return res.status(503).json({
        status: "error",
        message: "Supabase database check failed",
        supabaseStatus: response.status,
      });
    }

    const result: unknown = await response.json();

    if (!Array.isArray(result) || result.length === 0 || result[0]?.id !== 1) {
      return res.status(503).json({
        status: "error",
        message: "Unexpected database response",
      });
    }

    return res.status(200).json({
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Supabase connection error:", error);

    return res.status(503).json({
      status: "error",
      message: "Unable to reach Supabase",
    });
  }
}
