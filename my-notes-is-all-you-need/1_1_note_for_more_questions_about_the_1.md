# what are the CSS、Tailwind、全局 CSS 与局部 CSS ?


# 一、什么是 CSS？

CSS（Cascading Style Sheets，层叠样式表）用于控制网页的外观和样式。

前端开发三大核心技术：

```text
HTML  → 负责内容（Content）
CSS   → 负责样式（Style）
JavaScript → 负责交互（Interaction）
```

例如：

HTML：

```html
<button>Login</button>
```

显示效果：

```text
[Login]
```

非常简单，没有任何美化。

---

加入 CSS：

```html
<button
  style="
    background: blue;
    color: white;
    padding: 10px;
  "
>
  Login
</button>
```

效果：

```text
蓝色按钮
白色文字
有间距
更美观
```

---

CSS 可以控制：

- 颜色（Color）
- 字体（Font）
- 边框（Border）
- 布局（Layout）
- 动画（Animation）
- 阴影（Shadow）
- 响应式设计（Responsive Design）

因此：

```text
CSS = 网页的化妆师
```

---

# 二、什么是 Tailwind？

Tailwind CSS 是一个非常流行的 CSS 框架。

传统 CSS 写法：

```css
.button {
  background: blue;
  color: white;
  padding: 10px;
}
```

HTML：

```html
<button class="button">
  Login
</button>
```

---

Tailwind 写法：

```html
<button
  class="
    bg-blue-500
    text-white
    p-3
  "
>
  Login
</button>
```

效果完全一样。

---

## Tailwind 的核心思想

传统方式：

```text
HTML
 ↓
写 class
 ↓
CSS 文件
 ↓
定义样式
```

---

Tailwind：

```text
HTML
 ↓
直接写样式类
```

例如：

```html
<div
  class="
    bg-white
    rounded-lg
    shadow-lg
  "
>
```

无需额外编写 CSS。

---

# 三、为什么大家喜欢 Tailwind？

优点：

### 1. 开发速度快

传统：

```css
.card {
  background: white;
  border-radius: 12px;
}
```

然后：

```html
<div class="card">
```

---

Tailwind：

```html
<div class="bg-white rounded-xl">
```

一步完成。

---

### 2. 不需要频繁切换文件

传统开发：

```text
HTML
 ↓
CSS
 ↓
HTML
 ↓
CSS
```

来回切换。

---

Tailwind：

```text
全部在组件里完成
```

---

### 3. 天然适合 React

React：

```tsx
function Button() {
  return (
    <button
      className="
        bg-blue-500
        text-white
        rounded
      "
    >
      Submit
    </button>
  );
}
```

组件和样式放在一起。

---

# 四、什么是 Tailwind CDN？

项目中：

```html
<script src="https://cdn.tailwindcss.com"></script>
```

意思：

```text
从 Tailwind 官方服务器下载 Tailwind CSS
```

浏览器启动：

```text
加载 Tailwind
```

然后：

```html
<div class="flex">
```

才能生效。

---

如果删除：

```html
<script src="https://cdn.tailwindcss.com"></script>
```

那么：

```html
<div class="flex">
```

就失效了。

---

# 五、什么是 Tailwind Config？

你的代码：

```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        polimi: {
          900: '#003399'
        }
      }
    }
  }
}
```

作用：

```text
扩展 Tailwind 默认主题
```

---

例如：

新增：

```html
bg-polimi-900
```

对应：

```css
#003399
```

即：

```text
Politecnico di Milano 官方蓝色
```

以后可以直接使用：

```html
<div class="bg-polimi-900">
```

---

# 六、什么是 Style？

HTML 中：

```html
<style>

...

</style>
```

表示：

```text
直接在 HTML 中编写 CSS
```

例如：

```html
<style>
body {
  background: red;
}
</style>
```

等价于：

```css
body {
  background: red;
}
```

---

# 七、什么是全局 CSS（Global CSS）？

全局 CSS：

```text
影响整个网站
```

例如：

```css
body {
  font-family: Inter;
}
```

因为：

```html
<body>
```

只有一个。

所以：

```text
所有页面
所有组件
所有文字
```

都会受到影响。

---

例如：

```css
h1 {
  color: blue;
}
```

React：

```tsx
function Home() {
  return <h1>Home</h1>;
}

function About() {
  return <h1>About</h1>;
}
```

结果：

```text
Home  → 蓝色
About → 蓝色
```

因为：

```css
h1 {
  color: blue;
}
```

作用于：

```text
所有 h1 标签
```

---

# 八、什么是局部 CSS（Local CSS）？

局部 CSS：

```text
只影响指定元素
```

例如：

```css
.login-btn {
  background: blue;
}
```

只会影响：

```html
<button class="login-btn">
```

---

不会影响：

```html
<button class="register-btn">
```

---

React：

```tsx
<button className="login-btn">
  Login
</button>
```

变蓝。

---

```tsx
<button className="register-btn">
  Register
</button>
```

不变。

---

# 九、如何判断全局 CSS 和局部 CSS？

核心区别：

```text
看 CSS 选择器（Selector）
```

---

## 全局 CSS

范围非常大：

```css
html {}
body {}
h1 {}
h2 {}
p {}
button {}
input {}
* {}
```

例如：

```css
body {
  background: #f8fafc;
}
```

影响：

```text
整个网站
```

---

## 局部 CSS

范围较小：

```css
.navbar {}
.login-btn {}
.chat-box {}
.timeline-scroll {}
```

例如：

```css
.chat-box {
  background: white;
}
```

只影响：

```html
<div class="chat-box">
```

---

# 十、项目中的全局 CSS

代码：

```css
html {
  font-size: 14px;
  overflow-y: scroll;
}

body {
  font-family: 'Inter';
  background-color: #f8fafc;
}
```

属于：

```text
Global CSS（全局 CSS）
```

原因：

```text
影响整个网站
```

---

## font-size

```css
font-size: 14px;
```

默认：

```text
16px
```

修改后：

```text
14px
```

效果：

```text
整个网站缩小一点
```

包括：

- 字体
- 按钮
- 表单
- 间距

---

## overflow-y

```css
overflow-y: scroll;
```

作用：

```text
始终预留滚动条位置
```

避免：

```text
页面忽宽忽窄
布局抖动
```

---

## body

```css
body {
  font-family: Inter;
  background-color: #f8fafc;
}
```

作用：

```text
整个网站统一字体
整个网站统一背景色
```

---

# 十一、你的项目中的局部 CSS

代码：

```css
.timeline-scroll::-webkit-scrollbar {
  width: 6px;
}
```

作用：

```text
只影响 timeline-scroll 组件
```

例如：

```html
<div class="timeline-scroll">
```

---

不会影响：

```html
<div class="chat-box">
```

---

也不会影响：

```html
<div class="navbar">
```

---

因此：

```text
属于局部 CSS
```

---

# 十二、React 项目中的真正局部 CSS

现代 React 经常使用：

```text
Button.module.css
```

例如：

```css
.button {
  background: blue;
}
```

---

React：

```tsx
import styles from "./Button.module.css";

<button className={styles.button}>
```

编译后：

```html
<button class="button_x7ab29">
```

实际生成：

```css
.button_x7ab29 {
  background: blue;
}
```

---

这样：

```text
其它组件完全不会受到影响
```

这就是：

```text
CSS Modules
```

真正意义上的局部 CSS。

---

# 十三、为什么 Tailwind 几乎不会出现 CSS 冲突？

React + Tailwind：

```tsx
<button
  className="
    bg-blue-500
    text-white
    rounded-lg
  "
>
  Submit
</button>
```

样式直接写在组件内部。

---

Navbar：

```tsx
<div className="bg-blue-500">
```

---

ChatBox：

```tsx
<div className="bg-green-500">
```

---

互不影响。

因此：

```text
Tailwind 天然接近局部 CSS
```

这也是现代 React 项目大量使用 Tailwind 的原因之一。

---

# 十四、总结

## CSS 的作用

```text
控制网页样式
```

包括：

- 颜色
- 字体
- 动画
- 布局
- 响应式设计

---

## Tailwind 的作用

```text
一个现代 CSS 框架
```

特点：

```text
通过 class 直接写样式
```

例如：

```html
bg-blue-500
text-white
rounded-lg
```

---

## Style 标签

```html
<style>
...
</style>
```

表示：

```text
直接在 HTML 中编写 CSS
```

---

## 全局 CSS

特点：

```text
影响整个网站
```

典型选择器：

```css
html
body
h1
button
*
```

---

## 局部 CSS

特点：

```text
只影响指定组件
```

典型选择器：

```css
.navbar
.chat-box
.timeline-scroll
.login-btn
```

---

## 你的项目技术栈

```text
React
 + TypeScript
 + Vite
 + Tailwind CSS
```

其中：

```text
React      → 构建页面
TypeScript → 类型检查
Vite       → 构建与运行
Tailwind   → 页面样式
```