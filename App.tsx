// App.tsx

function App() {
  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      <h1 style={{ fontSize: '32px', fontWeight: 700 }}>
        ✅ AIOT_Web 已经成功部署到 GitHub Pages
      </h1>
      <p style={{ fontSize: '18px' }}>
        如果你能看到这一行文字，说明「Vite 构建 → GitHub Actions → GitHub Pages」整条流水线是没问题的，
        之前白屏只是 React 没有渲染任何内容。
      </p>
    </div>
  );
}

export default App;
