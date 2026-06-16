# T-LSS01 LSS × LS 集成开发方案

> 日期：2026-06-15  
> 状态：待 PO 确认  
> 涉及仓库：litestartup (LS), litesaas (LSS)

---

## 一、战略定位

**LS** = SaaS 基础设施平台，将 Auth / Email / AI / Storage 等能力产品化，供任何第三方应用对接。

**LSS** = LS API 的参考实现，一个最小化的 AI Chat SaaS Demo 脚手架。用户 clone 后填入 LS API Key 即可运行。

---

## 二、PO 确认记录

| # | 问题 | 决策 |
|---|------|------|
| Q1 | mail_contacts 隔离 | 按 team_id 隔离（API Key owner 的 team） |
| Q2 | 用户删除时 contacts | 软删除（保留为退订状态 contact） |
| Q3 | OAuth config 存储 | 新建 `os_app_oauth_config` 表 |
| Q4 | OAuth 回调方案 | 两者都支持：默认方案 A（LS 代理），可选方案 B（用户自有 OAuth） |
| Q5 | AI Chat Demo 范围 | 纯文本对话（LLM Router） |
| Q6 | Notifications 页面 | 保留（应用内通知 + LS email 通知） |

---

## 三、LS 侧：Auth App 开发

### 3.1 新建数据库表

#### `os_app_user` — 第三方应用的终端用户

```sql
CREATE TABLE `os_app_user` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `team_id` int unsigned NOT NULL COMMENT 'Owner team (from API Key)',
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) DEFAULT NULL COMMENT 'Nullable for OAuth-only users',
  `name` varchar(100) DEFAULT NULL,
  `avatar_url` varchar(500) DEFAULT NULL,
  `email_verified` tinyint(1) DEFAULT 0,
  `status` enum('active','suspended','deleted') DEFAULT 'active',
  `metadata` json DEFAULT NULL COMMENT 'App-specific custom fields',
  `oauth_provider` varchar(50) DEFAULT NULL COMMENT 'google/github if OAuth user',
  `oauth_provider_id` varchar(255) DEFAULT NULL COMMENT 'Provider user ID',
  `last_login_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT 'Soft delete',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_team_email` (`team_id`, `email`),
  KEY `idx_team_status` (`team_id`, `status`),
  KEY `idx_oauth` (`oauth_provider`, `oauth_provider_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

#### `os_app_oauth_config` — OAuth 配置

```sql
CREATE TABLE `os_app_oauth_config` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `team_id` int unsigned NOT NULL,
  `provider` enum('google','github') NOT NULL,
  `client_id` varchar(255) NOT NULL,
  `client_secret` varchar(500) NOT NULL COMMENT 'Encrypted',
  `redirect_uri` varchar(500) DEFAULT NULL COMMENT 'User app callback URL',
  `enabled` tinyint(1) DEFAULT 1,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_team_provider` (`team_id`, `provider`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

#### `os_app_jwt_secret` — 每个应用独立的 JWT Secret

```sql
CREATE TABLE `os_app_jwt_secret` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `team_id` int unsigned NOT NULL,
  `secret` varchar(255) NOT NULL COMMENT 'Auto-generated, per-app JWT signing key',
  `algorithm` varchar(10) DEFAULT 'HS256',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_team` (`team_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 3.2 API 端点设计

**前缀**: `/client/v2/auth/app`  
**认证**: API Key (AuthForWebMiddleware)  
**Scope**: 新增 `auth` scope

| 方法 | 端点 | 说明 |
|------|------|------|
| POST | `/register` | 注册（email + password + name） |
| POST | `/login` | 登录（email + password → JWT） |
| POST | `/request-code` | 发送验证码到邮箱 |
| POST | `/verify-code` | 验证码 → JWT |
| POST | `/forgot-password` | 发送重置密码链接 |
| POST | `/reset-password` | token + 新密码 |
| POST | `/refresh` | refresh_token → 新 JWT |
| GET  | `/user` | JWT → 当前用户信息 |
| PUT  | `/user` | 更新用户信息（name, avatar） |
| POST | `/logout` | 撤销当前 JWT |
| GET  | `/oauth/google` | 跳转 Google OAuth（方案 A 或 B） |
| GET  | `/oauth/github` | 跳转 GitHub OAuth（方案 A 或 B） |
| GET  | `/oauth/callback` | OAuth 回调处理 |

### 3.3 注册流程（含 mail_contacts 同步）

```
POST /client/v2/auth/app/register
Body: { email, password, name }

→ 1. 验证 email 唯一性（team_id + email）
→ 2. INSERT os_app_user
→ 3. INSERT mail_contacts (同 team_id, email, name, tag: "users")
→ 4. 发送欢迎邮件（使用 notification scope）
→ 5. 返回 { user, token, refresh_token }
```

### 3.4 OAuth 双模式

**判断逻辑**：
```php
// 检查用户是否配置了自己的 OAuth
$oauthConfig = $repo->getOAuthConfig($teamId, 'google');

if ($oauthConfig && $oauthConfig['enabled']) {
    // 方案 B: 用户自有 OAuth
    $clientId = $oauthConfig['client_id'];
    $redirectUri = $oauthConfig['redirect_uri']; // myapp.com/callback
} else {
    // 方案 A: LS 代理 OAuth
    $clientId = $settings['google_oauth_client_id']; // LS 的
    $redirectUri = $settings['app_url'] . '/client/v2/auth/app/oauth/callback';
}
```

**方案 A 回调流程**：
```
Google 回调 LS → LS 生成 JWT → 302 redirect 到请求方的 redirect_uri + ?token=xxx
```

**方案 B 回调流程**：
```
Google 回调 myapp.com → myapp.com POST /client/v2/auth/app/oauth/exchange
Body: { code, provider }
→ LS 用存储的 secret 向 Google 换 access_token → 获取用户信息 → 创建/匹配 os_app_user → 返回 JWT
```

### 3.5 JWT 结构

```json
{
  "sub": "app_user_123",
  "email": "user@example.com",
  "name": "User Name",
  "team_id": 1,
  "type": "app_user",
  "iat": 1718460000,
  "exp": 1718463600
}
```

- **签名 key**: 从 `os_app_jwt_secret` 取（每个 team 独立）
- **有效期**: 1 小时（access_token），7 天（refresh_token）
- **验证**: LS 端点收到 JWT 后用对应 team 的 secret 验证

### 3.6 API Key Scope 变更

新增 `auth` scope：

```php
// ScopeGuard.php
const VALID_SCOPES = ['notification', 'email', 'application', 'auth', 'all'];
```

`all` scope 包含 `auth`。

### 3.7 新增 Controller

```
src/Controller/AppAuthController.php
```

方法：
- `register()` / `login()` / `requestCode()` / `verifyCode()`
- `forgotPassword()` / `resetPassword()`
- `refresh()` / `getUser()` / `updateUser()` / `logout()`
- `oauthRedirect()` / `oauthCallback()` / `oauthExchange()`

### 3.8 新增 Service

```
src/Service/AppAuthService.php
```

职责：
- JWT 生成/验证（使用 per-team secret）
- 密码 hash/verify
- OAuth flow 管理
- mail_contacts 同步（注册时打 `users` tag）
- 验证码生成/验证（复用现有 VerificationCode 机制）

### 3.9 LS Admin UI 变更

在 Settings / API Keys 页面增加：
- Auth App 启用开关
- Google OAuth 配置区域（client_id + client_secret + redirect_uri）
- GitHub OAuth 配置区域
- App Users 快捷链接（跳转到 Contacts 按 `users` tag 筛选）

---

## 四、LS 侧：Auth App 中间件

新增中间件用于验证 **app_user JWT**（区别于 LS 平台用户 JWT）：

```
src/Middleware/AuthForAppUserMiddleware.php
```

用途：LS 端需要验证 app_user 身份的端点（如 `/client/v2/auth/app/user`）。

验证流程：
```
1. 从 Authorization: Bearer <token> 提取 JWT
2. 解码 header 获取 team_id
3. 从 os_app_jwt_secret 获取对应 secret
4. 验证签名 + 过期时间
5. 注入 app_user_id 到 request attributes
```

---

## 五、LSS 侧：精简为 AI Chat SaaS Demo

### 5.1 保留页面

| 路由 | 功能 | 对接 LS API |
|------|------|------------|
| `/login` | 登录（邮箱+密码 / 验证码 / OAuth） | `POST /client/v2/auth/app/login` |
| `/signup` | 注册 | `POST /client/v2/auth/app/register` |
| `/verify-email` | 邮箱验证 | `POST /client/v2/auth/app/verify-code` |
| `/dashboard` | AI 用量概览 | LS usage API |
| `/ai-chat` | **核心** — AI 文本对话 | `POST /api/ai-stack/llm-router` |
| `/notifications` | 应用通知列表 | 本地 + LS email notification |
| `/billing` | 用量/配额展示 | LS billing data |
| `/profile` | 个人设置 | `GET/PUT /client/v2/auth/app/user` |

### 5.2 删除页面

| 路由 | 原因 |
|------|------|
| `/admin/users` | LS admin 职责，非 LSS 范围 |
| `/credits` | 合并到 `/billing` |

### 5.3 核心改造

#### `lib/ls-client.ts` — LS API 客户端（新建）

```typescript
class LSClient {
  private apiKey: string
  private baseUrl: string
  
  constructor(apiKey: string, baseUrl: string)
  
  // Auth
  register(email: string, password: string, name: string): Promise<AuthResponse>
  login(email: string, password: string): Promise<AuthResponse>
  requestCode(email: string): Promise<void>
  verifyCode(email: string, code: string): Promise<AuthResponse>
  forgotPassword(email: string): Promise<void>
  resetPassword(token: string, password: string): Promise<void>
  refreshToken(refreshToken: string): Promise<AuthResponse>
  getUser(token: string): Promise<User>
  updateUser(token: string, data: Partial<User>): Promise<User>
  logout(token: string): Promise<void>
  getOAuthUrl(provider: 'google' | 'github'): string
  
  // AI
  chatCompletion(messages: Message[], model?: string): Promise<ChatResponse>
  
  // Notification (Email)
  sendNotification(to: string, subject: string, content: string): Promise<void>
}
```

#### `app/api/*` — 从 mock 改为 proxy

所有 API route 改为 proxy 到 LS 后端：

```typescript
// app/api/auth/login/route.ts
export async function POST(request: Request) {
  const body = await request.json()
  const ls = new LSClient(process.env.LS_API_KEY!, process.env.LS_API_URL!)
  const result = await ls.login(body.email, body.password)
  return NextResponse.json(result)
}
```

#### `.env.example`

```bash
# Litestartup API (Required)
LS_API_URL=https://app.litestartup.com
LS_API_KEY=sk_live_your_api_key_here

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=My AI Chat

# OAuth (optional, only if using LS proxy OAuth)
# Leave empty to disable OAuth buttons
NEXT_PUBLIC_OAUTH_GOOGLE_ENABLED=true
NEXT_PUBLIC_OAUTH_GITHUB_ENABLED=true
```

### 5.4 Notifications 实现

**双层通知**：
1. **应用内通知**（前端 Zustand store + localStorage）— 如 "欢迎使用"、"配额即将用完"
2. **LS Email 通知**（对接 `/client/v2/emails/notification`）— 重要通知邮件推送

页面功能：
- 通知列表（已读/未读标记）
- 点击标记已读
- 清空全部

---

## 六、实施计划

### Phase 1: LS Auth App 后端（3-4 天）

| 步骤 | 任务 | 预计 |
|------|------|------|
| 1.1 | 创建三张新表（os_app_user, os_app_oauth_config, os_app_jwt_secret） | 0.5d |
| 1.2 | AppAuthService（JWT 生成/验证、密码管理、mail_contacts 同步） | 1d |
| 1.3 | AppAuthController（注册/登录/验证码/忘记密码） | 1d |
| 1.4 | OAuth 双模式实现 | 1d |
| 1.5 | AuthForAppUserMiddleware + Scope 变更 | 0.5d |

### Phase 2: LSS 精简 + 对接（2-3 天）

| 步骤 | 任务 | 预计 |
|------|------|------|
| 2.1 | 创建 `lib/ls-client.ts` | 0.5d |
| 2.2 | 改造 auth 流程（login/signup/verify → LS Auth App） | 1d |
| 2.3 | 改造 AI Chat（mock → LS LLM Router） | 0.5d |
| 2.4 | 删除不需要的页面 + 精简 notifications | 0.5d |
| 2.5 | 更新 README + .env.example | 0.5d |

### Phase 3: LS Admin OAuth 配置 UI（1 天）

| 步骤 | 任务 | 预计 |
|------|------|------|
| 3.1 | API Keys 页面增加 Auth App 配置区域 | 0.5d |
| 3.2 | OAuth 配置表单（Google/GitHub） | 0.5d |

### 总计：6-8 天

---

## 七、验收标准

### LS Auth App

- [ ] `POST /client/v2/auth/app/register` 成功注册用户
- [ ] 注册后 `mail_contacts` 新增记录（带 `users` tag）
- [ ] `POST /client/v2/auth/app/login` 返回 JWT
- [ ] JWT 使用 per-team secret 签名
- [ ] 验证码登录流程完整
- [ ] 忘记密码 → 重置密码流程完整
- [ ] Google OAuth 方案 A 跳转正常
- [ ] Google OAuth 方案 B（配置自有 client_id 后）正常
- [ ] Scope `auth` 权限检查生效
- [ ] 不同 team_id 用户数据完全隔离

### LSS Demo

- [ ] `git clone → .env 填 API Key → npm run dev` 三步可运行
- [ ] 注册/登录/验证码/忘记密码流程可用
- [ ] AI Chat 对话功能正常（接 LS LLM Router）
- [ ] Notifications 页面展示应用通知
- [ ] Profile 页面可查看/修改个人信息
- [ ] Dashboard 展示基础用量信息

---

## 八、风险与依赖

| 风险 | 影响 | 缓解 |
|------|------|------|
| LS LLM Router 未对 app_user 鉴权 | AI Chat 无法调用 | Phase 1 需确认 AI Stack API 是否支持 app_user JWT |
| OAuth 方案 A 需要 LS 已有 Google/GitHub OAuth 配置 | 无法测试 | 确认 LS settings 中已有 google_oauth_client_id |
| 跨仓修改 workspace boundary | edit 工具可能无效 | 用 write_to_file + 验证磁盘 |

---

## 九、开放问题（留给 PO 后续确认）

| # | 问题 | 建议 |
|---|------|------|
| P1 | AI Stack API 鉴权：app_user JWT 还是 API Key？ | 建议 API Key（服务端代理），app_user JWT 不直接调 AI |
| P2 | Auth App 注册需要邮箱验证吗？ | 建议可配置（默认需要） |
| P3 | app_user 密码策略（最小长度等）| 建议最低 8 位 |
| P4 | refresh_token 有效期 | 建议 7 天 |
| P5 | 单个 team 下 app_user 数量上限 | 建议 Free: 100, Pro: 10000, Business: 无限 |

---

*待 PO 确认后开始 Phase 1 开发。*
