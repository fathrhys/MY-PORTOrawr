import { clearAdminCookie } from "@/lib/adminAuth";
import { requireCsrf } from "@/lib/csrf";

export async function POST(req: Request) {
  if (!(await requireCsrf(req))) {
    return new Response(JSON.stringify({ error: "CSRF invalid" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  await clearAdminCookie();
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
