const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface HoleheSiteResult {
  name: string;
  domain: string;
  exists: boolean;
  emailrecovery: string | null;
  phoneNumber: string | null;
  others: Record<string, unknown> | null;
  rateLimit: boolean;
}

export interface CheckEmailResponse {
  email: string;
  total_sites: number;
  registered_sites: number;
  results: HoleheSiteResult[];
}

export async function checkEmail(email: string, timeout = 10): Promise<CheckEmailResponse> {
  const res = await fetch(`${API_BASE}/api/check-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, timeout }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API error ${res.status}: ${err}`);
  }

  return res.json();
}