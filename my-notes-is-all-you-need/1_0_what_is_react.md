# React 完整学习笔记

## 一、什么是 React？

React 是一个用于构建用户界面（UI, User Interface）的 JavaScript 库（Library），由 Meta（原 Facebook）开发和维护。

简单理解：

```text
React = 使用组件(Component)的方式开发网页界面
```

React 本身只负责：

```text
View（界面层）
```

它并不负责：

```text
数据库
后端逻辑
服务器
```

因此 React 被称为：

```text
前端 UI Library
```

---

# 二、为什么会有 React？

传统网页开发：

```html
<div id="app"></div>

<script>
document.getElementById("app").innerHTML =
"<h1>Hello World</h1>";
</script>
```

如果页面越来越复杂：

```text
导航栏
用户中心
商品列表
聊天窗口
图表面板
```

代码会变成：

```javascript
document.getElementById(...)
document.createElement(...)
appendChild(...)
removeChild(...)
```

问题：

```text
代码难维护
代码难复用
开发效率低
```

因此 React 出现了。

---

# 三、React 的核心思想

React 的核心思想：

```text
Everything is a Component
（万物皆组件）
```

把网页拆分成许多独立模块。

例如：

```text
Website
│
├── Header
├── Sidebar
├── MainContent
└── Footer
```

每个部分都是一个独立组件。

---

## Header 组件

```jsx
function Header() {
  return <h1>My Website</h1>;
}
```

---

组合成完整页面：

```jsx
function App() {
  return (
    <>
      <Header />
      <MainContent />
      <Footer />
    </>
  );
}
```

效果：

```text
搭积木开发网页
```

---

# 四、React 最重要的三个概念

## 1. Component（组件）

组件是 React 的核心。

可以理解为：

```text
可复用的 UI 模块
```

例如：

```jsx
function Button() {
  return <button>Click Me</button>;
}
```

使用：

```jsx
<Button />
<Button />
<Button />
```

显示：

```text
[Click Me]

[Click Me]

[Click Me]
```

特点：

```text
写一次
使用无数次
```

---

## 2. Props（属性）

Props 用于：

```text
父组件向子组件传递数据
```

例如：

```jsx
function User(props) {
  return <h1>{props.name}</h1>;
}
```

使用：

```jsx
<User name="Tom" />
<User name="Jack" />
```

显示：

```text
Tom

Jack
```

---

类似 Python：

```python
def user(name):
    print(name)
```

---

Props 特点：

```text
只读
从父传子
不能修改
```

---

## 3. State（状态）

State 表示：

```text
页面中会变化的数据
```

例如计数器：

```jsx
const [count, setCount] = useState(0);
```

点击按钮：

```jsx
setCount(count + 1);
```

界面自动更新：

```text
0
1
2
3
...
```

---

State 特点：

```text
数据变化
↓
React 自动更新页面
```

无需手动操作 DOM。

---

# 五、什么是 JSX？

React 使用 JSX 编写界面。

例如：

```jsx
<h1>Hello React</h1>
```

看起来像：

```html
HTML
```

实际上：

```javascript
React.createElement(...)
```

---

因此：

```text
JSX = JavaScript + HTML
```

---

例如：

```jsx
const name = "Tom";

return <h1>Hello {name}</h1>;
```

显示：

```text
Hello Tom
```

---

# 六、React 的优势

## 1. 组件化开发

传统项目：

```text
一个巨大的 HTML 文件
```

React：

```text
Navbar.jsx
Sidebar.jsx
ChatBox.jsx
Footer.jsx
```

结构更清晰。

---

## 2. 数据驱动界面

传统开发：

```text
修改页面
↓
修改 DOM
```

React：

```text
修改数据
↓
React 自动更新界面
```

例如：

```jsx
setCount(count + 1);
```

React 自动刷新页面。

---

## 3. 代码复用

例如：

```jsx
<ProductCard />
```

可以复用：

```jsx
<ProductCard />
<ProductCard />
<ProductCard />
<ProductCard />
```

无需重复开发。

---

## 4. 易于维护

组件之间独立：

```text
Navbar
Footer
ChatBox
Timeline
```

修改一个组件：

```text
不会影响其它组件
```

---

# 七、React 项目结构

典型 React 项目：

```text
src
│
├── components
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   └── ChatBox.jsx
│
├── pages
│   ├── Home.jsx
│   ├── Login.jsx
│   └── Dashboard.jsx
│
├── App.jsx
│
└── main.jsx
```

---

## components

公共组件：

```text
Navbar
Footer
Button
Modal
ChatBox
```

---

## pages

页面：

```text
Home
Login
Dashboard
Profile
```

---

## App.jsx

根组件：

```text
负责组织整个页面结构
```

---

## main.jsx

项目入口：

```text
负责启动 React
```

---

# 八、React 应用运行流程

```text
index.html
    ↓
main.tsx
    ↓
App.tsx
    ↓
Pages
    ↓
Components
    ↓
最终网页
```

---

例如：

```text
index.html
    ↓
main.tsx
    ↓
App.tsx
    ↓
Home.tsx
    ↓
Navbar.tsx
ChatBox.tsx
Footer.tsx
```

---

# 九、React 与 TypeScript

普通 React：

```text
React + JavaScript
```

文件：

```text
App.jsx
Home.jsx
Navbar.jsx
```

---

现代企业项目：

```text
React + TypeScript
```

文件：

```text
App.tsx
Home.tsx
Navbar.tsx
```

---

区别：

```text
.jsx = JavaScript + JSX

.tsx = TypeScript + JSX
```

TypeScript 可以提供：

```text
类型检查
自动补全
减少 Bug
提升可维护性
```

因此：

```text
React + TypeScript
```

已经成为主流。

---

# 十、React 在我们 AIoT 项目中的位置
项目结构：

```text
AIoT_Website
│
├── frontend
│
│   ├── src
│   ├── App.tsx
│   ├── index.tsx
│
└── backend
```

其中：

```text
frontend
```

负责：

```text
React
TypeScript
Tailwind CSS
```

---

```text
backend
```

负责：

```text
API
数据库
业务逻辑
```

---

整体架构：

```text
Browser
   ↑
React UI
   ↑
Axios
   ↑
Backend API
   ↑
Database
```

---

# 十一、React、TypeScript、Vite 的关系

现代前端项目：

```text
React
 + TypeScript
 + Vite
```

职责：

```text
React
↓
构建页面

TypeScript
↓
类型检查

Vite
↓
启动项目
编译 TSX
热更新
打包发布
```

---

运行流程：

```text
Browser
    ↑
Vite
    ↑
React + TypeScript
    ↑
Components
    ↑
Pages
```

---

# 十二、React 核心知识总结

React 最重要的四个概念：

```text
Component（组件）
Props（属性）
State（状态）
JSX（语法）
```

---

开发流程：

```text
Component
    ↓
组成页面

Props
    ↓
传递数据

State
    ↓
管理数据变化

JSX
    ↓
描述界面
```

---

# 十三、一句话总结

```text
React 是一个用于构建用户界面的 JavaScript 库，
通过 Component（组件）、Props（属性）、
State（状态）和 JSX（语法）
实现现代化、组件化、数据驱动的前端开发。
```

---

# React 技术栈地图

```text
React
│
├── JSX
├── Component
├── Props
├── State
├── Hooks
├── React Router
├── Axios
├── Tailwind CSS
├── TypeScript
└── Vite
```

掌握以上内容后，就能够阅读和开发绝大多数现代 React 项目。