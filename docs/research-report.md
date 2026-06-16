# LSS 深度调研报告 — LS 集成方案

> 日期：2026-06-15  
> 状态：Draft v1

## 一、项目现状分析

### 1.1 LSS 当前架构

| 维度 | 现状 |
|------|------|
| **框架** | Next.js 14 (App Router) + TypeScript |
| **UI** | Tailwind CSS 3 + Shadcn UI + Radix UI |
| **状态管理** | Zustand (4 stores: i18n/navigation/ui/user) |
| **认证** | Mock 实现 — `mock-jwt-token-*` 前缀校验，1小时过期 |
| **AI** | Mock 响应 — 仅返回随机字符串，无真实 LLM 调用 |
| **支付** | Mock Stripe — 返回假 session_id |
| **数据库** | **无** — 全部内存 mock，无 Prisma/Drizzle |
| **邮件** | **无** — 完全未实现 |
| **博客/CMS** | **无** |
| **SEO** | **基础** — 仅 metadata export |
| **Storage** | **无** |
| **部署** | Docker standalone + Vercel/Netlify 支持 |

### 1.2 LSS 已有的"骨架"价值

- **10 个功能页面**完整（Dashboard/Users/Billing/Credits/AI-Chat/Notifications/Profile/Login/Signup/Verify）
- **完整的 UI 组件库**（13 个 Shadcn 组件 + 自定义 magic 组件）
- **认证架构**设计合理（AuthGuard + apiClient 自动 401 重定向）
- **i18n** 双语支持
- **Dark Mode** 完整
- **Docker** 生产部署就绪
- **代码质量**高（TypeScript 严格、Zod 验证、React Hook Form）

### 1.3 LSS 的核心问题（Gap Analysis）

| 能力 | 当前 | 目标 |
|------|------|------|
| Auth | Mock token | 对接 LS Auth App（JWT Token API） |
| Email | 无 | 对接 LS Email API（通知/邮件） |
| AI 多模态 | Mock 单轮对话 | 对接 LS AI Stack (10+ 模态) + LLM Router |
| Payments | Mock Stripe | 自行实现或对接 LS（按需） |
| Database | 无 | 需决策：自带 Prisma 还是全部走 LS API |
| Storage | 无 | 对接 LS Storage App |
| Blog/Docs | 无 | **不需要** — LS 已通过 Skill + Git 实现 |

---

## 二、LS 后端已提供的 API 能力盘点

### 2.1 认证 (Auth) — 已有但未产品化为独立 App

```
POST /api/auth/token              → 邮箱+密码换 JWT
POST /api/auth/refresh            → 刷新 token
POST /api/auth/revoke             → 登出
GET  /api/auth/user               → 获取当前用户信息
POST /api/auth/request-auth-code  → 验证码登录
POST /api/auth/verify-auth-code   → 验证码确认
```

### 2.2 Email（已产品化）

```
POST   /client/v2/emails                   → 发送邮件
GET    /client/v2/emails                   → 发件列表
GET    /client/v2/emails/receiving         → 收件列表
POST   /client/v2/emails/notification      → 发送通知邮件
DELETE /client/v2/emails/{id}              → 删除
```

### 2.3 AI Stack (10 种模态，已产品化)

```
POST /api/ai-stack/llm-router        → LLM 对话（多模型路由）
POST /api/ai-stack/text-to-image     → 文生图
POST /api/ai-stack/text-to-audio     → TTS
POST /api/ai-stack/audio-to-text     → ASR
POST /api/ai-stack/text-to-video     → 文生视频
POST /api/ai-stack/image-to-video    → 图生视频
POST /api/ai-stack/text-to-podcast   → 播客生成
POST /api/ai-stack/image-to-text     → OCR
POST /api/ai-stack/digital-human     → 数字人
POST /api/ai-stack/voice-clone       → 声音克隆
GET  /api/ai-stack/tasks/{id}        → 异步任务状态查询
GET  /api/ai-stack/llm-router/models → 可用模型列表
```

### 2.4 Storage（已产品化）

```
POST   /client/v2/storage/upload     → 文件上传
GET    /client/v2/storage/files      → 文件列表
DELETE /client/v2/storage/files/{id} → 删除文件
```

### 2.5 Blog/Docs/Website (Repo Sync GitOps — 已产品化)

```
POST /client/v2/repo-sync/bind       → 绑定仓库
POST /client/v2/repo-sync/trigger    → 触发同步
用户通过 markdown + git 直接维护，无需前端 UI
```

### 2.6 Newsletter（已产品化）

```
POST /client/v2/newsletters          → 发布 Newsletter
POST /client/v2/newsletters/send     → 发送 Newsletter
```

---

## 三、LS API Key 认证机制

- 认证头：`Authorization: Bearer sk_live_*` 或 `sk-live-*`
- 支持 Scope 权限控制：`notification` / `email` / `application` / `all`
- 支持 IP 白名单
- 自动记录 `last_used_at` / `last_used_ip`
- 支持 API Key + JWT Token + Session 三种认证方式

---

## 四、核心结论

### 4.1 LSS 不需要的功能
- ❌ 博客/文档/网站管理 UI（LS Skill + Git 已解决）
- ❌ Newsletter 管理 UI（LS admin 已有）
- ❌ 完整的 CRM/邮件营销 UI（LS admin 已有）

### 4.2 LSS 应该聚焦的定位
- ✅ **AI Chat SaaS Demo** — 展示如何用 LS API 快速搭建 AI 产品
- ✅ **脚手架模板** — 用户 clone 后改成自己的 SaaS
- ✅ **LS 能力的消费者** — 不自建基础设施，全部对接 LS

### 4.3 LS 需要新增的产品化能力
- 🆕 **Auth App** — 让第三方应用用 LS 做认证（类似 Auth0/Clerk）
- 🆕 **Storage App** — 让第三方应用用 LS 做文件存储（已有 API，需产品化）
- ✅ Email API — 已产品化
- ✅ AI Stack API — 已产品化
- ✅ LLM Router — 已产品化

---

## 五、AGI 视角

### 5.1 战略定位

LS 正在从"自用 SaaS 平台"进化为"SaaS 基础设施提供商"：

```
v1-v2: LS = 自用产品（邮件/博客/AI 工具）
v3:    LS = 平台（开放 API，让第三方用）
v4:    LS = AI Co-Founder（AI Skill 帮用户开发）
```

LSS 是 v3→v4 的关键桥梁：
- v3 视角：LSS 是 LS API 的"参考实现"
- v4 视角：LSS 是 AI Skill 操作的"标准化目标"

### 5.2 核心竞争壁垒

"一个 API Key 解锁 Auth + Email + AI + Storage" — 比任何单点竞品都强：
- vs Auth0: 只有认证
- vs SendGrid: 只有邮件
- vs OpenAI: 只有 LLM
- vs S3: 只有存储
- **LS: 全部一站式**

---

*Report generated from codebase analysis of LSS and LS projects.*
