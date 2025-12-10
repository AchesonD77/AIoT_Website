in developing, comming soon.

UI 和对传入进来的json语言进行解析和显示
1. LLMAnswer - 对应 回答界面右边的大部分（intelligence summary）
2. ParsedTimeBadge - 对应搜索框下面的 key insights 快速回答部分
3. EvidenceTimeline - 对应左边的houly chunks timeline
4. QueryInput - 对应最开始的搜索框组件
5. APP.tsx - 对应页面布局大框架
6. ResponseInspectorModal - 调试/查看器（Inspector）。它把后端返回的原始数据（JSON）以代码树的形式展示出来（类似程序员看的 Log）。
7. Header.tsx - 对应最上面的页眉部分



# main.py  —— IoT Time-Aware Analytics 后端入口
AIoT_Web_Backend/generate_01_chunks_english_v4.py -  ✅ 在 AIoT_Web_Backend 里，把 CSV 放在 data/material/ -> ✅ 运行代码 generate_chunks_v4.py，生成text_chunks, 让它默认写到 data/text_chunks/

AIoT_Web_Backend/generate_02_dailyfaiss.py - data/text_chunks → 输入、data/faiss_daily → 输出: 成功生成了一堆 faiss_index_YYYY-MM-DD 文件夹, 
终端里会看到：
“Loaded XXX hourly chunks into memory”
时间范围统计
“Loaded X chunks grouped into Y days”
每天构建 FAISS 的进度和最终 Summary

