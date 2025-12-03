// src/services/ragApi.ts

// 根据环境切换：本地开发用本机 FastAPI，线上用 Render
const API_BASE_URL =
  import.meta.env.PROD
    ? "https://<你的 Render 域名>"  // 还没部署可以先留空字符串，等会再改
    : "http://127.0.0.1:8000";

export type QueryResponse = {
  query: string;
  answer: string;
};

export async function askRag(query: string): Promise<QueryResponse> {
  const res = await fetch(`${API_BASE_URL}/api/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Backend error ${res.status}: ${text}`);
  }

  return (await res.json()) as QueryResponse;
}
