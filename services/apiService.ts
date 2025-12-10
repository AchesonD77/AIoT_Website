// src/services/apiService.ts

// ------------------------------------------------------------------
// 原有代码部分 (保持不变)
// ------------------------------------------------------------------

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

// ------------------------------------------------------------------
// 新增代码部分：获取索引状态 (Step 2 要求)
// ------------------------------------------------------------------

// 1. 定义接口类型，对应后端 main.py 返回的 JSON 结构
export interface IndexInfo {
  total_indexes: number;
  first_date: string;
  last_date: string;
}

// 2. 新增请求函数
export async function fetchIndexInfo(): Promise<IndexInfo> {
  // 复用 Base URL 逻辑 (为了不改动上面的函数，这里重新写一遍变量定义)
  const baseUrl =
    import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

  try {
    const resp = await fetch(`${baseUrl}/api/index-info`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!resp.ok) {
      // 如果后端没有在这个端点准备好，或者网络错误，不抛出异常以免炸坏UI
      console.warn(`Warning: Could not fetch index info (Status: ${resp.status})`);
      return { total_indexes: 0, first_date: 'N/A', last_date: 'N/A' };
    }

    const data: IndexInfo = await resp.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch index info:", error);
    // 返回默认空数据，保证前端页面不会报错
    return { total_indexes: 0, first_date: 'N/A', last_date: 'N/A' };
  }
}