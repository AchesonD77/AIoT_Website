// src/services/apiService.ts

// 注意：这里返回类型用 any，先保证跑通，之后你可以再根据 ./types 里的定义改成严格类型
export async function fetchAnalysis(query: string): Promise<any> {
  // 本地开发用 127.0.0.1:8000
  // 部署到 Render 后，把 VITE_API_BASE_URL 换成你的 Render 域名
  const baseUrl =
    import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

  const resp = await fetch(`${baseUrl}/api/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!resp.ok) {
    throw new Error(`Backend error: ${resp.status} ${resp.statusText}`);
  }

  const data = await resp.json();
  // 目前 FastAPI 返回的是 { query, answer }，我们在这里包一层，
  // 适配前端现有的字段：parsed_data / evidence / llm_answer / processing_time
  const result = {
    parsed_data: {
      original_query: data.query,
    },
    evidence: [],               // 先给空数组，后面你可以改成真正的证据列表
    llm_answer: data.answer,    // 核心：后端生成的长文本答案
    processing_time: 0,         // 暂时写 0，将来可以从后端传真实时间
    raw_backend: data,          // 方便 DebugPanel 里查看原始返回
  };

  return result;
}
