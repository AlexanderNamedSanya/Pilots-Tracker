const API_BASE = process.env.NEXT_PUBLIC_GSHEET_API;

export async function getAllPilots() {
  const res = await fetch(`${API_BASE}/getAllPilots`);
  return res.json();
}

export async function getPilot(nick) {
  const res = await fetch(`${API_BASE}/getPilot?nick=${encodeURIComponent(nick)}`);
  return res.json();
}

export async function upsertPilot(data) {
  const res = await fetch(`${API_BASE}/upsertPilot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getRoles() {
  const res = await fetch(`${API_BASE}/getRoles`);
  return res.json();
}
