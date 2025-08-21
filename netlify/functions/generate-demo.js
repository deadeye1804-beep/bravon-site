// netlify/functions/generate-demo.js
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Use POST" }),
    };
  }

  try {
    const { description, language } = JSON.parse(event.body || "{}");

    // OPTIONAL: Persist lead to Airtable (set env vars in Netlify site settings)
    const baseId = process.env.AIRTABLE_BASE_ID;
    const table = process.env.AIRTABLE_TABLE;
    const apiKey = process.env.AIRTABLE_API_KEY;

    if (baseId && table && apiKey) {
      await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            Description: description || "",
            Language: language || "EN",
            Source: "Bravon Light Demo",
            Timestamp: new Date().toISOString(),
          },
        }),
      });
    }

    // Generate a simple slug and return a demo URL (replace with your real demo hosting later)
    const slug = Math.random().toString(36).slice(2, 8);
    const demoUrl = `https://demo.bravon.it.com/${slug}`;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: demoUrl }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: err.message }),
    };
  }
};