# Lite SaaS Admin

[![License: MIT](https://img.shields.io/badge/License-MIT-black.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38bdf8)](https://tailwindcss.com/)

[English](./README.md)

**在线演示 →** [litesaas-admin demo](https://litesaas.litestartup.com)

> **演示中看到的就是你将得到的。** 克隆本仓库，添加一个 API Key，演示中的所有功能即可开箱即用。

一个现代化、生产就绪的 SaaS 后台管理面板，基于 Next.js 14、TypeScript、Tailwind CSS 和 Shadcn UI 构建。内置完整功能集 — 数据看板、用户管理、账单、AI 聊天、通知、国际化、认证和暗黑模式 — 让你专注于产品本身，而非重复造轮子。

## 功能特性

- **数据看板** — 收入统计、访客图表（7天/30天/3个月）、近期活动、实时刷新
- **用户管理** — 搜索、分页、排序、用户详情抽屉、封禁/解封（支持原因和过期时间）
- **账单与积分** — 订阅计划、订单历史、月付/年付切换、Stripe 支付
- **AI 聊天** — 多模型接口（GPT-4o、GPT-4、Claude 3、Gemini Pro）、对话历史
- **通知中心** — 类型/状态筛选、标记已读、分页、顶栏下拉预览
- **个人资料** — 邮箱管理、认证方式管理、第三方登录绑定/解绑
- **国际化** — 英文 & 中文（简体中文），基于 Zustand 的持久化语言偏好
- **认证系统** — 基于 LiteStartup 后端的 JWT 认证、自动刷新、路由保护（AuthGuard）
- **响应式设计** — 移动端友好，可折叠侧边栏
- **暗黑模式** — 系统偏好检测、手动切换、通过 next-themes 持久化主题

## 使用 AI 编程助手构建

使用 **litestartup-admin** [Agent Skill](https://github.com/litestartup-com/litestartup-skills)，让 AI 编程助手在几分钟内搭建和扩展你的 SaaS 应用 — 无需手动编写 API 对接代码。

### 安装 Skill

```bash
npx skills add litestartup-com/litestartup-skills --skill litestartup-admin
```

安装后会在你的工作区添加 Skill 上下文文件，任何兼容的编程助手都会自动读取并遵循。

### 支持的编程助手

| 助手 | 工作方式 |
|------|---------|
| **OpenAI Codex** | 读取 `AGENTS.md` |
| **Claude Code** | 读取 `CLAUDE.md` |
| **Cursor** | 读取 `.cursor/rules/litestartup.mdc` |
| **Windsurf (Cascade)** | 读取 `.windsurfrules` |

### AI 助手能做什么？

用自然语言描述你的需求：

- **"init saas"** → 克隆脚手架、安装依赖、配置 API Key、启动开发服务器
- **"add welcome email"** → 通过 LS Email API 接入欢迎邮件
- **"add file upload"** → 集成 LS Storage（S3 存储）
- **"add AI chat"** → 对接 LS LLM Router（GPT-4o、Claude、Gemini）
- **"add contact management"** → 接入 LS CRM/联系人 API

### 为什么需要 LiteStartup API Key？

LiteStartup 是一个提供即用型服务的平台 — **官网托管、博客、文档、更新日志、邮件、用户认证、文件存储、AI 等**。配合这个免费开源的 SaaS 后台脚手架，可以极大缩减构建 SaaS 产品的时间和成本。

**一个 API Key 即可接入平台的所有服务：**

| 平台服务 | 为你节省的工作 |
|---------|--------------|
| 用户认证（注册/登录/OAuth/验证码） | 从零构建认证系统 + 会话管理 |
| 交易邮件 & 营销邮件 | SMTP 基础设施 + 送达率管理 |
| 文件存储（S3） | 对象存储搭建 + 签名 URL 逻辑 |
| AI 能力（LLM Router、TTS、图片生成） | 逐个对接多家 AI 供应商 |
| 官网 / 博客 / 文档 / 更新日志 | 单独部署 CMS 系统 |

**Free 计划足以验证你的 MVP** — 今天开始构建，准备好了再扩展。

> 在 [app.litestartup.com/settings/api-keys](https://app.litestartup.com/settings/api-keys) 免费获取 API Key — 启用 `auth` scope 即可开始。

## 技术栈

| 类别 | 技术 |
|------|-----|
| **框架** | Next.js 14 (App Router) |
| **语言** | TypeScript 5 |
| **样式** | Tailwind CSS 3、Shadcn UI、Radix UI |
| **状态管理** | Zustand |
| **表单** | React Hook Form + Zod 校验 |
| **图表** | Recharts |
| **动画** | Framer Motion |
| **图标** | Lucide React |
| **主题** | next-themes |
| **国际化** | 自定义方案（Zustand + JSON 翻译文件） |

## 快速开始

### 前置条件

- Node.js 18+
- npm、yarn 或 pnpm
- 一个 [LiteStartup](https://www.litestartup.com) 实例及 API Key（需启用 `auth` scope）

### 安装

```bash
# 克隆仓库
git clone https://github.com/litestartup-com/litesaas-admin.git
cd litesaas-admin

# 安装依赖
npm install

# 复制环境变量并填入你的 LS API Key
cp .env.example .env.local
# 编辑 .env.local → 设置 LS_API_URL 和 LS_API_KEY

# 启动开发服务器
npm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000)。

### 环境变量

| 变量 | 必填 | 说明 |
|------|------|------|
| `NEXT_PUBLIC_APP_URL` | 是 | 应用的公开 URL（例如 `http://localhost:3000`） |
| `LS_API_URL` | 是 | LiteStartup 实例的 Base URL |
| `LS_API_KEY` | 是 | LS API Key（需启用 `auth` scope） |

> **注意：** 认证、AI 聊天和个人资料功能由 LS 后端提供支持。请确保你的 API Key 已启用 `auth` scope。

## 项目结构

```
litesaas-admin/
├── app/                          # Next.js App Router
│   ├── admin/users/              # 用户管理
│   ├── ai-chat/                  # AI 聊天界面
│   ├── api/                      # API 路由（代理到 LS 后端）
│   │   ├── ai/                   # AI 聊天 API
│   │   ├── auth/                 # 认证 API
│   │   ├── billing/              # 账单 API
│   │   ├── credits/              # 积分 API
│   │   ├── dashboard/            # 数据看板 API
│   │   ├── notifications/        # 通知 API
│   │   ├── profile/              # 个人资料 API
│   │   ├── stripe/               # Stripe 集成（mock）
│   │   └── users/                # 用户管理 API
│   ├── billing/                  # 账单页面
│   ├── credits/                  # 定价页面
│   ├── dashboard/                # 数据看板页面
│   ├── login/                    # 登录页面
│   ├── notifications/            # 通知页面
│   ├── profile/                  # 个人资料页面
│   ├── signup/                   # 注册页面
│   ├── verify-email/             # 邮箱验证
│   ├── layout.tsx                # 根布局
│   ├── page.tsx                  # 首页
│   └── globals.css               # 全局样式
├── components/
│   ├── auth/                     # 认证守卫
│   ├── dashboard/                # 统计、图表、活动
│   ├── layout/                   # 顶栏、侧边栏、语言切换
│   ├── magic/                    # 渐变动画文字
│   └── ui/                       # Shadcn UI 组件
├── lib/
│   ├── i18n/                     # 翻译文件（en.json、zh.json）
│   ├── api.ts                    # API 客户端工具
│   ├── api-auth.ts               # 服务端认证中间件
│   ├── api-client.ts             # 带 Token 的 fetch 客户端
│   ├── auth.ts                   # Token 管理
│   ├── fetch-with-auth.ts        # 认证 fetch 辅助
│   └── utils.ts                  # cn() 辅助函数
├── store/                        # Zustand stores（i18n、nav、ui、user）
├── hooks/                        # 自定义 React hooks
├── public/                       # 静态资源
├── Dockerfile                    # 多阶段 Docker 构建
├── docker-compose.yml            # Docker Compose 配置
└── .env.example                  # 环境变量模板
```

## 页面

| 路由 | 说明 |
|------|------|
| `/dashboard` | 收入统计、访客图表、近期活动、实时刷新 |
| `/admin/users` | 用户表格，支持搜索、分页、排序、详情抽屉、封禁/解封 |
| `/billing` | 订阅计划、订单历史、升级入口 |
| `/credits` | 定价计划（Free/Pro/Enterprise）、月付/年付切换、Stripe 支付 |
| `/ai-chat` | 多模型 AI 聊天，支持模型切换和对话历史 |
| `/notifications` | 通知列表，支持类型/状态筛选、标记已读、分页 |
| `/profile` | 邮箱和认证方式管理、第三方登录绑定/解绑 |
| `/login` | 邮箱/密码或验证码登录 |
| `/signup` | 用户注册 |
| `/verify-email` | 邮箱验证码验证 |

## 使用指南

### 国际化

```typescript
import { useTranslation } from "@/lib/i18n"

export function MyComponent() {
  const { t } = useTranslation()
  return <h1>{t('nav.dashboard')}</h1>
}
```

在 `lib/i18n/translations/en.json` 和 `zh.json` 中添加翻译。语言偏好保存在 localStorage 中。

### 认证

```typescript
import { setAuthToken, getAuthToken, isAuthenticated, clearAuthToken } from "@/lib/auth"
import { fetchWithAuth } from "@/lib/fetch-with-auth"

// 检查认证状态
if (isAuthenticated()) { /* ... */ }

// 认证 API 调用（自动携带 token，处理 401 重定向）
const response = await fetchWithAuth("/api/dashboard/stats")
```

路由保护通过 `AuthGuard` 实现：
- 未认证用户重定向到 `/login`
- 公开路由：`/login`、`/signup`、`/verify-email`
- Token 1 小时后过期，自动清理

### 状态管理

```typescript
import { create } from 'zustand'

interface MyStore { count: number; increment: () => void }

export const useMyStore = create<MyStore>((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
}))
```

已有 stores：`use-i18n.ts`、`use-navigation.ts`、`use-ui.ts`、`use-user.ts`。

### 表单

```typescript
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })
  // ...
}
```

### 添加 UI 组件

```bash
npx shadcn-ui@latest add [component-name]
```

## API 路由

`app/api/` 中的所有路由均为 mock 实现，准备好后可替换为真实后端。

| 端点 | 需认证 | 说明 |
|------|--------|------|
| `/api/auth/*` | 否 | 登录、注册、验证、密码重置 |
| `/api/dashboard/*` | 是 | 数据看板统计和图表数据 |
| `/api/users/*` | 是 | 用户 CRUD 和封禁管理 |
| `/api/billing/*` | 是 | 订阅和订单数据 |
| `/api/credits/*` | 是 | 定价计划 |
| `/api/notifications/*` | 是 | 通知列表和操作 |
| `/api/profile/*` | 是 | 个人资料管理 |
| `/api/ai/*` | 是 | AI 聊天补全 |
| `/api/stripe/*` | 是 | Stripe 支付（mock） |

服务端认证中间件：
```typescript
import { authenticateRequest } from "@/lib/api-auth"

export async function GET(request: NextRequest) {
  const auth = authenticateRequest(request)
  if (!auth.authenticated) return auth.response!
  // ...
}
```

## 部署

### Docker（推荐）

```bash
# docker-compose
docker-compose up -d --build

# 或者使用 Docker
docker build -t litesaas-admin .
docker run -d -p 3000:3000 --name litesaas litesaas-admin
```

仓库已包含 `Dockerfile`、`.dockerignore` 和 `docker-compose.yml`。需要 `next.config.js` 中的 `output: 'standalone'`（已配置）。

### Vercel

```bash
npm i -g vercel
vercel --prod
```

### Netlify

```bash
npm i -g netlify-cli
netlify deploy --prod
```

添加 `netlify.toml`：
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### 自托管（PM2 + Nginx）

```bash
npm run build
pm2 start npm --name "litesaas-admin" -- start
```

参见下方[生产环境检查清单](#生产环境检查清单)了解 Nginx 配置和 SSL 设置。

## 生产环境检查清单

上线前，请将 mock 实现替换为真实服务：

- [ ] 将 mock API 路由替换为真实后端/数据库（Prisma、Drizzle 等）
- [ ] 设置真实认证（NextAuth.js、Clerk、Auth0 或自定义 JWT）
- [ ] 使用生产环境 Stripe Key 配置支付
- [ ] 设置环境变量（参见 `.env.example`）
- [ ] 配置错误追踪（Sentry）
- [ ] 配置分析工具（Google Analytics、Plausible）
- [ ] 设置监控和可用性告警
- [ ] 启用 HTTPS 和安全头
- [ ] 在本地测试生产构建：`npm run build && npm start`

### 环境变量

复制 `.env.example` 到 `.env.local` 并配置：

```bash
cp .env.example .env.local
```

参见 `.env.example` 了解所有可用变量。**切勿将 `.env.local` 提交到版本控制。**

### 安全最佳实践

1. 不要在客户端代码中暴露密钥
2. 生产环境始终使用 HTTPS
3. 配置 CORS 策略
4. 为 API 路由实现速率限制
5. 使用 Zod 校验所有输入
6. 使用参数化查询（Prisma、Drizzle）
7. 净化用户生成的内容
8. 为表单实现 CSRF Token
9. 配置 Content Security Policy 头
10. 定期更新依赖

## 开发

```bash
npm run dev       # 启动开发服务器
npm run build     # 生产构建
npm start         # 启动生产服务器
npm run lint      # ESLint 检查
npx tsc --noEmit  # 类型检查
```

## 关于 Litestartup

**由 [Litestartup](https://www.litestartup.com) 构建和维护** — 面向初创企业的一站式平台。

[Litestartup](https://www.litestartup.com) 提供邮件营销、交易邮件 API、在线客服、AI 助手和增长工具 — 一切为初创企业而设计。Lite SaaS Admin 是我们的开源项目之一，旨在帮助开发者更快交付产品。

了解更多：
- [产品介绍 & 演示](https://www.litestartup.com/products/litesaas-admin) — 完整功能介绍与在线演示
- [Litestartup 平台](https://www.litestartup.com) — 一站式初创工具套件
- [文档中心](https://www.litestartup.com/docs) — 使用指南和 API 参考
- [博客](https://www.litestartup.com/blog) — 工程与产品洞察

## 贡献

欢迎贡献！请参阅 [CONTRIBUTING.md](CONTRIBUTING.md) 了解指南。

## 许可证

本项目基于 [MIT 许可证](LICENSE) 开源。

---

由 [Litestartup](https://www.litestartup.com) 用 ❤️ 打造
