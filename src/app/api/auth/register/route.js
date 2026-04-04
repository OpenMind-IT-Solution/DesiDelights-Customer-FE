export async function POST(req) {
  try {
    const body = await req.json();

    const res = await fetch("http://127.0.0.1:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: res.status,
    });

  } catch (err) {
    return new Response(
      JSON.stringify({ message: "Server error" }),
      { status: 500 }
    );
  }
}