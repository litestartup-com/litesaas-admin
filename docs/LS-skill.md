# LiteStartup Skills → SaaS Scaffold 自动化方案讨论

先读一下项目规则和上下文文件，确保讨论建立在正确的基础上。

再看一下 litesaas-admin 的当前状态和 litestartup-skills 的 README。

再看一下 litesaas-admin 的 `.env.example` 和 `ls-client.ts`，了解目前 LS 后端集成的现状。

现在我对三个项目的现状有了完整了解。以下是我从业界最佳实践角度给出的分析和建议：

---

# 讨论：`litestartup-skills/admin` — AI Agent 驱动的 SaaS 初始化 Skill

## 你的想法梳理

用户安装 `litestartup-skills` 后说 "用 admin skill 帮我初始化一个 SaaS demo"，触发：
1. Clone `litesaas-admin` from GitHub
2. 通过 LS API Key 自动配置真实后端资源（官网/privacy/docs/email/blog/Google login/AI 等）
3. 启动后**全部可用，无 mock 数据**

---

## 业界对标分析

| 产品 | 做法 | 差异 |
|------|------|------|
| **Vercel Templates** | 一键 deploy template，但后端需要自己接 | 前端即开即用，后端自接 |
| **Supabase CLI** | `supabase init` 拉模板 + 自动建库 | 强绑自家 BaaS |
| **Railway Templates** | clone + 注入 env + 部署 | 全托管，但用户丧失控制 |
| **Create T3 App** | 交互式 CLI 选型 | 纯脚手架，无真实后端 |
| **Firebase Extensions** | 一键装能力模块到项目 | 模块粒度，非全项目 |

**你的方案独特之处**：不是传统 CLI，而是 **AI Agent 作为安装器** — 用自然语言触发，skill 文件定义流程，agent 执行。这在 2026 年是正确的方向。

---

## 核心建议

### 1. 分层设计：Skill = 编排层，不是执行层

```
litestartup-skills/admin/
├── SKILL.md              ← AI router（< 100 行）
├── capabilities/
│   ├── init.md           ← "初始化 SaaS 项目" 的完整流程
│   ├── configure.md      ← "配置已有项目" 
│   └── status.md         ← "检查项目状态"
├── specs/
│   ├── env-config.md     ← .env 配置规范
│   └── features.md       ← 可选功能模块说明
├── templates/
│   └── litestartup.yaml  ← 项目绑定配置模板
└── scripts/
    └── ls-admin-init.sh  ← 自动化脚本
```

**关键原则**：Skill 只告诉 agent **做什么**和**怎么验证**，agent 自己决定怎么执行（git clone / npm install / 写 .env）。这比写死 shell 脚本更灵活——不同 agent（Codex/Claude Code/Cursor）能力不同。

### 2. "全部可用" 的关键：API Key + LS 后端即后端

当前 `litesaas-admin` 已经实现了这个模式（从 [ls-client.ts](cci:7://file:///c:/Workplace/vagrant-ubuntu-for-win/lnmp-docker-new/app/litesaas-admin/lib/ls-client.ts:0:0-0:0) 可见）：

```
litesaas-admin (Next.js) 
    → API Routes (server-side proxy)
        → LS backend (via API Key + auth scope)
```

**这意味着**：只要有一个 LS API Key（带 `auth` scope），litesaas-admin 就是一个**全功能 SaaS 后台**，无需自建数据库。这是你方案能跑通的核心前提——✅ 已具备。

### 3. Init Flow 设计建议

```
用户: "帮我初始化一个 SaaS admin 项目"
         ↓
Agent 加载 capabilities/init.md
         ↓
Step 1: 确认项目名/目录
Step 2: git clone litesaas-admin → 目标目录
Step 3: npm install
Step 4: 交互式确认 LS 实例 URL + API Key
         └── 或引导用户到 litestartup.com 创建 API Key
Step 5: 自动写入 .env.local
Step 6: 可选功能配置（Google OAuth / AI model / 语言）
         └── Agent 调用 LS API 验证 Key scope 是否满足
Step 7: npm run dev → 验证启动成功
Step 8: 输出 "项目已就绪" + 功能清单
```

### 4. 关键设计决策点（需要 PO 拍板）

| # | 问题 | 建议 |
|---|------|------|
| Q-1 | **API Key 获取方式** — 是引导用户手动到 litestartup.com 创建，还是 skill 自动创建？ | 建议手动（安全 + 降低技术复杂度）。Skill 可以给出直链 `https://app.litestartup.com/settings/api-keys` |
| Q-2 | **OAuth 配置** — Google/GitHub OAuth Client ID/Secret 由谁提供？ | LS 后端已支持 OAuth dual-mode（T-LSS01）。Mode A（LS 代理）不需要用户提供任何 OAuth 凭证——开箱即用 |
| Q-3 | **功能模块是否可选** — 用户能否说"只要 auth + dashboard，不要 billing"？ | 建议 MVP 全量开启（当前 litesaas-admin 是单体），后续拆模块 |
| Q-4 | **litesaas-admin 是 fork 还是直接 clone** — 用户的项目是否需要保留 upstream 同步能力？ | 建议 clone + 去掉 .git（用户 init 新仓），提供 upgrade skill 单独处理版本更新 |
| Q-5 | **部署 scope** — Skill 是否包含 "帮我部署到 Vercel/Docker"？ | 建议 MVP 只做本地 dev，部署作为独立 capability 后续加 |
| Q-6 | **monetization** — 这个 skill 免费还是 Pro 功能？ | 建议 skill 免费（引流），LS 后端能力按 plan 收费 |

### 5. 与现有 `publish` Skill 的关系

| 维度 | publish skill | admin skill |
|------|--------------|-------------|
| 目标 | 管理**内容**（blog/docs/website） | 初始化+管理**应用** |
| 操作对象 | content repo（markdown/html） | Next.js 项目 |
| API scope | `system.publish` | `auth`（+ 可能需要新 scope） |
| 绑定方式 | `litestartup.yaml` in content repo | `.env.local` in Next.js project |
| 运行频率 | 每次 push 内容 | 初始化一次 + 偶尔配置 |

两者**完全独立**，符合 RULE.md 中 "Skills are independent" 原则。

### 6. 竞争力分析 — 为什么这是杀手级功能

1. **"3 分钟从想法到可用 SaaS 后台"** — 不是 demo，是真实可注册登录的系统
2. **零后端开发** — LS 后端处理 auth/billing/AI/email，用户只写前端业务
3. **Agent-native** — 不是又一个 CLI 工具，是用自然语言驱动的初始化体验
4. **锁定效应** — 项目一旦跑在 LS API 上，迁移成本高（用户数据 + OAuth 配置 + 邮件历史都在 LS）
5. **开源引流闭环** — litesaas-admin 开源免费 → skill 免费 → 用 LS 后端收费

### 7. 潜在风险和建议

| 风险 | 缓解 |
|------|------|
| LS 后端挂了 = 所有用户项目瘫痪 | 提供 fallback mock mode + SLA 承诺 |
| API Key 安全 — agent 对话中可能泄露 | 严格遵循 skills RULE（NEVER display key）+ server-side only 的 ls-client 模式 |
| 版本碎片化 — 用户 clone 后不更新 | 提供 `upgrade` capability 或 changelog 提醒 |
| scope 膨胀 — admin 需要的 scope 越来越多 | 设计 `admin` meta-scope，一键授权所有 admin 相关权限 |
| 跨平台兼容 — bash 脚本不跑 Windows | Agent 直接执行 npm/git 命令（已在编辑器 terminal 中），不强依赖 bash |

### 8. MVP 建议路径

```
Phase 1（1-2 天）: Skill 文件结构 + capabilities/init.md 规范文档
Phase 2（2-3 天）: 端到端验证 — Claude Code 装 skill → init → 项目跑起来
Phase 3（1 天）:   adapters 适配 Codex/Cursor/Windsurf
Phase 4（持续）:   根据用户反馈加 configure/upgrade/deploy capabilities
```

---

## 总结

你的方案**思路正确且时机恰好**。核心优势是：
- litesaas-admin **已经**是 LS API 的 thin client（[ls-client.ts](cci:7://file:///c:/Workplace/vagrant-ubuntu-for-win/lnmp-docker-new/app/litesaas-admin/lib/ls-client.ts:0:0-0:0) 证明了这点）
- litestartup-skills **已经**有成熟的 skill 架构（router + capabilities + scripts）
- T-LSS01 Auth App **已经**交付（API Key + auth scope = 开箱即用的后端）

唯一需要做的是把这些现有能力**用一个 skill 串起来**。最大的 effort 不在代码，在于 `capabilities/init.md` 的流程设计——让不同 agent 都能正确执行。

建议下一步：先写 `admin/SKILL.md` + `admin/capabilities/init.md` 的 spec 文档，确认 Q-1~Q-6 决策后开工。

---

# 最终设计方案（v2 · 调研后更新）

## 调研结论

### litesaas-admin API Route 现状审计

| 分类 | 状态 | 数据来源 |
|------|------|----------|
| Auth（login/signup/oauth/refresh/verify/reset） | ✅ 真实后端 | `ls-client.ts` → LS API |
| AI Chat | ✅ 真实后端 | `ls-client.ts` → LS LLM Router |
| Profile（GET/PUT） | ✅ 真实后端 | `ls-client.ts` → LS API |
| OAuth Config | ✅ 真实后端（graceful fallback） | 直接 fetch LS API |
| Dashboard stats | ❌ Mock | 硬编码假数据 |
| Users | ❌ Mock | 硬编码假数据 |
| Notifications | ❌ Mock | 硬编码假数据 |
| Billing / Credits | ❌ Mock | 硬编码假数据 |
| Stripe | ❌ Mock | 硬编码 |

**结论**：Auth + AI + Profile + OAuth 四大核心功能已走真实后端。
Mock 部分是展示层（dashboard 数字 / 用户列表 / 通知），不阻碍"注册→登录→AI 对话→改资料"这条主路径。
**开箱即用 = 可以做到。**

### publish skill 凭证体系

- `~/.litestartup/credentials`：纯文本 API Key，`chmod 600`
- **只有 Key，没有 URL** — URL 来自 `litestartup.yaml` 或 fallback `https://api.litestartup.com`
- publish skill scope：`system.publish`
- admin skill 需要的 scope：`auth`（+ 未来 `ai`, `billing`）
- **同一个 Key 未必同时有两个 scope**

---

## PO 决策确认（更新 Q-1 ~ Q-6）

| # | 决策 | PO 决定 |
|---|------|---------|
| Q-1 | API Key 获取 | **复用 `~/.litestartup/credentials`**。缺失时引导创建（需 `auth` scope） |
| Q-2 | OAuth | **开箱即用**。使用 LS 代理模式（Mode A），用户无需提供 OAuth 凭证 |
| Q-3 | 功能模块 | **MVP 全量**。Mock 模块保留展示，真实模块（Auth/AI/Profile）即开即用 |
| Q-4 | Clone 方式 | **clone + 移除 .git** → 用户 init 新仓库 |
| Q-5 | 部署 | **MVP 仅本地 dev** |
| Q-6 | 定价 | **Skill 免费，LS 后端按 plan 收费** |

---

## 零摩擦 Init Flow（最终版）

```
用户: "用 admin skill 帮我初始化一个 SaaS 项目"
         │
         ▼
Agent 加载 admin/capabilities/init.md
         │
         ▼
┌─────────────────────────────────────────────────┐
│ Step 1: 确定项目名和目标目录                       │
│   默认: ./my-saas-admin（用户可指定）               │
└─────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────┐
│ Step 2: Clone litesaas-admin                     │
│   git clone https://github.com/litestartup-com/ │
│     litesaas-admin.git <project-dir>             │
│   rm -rf <project-dir>/.git                      │
│   cd <project-dir> && git init                   │
└─────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────┐
│ Step 3: npm install                              │
└─────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────┐
│ Step 4: 凭证获取（零摩擦策略）                     │
│                                                  │
│   4a. 检查 ~/.litestartup/credentials            │
│       ├── 存在 → 读取 API Key                    │
│       └── 不存在 → 转 4c                         │
│                                                  │
│   4b. 用读到的 Key 验证 scope                     │
│       GET /client/v2/auth/app/oauth-config       │
│       ├── 200 → Key 有效且有 auth scope ✅        │
│       ├── 401 → Key 失效，转 4c                   │
│       └── 403 → Key 有效但缺 auth scope           │
│              → 提示用户到 dashboard 给 Key 加      │
│                auth scope                         │
│                                                  │
│   4c. 无 Key 或 Key 失效                          │
│       → 告知用户需要 LS API Key（auth scope）      │
│       → 给出直链:                                 │
│         https://app.litestartup.com/              │
│           settings/api-keys                       │
│       → 说明用途: "此 Key 用于用户认证、AI 聊天      │
│         和个人资料管理，你的应用数据存储在 LS 后端"   │
│       → 用户粘贴 Key 后保存到                     │
│         ~/.litestartup/credentials                │
│       → 回到 4b 验证                              │
└─────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────┐
│ Step 5: 生成 .env.local（自动，不问用户）          │
│                                                  │
│   LS_API_URL=https://api.litestartup.com         │
│   LS_API_KEY=<从 credentials 读取>               │
│   NEXT_PUBLIC_APP_URL=http://localhost:3000       │
│                                                  │
│   ⚠️ .env.local 已在 .gitignore，不会泄露        │
└─────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────┐
│ Step 6: npm run dev                              │
│   验证 http://localhost:3000 可访问               │
└─────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────┐
│ Step 7: 输出就绪报告                              │
│                                                  │
│   ✅ 项目已就绪: <project-dir>                    │
│                                                  │
│   可用功能:                                       │
│   ✅ 用户注册/登录（邮箱 + 验证码 + 密码重置）     │
│   ✅ Google/GitHub 登录（LS 代理模式，零配置）     │
│   ✅ AI 聊天（LS LLM Router）                    │
│   ✅ 个人资料管理                                 │
│   ✅ 多语言（中/英）                              │
│   ✅ 暗色模式                                     │
│   📋 Dashboard / Users / Notifications（展示数据） │
│   📋 Billing（展示数据，接入 LS Billing 后可用）   │
│                                                  │
│   下一步:                                         │
│   1. 打开 http://localhost:3000 注册第一个用户     │
│   2. 试试 AI 聊天功能                             │
│   3. 按业务需求修改前端页面                        │
└─────────────────────────────────────────────────┘
```

### 设计要点

1. **凭证复用**：优先读 `~/.litestartup/credentials`，publish 用户零额外步骤
2. **URL 硬编码**：`https://api.litestartup.com` — 与 `_lib.sh` 一致，不问用户
3. **Scope 验证**：用一个轻量 GET 请求自动检查，不让用户手动确认
4. **OAuth 零配置**：LS Mode A 代理模式，`oauth-config` API 自动探测启用状态
5. **全程不超过 1 个问题**：有 credentials → 0 个问题；无 credentials → 1 个问题（粘贴 Key）

### 安全保障

- Key 只写入 `~/.litestartup/credentials`（600 权限）和 `.env.local`
- `.env.local` 在 `.gitignore` 中（litesaas-admin 已配置）
- Agent 对话中 **NEVER** 显示 Key 内容
- `ls-client.ts` 是 server-side only，Key 不会暴露给浏览器

### Scope 兼容性策略

```
publish key (system.publish)  ← 已有用户
admin key (auth)              ← admin skill 需要

可能性 1: 用户的 Key 同时有 system.publish + auth → 直接可用
可能性 2: 用户的 Key 只有 system.publish → 403 → 引导加 auth scope
可能性 3: 用户没有 Key → 引导创建（建议同时选 system.publish + auth）
```

**建议 LS 后端提供 `admin` meta-scope**（包含 auth + ai + billing），简化用户选择。但 MVP 阶段用 `auth` 单一 scope 即可。

---

# Admin Skill 暴露 LS 能力（v3 · 加速开发设计）

## 核心观点

Admin skill 不仅是**初始化工具**，更应该是**开发加速器**。
暴露 LS 的 API 能力 + 集成方法，让 agent 在用户开发产品时能直接调用，
从"帮我搭项目"升级为"帮我写功能"。

## LS 后端对 SaaS 开发者暴露的能力（精选）

| 能力 | 端点 | 开发者场景 | 需要 scope |
|------|------|-----------|-----------|
| 用户注册/登录 | `POST /client/v2/auth/app/register\|login` | 核心认证流程 | auth |
| OAuth 登录 | `GET /client/v2/auth/app/oauth/google\|github` | 社交登录 | auth |
| 密码重置 | `POST /client/v2/auth/app/forgot-password` | 找回密码 | auth |
| 邮箱验证码 | `POST /client/v2/auth/app/request-code` | 验证码登录 | auth |
| 用户资料 | `GET\|PUT /client/v2/auth/app/user` | 个人中心 | auth |
| 发送邮件 | `POST /client/v2/emails` | 欢迎邮件/通知/营销 | — |
| 通知邮件 | `POST /client/v2/emails/notification` | 系统通知（无需自有域名） | — |
| AI 聊天 | `POST /client/v2/ai/chat`（via ls-client） | 应用内 AI 助手 | auth |
| AI 生成 HTML | `POST /client/v2/ai/html/generate` | AI 生成 landing page | — |
| 文件上传 | `POST /client/v2/storage/upload` | 头像/附件/图片 | — |
| 联系人 CRUD | `/client/v2/contacts/*` | CRM / 用户标签管理 | — |
| Newsletter | `POST /client/v2/newsletters/send` | 产品 newsletter | — |
| 订阅管理 | `POST /client/v2/subscription/create\|downgrade` | SaaS 付费升级 | — |

> 135 个 API 端点中只精选 ~15 个最高频 SaaS 场景

## Skill 目录结构（更新）

```
litestartup-skills/admin/
├── SKILL.md                      ← Router (< 100 行)
├── capabilities/
│   ├── init.md                   ← 初始化 SaaS 项目
│   ├── configure.md              ← 配置已有项目
│   └── status.md                 ← 检查项目状态
├── specs/
│   ├── env-config.md             ← .env 配置规范
│   ├── features.md               ← 功能模块说明
│   └── ls-capabilities.md        ← ⭐ LS 能力集成指南
├── templates/
│   └── env.local.example         ← .env.local 模板
└── scripts/
    └── ls-admin-init.sh          ← 自动化脚本
```

## `specs/ls-capabilities.md` 设计

这个文件的目标是：**当 agent 要帮用户写功能时，能直接读这个文件拿到集成代码**。

### 文件结构

```markdown
# LS Backend Capabilities for SaaS Development

> This file tells the AI agent what backend services are available
> and how to integrate them into the litesaas-admin project.
> All calls go through the Next.js API routes (server-side proxy).

## Architecture

Browser → Next.js API Route → LS Backend (via API Key)
                             ↑ ls-client.ts handles auth

## Available Capabilities

### 1. Send Email (Transactional)

**When to use**: User registration welcome, password reset, order confirmation

**Integration pattern**:
```typescript
// In app/api/your-feature/route.ts
import { NextResponse } from "next/server"

const LS_API_URL = process.env.LS_API_URL
const LS_API_KEY = process.env.LS_API_KEY

export async function POST(request: Request) {
  const { to, subject, html } = await request.json()

  const res = await fetch(`${LS_API_URL}/client/v2/emails`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${LS_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ to, subject, html, from: "noreply@yourdomain.com" }),
  })

  const data = await res.json()
  return NextResponse.json({ success: true, data })
}
```

### 2. Send Notification Email (No domain needed)

**When to use**: System alerts, simple notifications (uses LS shared sender)

**Integration**: Same as above but endpoint = `/client/v2/emails/notification`
and no `from` field needed.

### 3. File Upload

**When to use**: Avatar upload, document attachments

**Integration pattern**:
```typescript
// In app/api/upload/route.ts
export async function POST(request: Request) {
  const formData = await request.formData()

  const res = await fetch(`${LS_API_URL}/client/v2/storage/upload`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${LS_API_KEY}` },
    body: formData,  // pass through multipart
  })

  const data = await res.json()
  return NextResponse.json({ success: true, url: data.data.url })
}
```

### 4. AI HTML Generation

**When to use**: User wants AI-generated landing page, email template

**Integration pattern**:
```typescript
const res = await fetch(`${LS_API_URL}/client/v2/ai/html/generate`, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${LS_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ prompt: "A pricing page for a SaaS product" }),
})
```

### 5. Contact Management (CRM)

**When to use**: Track app users, segment by tags, export

**Endpoints**:
- `POST /client/v2/contacts/add` — Add user to CRM
- `GET /client/v2/contacts/search` — Search/filter
- `PUT /client/v2/contacts/update` — Update metadata
- `DELETE /client/v2/contacts/delete` — Remove

### 6. Newsletter / Bulk Email

**When to use**: Product updates, marketing campaigns

**Endpoint**: `POST /client/v2/newsletters/send`

## Already Integrated (via ls-client.ts)

These are already working in litesaas-admin — no extra code needed:
- ✅ User register/login/logout
- ✅ OAuth (Google/GitHub)
- ✅ Password reset / verification code
- ✅ User profile CRUD
- ✅ AI chat completion
- ✅ Token refresh

## Not Yet Integrated (Extend as needed)

These require adding new API routes in `app/api/`:
- 📧 Transactional email sending
- 📁 File upload/storage
- 🤖 AI HTML generation
- 📋 Contact/CRM management
- 📰 Newsletter sending
- 💳 Subscription management (LS Billing)
```

## 关键设计决策

### 为什么暴露方式是 "spec file" 而不是 "SDK wrapper"？

| 方案 | 优点 | 缺点 |
|------|------|------|
| A. 提供 LS SDK（npm package） | 类型安全、版本控制 | 需要维护、增加依赖、更新延迟 |
| B. 在 ls-client.ts 里加更多函数 | 集中管理 | litesaas-admin 代码膨胀 |
| **C. Spec file (推荐)** | Agent 按需生成代码、零依赖、不膨胀 template | Agent 质量依赖 spec 清晰度 |

**选 C 的理由**：
1. litesaas-admin 是**脚手架** — 用户会大量修改代码，不需要一个庞大的 SDK
2. Agent 看 spec 后**按场景生成代码** — 比固定 SDK 更灵活
3. 不同用户需求不同 — 有人只要 email，有人要全套。Spec 让 agent 按需取用
4. 与 skill 哲学一致 — "Skill 只告诉 agent 做什么，agent 决定怎么做"

### 用户体验模拟

```
用户: "给我加一个用户注册后发欢迎邮件的功能"

Agent（读了 ls-capabilities.md）:
  1. 看到 "Send Email" capability 和代码模板
  2. 在 app/api/auth/signup/route.ts 的注册成功后加 email 调用
  3. 用 /client/v2/emails 端点，body 是 { to, subject, html }
  4. 完成 ✅

无需用户查文档、选邮件服务、配 SMTP — 因为 LS 后端已有。
```

### 安全边界

- `ls-capabilities.md` **不包含 API Key 示例值**
- 代码模板中用 `process.env.LS_API_KEY`，永远从环境变量读
- 所有集成代码走 **server-side API route**，Key 不暴露给浏览器
- Agent 对话中 **NEVER** 显示真实 Key

## 总结

| 维度 | 不暴露能力 | 暴露能力（推荐） |
|------|-----------|----------------|
| 初始化体验 | 相同 | 相同 |
| 开发速度 | 用户自己查 LS 文档 | Agent 直接生成集成代码 |
| 学习成本 | 高（135 个 API） | 低（精选 ~15 个 + 代码模板） |
| Agent 效率 | 只能帮忙写 UI | 能帮写 UI + 后端集成 |
| 锁定效应 | 弱 | **强**（用越多 LS 能力越难迁移） |
| 维护成本 | 低 | 中（API 变了需更新 spec） |

**最终建议**：暴露。这是把 admin skill 从"一次性搭建工具"变成"持续开发伴侣"的关键。用户装了这个 skill 后，不仅能 init 项目，后续开发中 agent 也能随时引用 LS 能力帮用户写功能。

---

# Roadmap & PO 决策（v4 · 最终确认）

## 架构决策

| 决策项 | PO 决定 | 备注 |
|--------|---------|------|
| 数据库 | **本地 Drizzle + PostgreSQL** | 业务数据自有，Auth/AI/Email 走 LS |
| Docker | **docker-compose（app + db + caddy）** | 一键部署 |
| 部署方式 | **用户自己服务器优先** | LS Deploy 太重，后续计划 |
| 反向代理 | **Caddy（自动 SSL）** | 最低配置成本 |
| ORM | **Drizzle** | 轻量、TypeScript-native、Agent 友好 |

## 分阶段执行计划

```
Phase 1 — Admin Skill Demo（现在）
├── 目标: 验证 skill 机制可行
├── Scope: init capability only
├── litesaas-admin: 使用现有代码（无 DB）
├── 产出: litestartup-skills/admin/ 目录完整
└── 验证: agent 能正确执行 init 流程

Phase 2 — litesaas-admin 加真实 DB
├── 加 Drizzle + PostgreSQL
├── schema: users(扩展) / notifications / billing / dashboard_stats
├── 替换所有 mock API routes
├── 升级 docker-compose.yml（加 db + caddy）
├── 产出: litesaas-admin 无 mock 数据
└── Admin skill 的 init capability 相应更新（加 DB 配置步骤）

Phase 3 — Deploy Capability（用户自有服务器）
├── admin/capabilities/deploy.md
├── 流程: SSH → git clone → docker compose up → Caddy 配置
├── 支持: Ubuntu / Debian VPS
├── 不做: LS 托管部署（太重，后续再议）
└── 产出: agent 能帮用户一键部署到自己的服务器

Phase 4 — 持续增强（后续）
├── upgrade capability（拉新版 + migration + 重启）
├── LS Deploy（LS 平台托管，自动分配域名）
├── 多租户支持
└── 监控 / 备份 / 告警
```

## 现在开始: Phase 1 实现