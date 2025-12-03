/* 展示用的 代码 - 模拟与后端 API 的交互 *
  just for showing

import { LlmResponse } from '../types';

// In a real scenario, this URL would point to your Flask/FastAPI server
// const API_URL = "http://localhost:8000/api/ask";

const MOCK_RESPONSE_1: LlmResponse = {
  processing_time: 1.82,
  parsed_data: {
    dates: ["2025-09-11"],
    hour_window: [0, 6], // Midnight to 6 AM
    cleaned_query: "stuffy air issues"
  },
  evidence: [
    {
      id: "chunk_2025-09-11_00",
      date: "2025-09-11",
      hour: 0,
      source: "chunk_2025-09-11_00.txt",
      snippet: "Sensor reading at 00:15 shows stable conditions. CO2: 420ppm. PM2.5: 12ug/m3. No occupancy detected.",
      metrics: { co2: 420, pm25: 12 },
      isAnomaly: false
    },
    {
      id: "chunk_2025-09-11_02",
      date: "2025-09-11",
      hour: 2,
      source: "chunk_2025-09-11_02.txt",
      snippet: "Alert: Sudden rise in CO2 detected at 02:30. Reading: 950ppm. Ventilation system appears to be in 'Eco' mode (inactive). Humidity increased to 65%.",
      metrics: { co2: 950, ieq: 75 },
      isAnomaly: true
    },
    {
      id: "chunk_2025-09-11_04",
      date: "2025-09-11",
      hour: 4,
      source: "chunk_2025-09-11_04.txt",
      snippet: "CO2 levels normalizing. Current: 550ppm. Air exchange rate increased automatically.",
      metrics: { co2: 550 },
      isAnomaly: false
    }
  ],
  llm_answer: `### Findings & Observations
Based on the sensor data for **2025-09-11** between **midnight and 06:00**, the environment was generally stable except for a specific event around 02:00 AM.

### Alarms & Anomalies
*   **02:00 - 03:00 AM**: A significant spike in CO₂ was detected, reaching **950ppm**.
*   **Humidity**: Concurrently rose to 65%, suggesting "stuffy" air conditions.

### Diagnostics
The likely cause is the building's ventilation system switching to **'Eco' mode** during low-occupancy hours, failing to cycle air effectively despite minor fluctuations in internal conditions.

### Recommendations
1.  Review the "Eco" mode threshold settings for the HVAC system.
2.  Enable a minimum air exchange rate even during 00:00-06:00 if baseline humidity exceeds 60%.`
};

export const fetchAnalysis = async (query: string): Promise<LlmResponse> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));



  // In a real app, you would do:
  /*
  const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
  });
  return response.json();
  */
/*
  // Return mock data for the demo
  return MOCK_RESPONSE_1;
};
 */

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
