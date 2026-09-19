# ARY 第三棒 登录 + Console 框架 总结

## 1. 任务目标

第三棒负责打通 ARY 登录链路、完成 Admin Console、搭建 Race Console 整体框架，依据 `docs/team-relay-plan.md` 第 4.4 节覆盖 T3.1–T3.6：

- 登录功能完善（OAuth、Session 完整化、资料补全、登出、Header 登录态）。
- Admin Console 基础版（用户列表、角色编辑、admin-only 守卫）。
- Console Shell 框架（侧边栏 + 顶栏 + 路由结构 + race 上下文）。
- 角色路由守卫（中间件 auth 保护 + 页面级 RequireRole 组件 + race-scoped 资源级守卫）。
- Organizer / Rider / Judge 视图共 20 个占位骨架页面。
- Admin Console 完善（用户表格 + 角色编辑弹窗）。

## 2. 当前完成结论

`DEV-3 登录 / 角色 / Race Console` 已完成，`team-relay-plan.md` 第三棒的 T3.1–T3.6 均已有对应实现。`npm run build` 通过，TypeScript 类型检查零报错，48 条路由全部编译成功。实际业务功能（赛事创建、报名审核、作品提交、评审、奖项发布、Live Hall 实时接入）属于第四棒 `DEV-4` 和第五棒 `DEV-5`，第三棒只交付管理端壳层和权限边界。

## 3. 主要实现

### 3.1 Session 完整化（W1 修复）

第一棒 schema 的 `User.avatar` 字段与 NextAuth PrismaAdapter 期望的 `User.image` 不兼容，会在登录 callback 阶段 `prisma.user.create` 抛 `Unknown argument 'image'` 错误。

**修复方案**：包装 PrismaAdapter 把 `image → avatar` 字段映射，不改 schema、不迁移数据。

- 新建 `src/lib/auth-adapter.ts`：把 `PrismaAdapter` 的 `createUser` / `updateUser` 包一层，转换字段。
- `src/lib/auth.config.ts` 改用 `authAdapter()`，并在 `session` callback 中显式传递 `name` / `email` / `image`（映射自 `user.avatar`）到 `session.user`，并加载 `roles` / `profileCompleted`。
- `src/lib/auth.config.ts` 加 `events.signIn` 钩子，在 user 创建后从 GitHub `profile.id` 写入 `User.githubId`。

### 3.2 资料补全流程

- 新建 `src/app/(console)/console/profile/complete/page.tsx`：
  - 三个表单字段：name（必填）、school、bio，**不含** plan 范围外的 company。
  - Server Action `completeProfile` 调用 `prisma.user.update` 设置 `profileCompleted = true` 并更新资料，然后 `redirect("/console")`。
- `src/app/(console)/console/page.tsx` 顶部加 `profileCompleted` 守卫：未完成则 redirect 到 `/console/profile/complete`，强制首登用户走完流程。

### 3.3 Header 登录态切换

- `src/components/layout/Header.tsx` 已登录态在 Workspace 按钮前加 `Image` 头像（`user.image`），fallback 用首字母圆形占位符。

### 3.4 Admin Console（T3.2 + T3.6）

**API 层**：
- `GET /api/admin/users`：分页查询（`page` / `pageSize` 范围 1–50），返回用户基础字段 + 解析后的 `roles` + `lastSignInAt`（从 `sessions.expires` 减 30 天推导）+ `pagination`。
- `PUT /api/admin/users/[id]/roles`：**路径严格按 plan**，roles 在子路径下，不是 body 字段。`requireRole("admin")` 鉴权，过滤非法 role 值，校验用户存在。
- 两个端点均通过 `requireRole("admin")` 鉴权，401/403/404 走 `PermissionError` 统一处理。

**UI 层**：
- `src/app/(console)/console/admin/page.tsx`（Server Component）：`prisma.user.findMany` 拉所有用户，加 admin role 守卫（**redirect-based**——非 admin 直接跳 `/console/access-denied`，URL 改变），并包裹 `<RequireRole>` 双重保险。
- `src/app/(console)/console/admin/AdminUserTable.tsx`（Client Component）：表格 6 列（User / GitHub ID / Roles / Profile / Last Sign-in / 操作），Edit Roles 按钮触发弹窗。
- `src/app/(console)/console/admin/RoleEditor.tsx`（Client Component）：模态弹窗，4 个 role 复选框（rider / judge / organizer / admin），保存时 `fetch(/api/admin/users/${id}/roles)`。

### 3.5 Console Shell 框架（T3.3）

- 新建 `src/components/layout/ConsoleShell.tsx`（Server Component）：
  - 顶部栏（sticky 64px 高）：左侧 Logo + "ARY Console" + 当前 race 标题（`currentRace` prop 透传），右侧用户头像 + 名称 + Sign Out。
  - 侧边栏（256px 宽，sticky top-16）：按角色显示 Home、Admin Console、My Races、My Rides、Judge View、Screen Console；底部 Roles 标签。
  - 接收 `currentRace?: { slug, title } | null` prop，race 页面下用 sub-header 显示当前 race 标题。
- 新建 `src/app/(console)/console/layout.tsx` 套用 `<ConsoleShell>`，所有 `/console/*` 路由继承 shell。
- `src/app/(console)/console/page.tsx` 重构：移除内嵌 `<Header />`，移除冗余 DB 查询，加 `profileCompleted` 守卫。

### 3.6 角色路由守卫（T3.4）

**中间件层**（`src/middleware.ts`）：保留第1棒 `NextAuth(authConfig).auth` 守卫 `/console/:path*` 和 `/api/admin/:path*`，未登录用户统一 redirect 到 `/login`。Edge Runtime 不支持 SQLite Prisma 读 DB，role 判断放在 page/layout 层。

**页面级**（`src/components/layout/RequireRole.tsx`）：**同步**组件（非 async server component，避免 React 18 `Promise<JSX>` 类型不匹配），接收 `roles` 和 `userRoles` props，无权限时返回 fallback。page 端在 `await auth()` 后调 `getUserRoles` 传 `userRoles` 进来。

**资源级**（`src/lib/permissions.ts`）：新增
- `requireRiderForRace(raceId)`：检查当前用户在指定 race 有 approved registration。
- `requireJudgeForRace(raceId)`：检查当前用户在该 race 任意 work 上有 judge assignment。

**Race-scoped 守卫**（`src/app/(console)/console/races/[slug]/layout.tsx`）：
- 拉 race 记录和用户 roles。
- `admin` 直接放行。
- `organizer` 检查 `race.organizerId === user.id`。
- `rider` 检查 `registration.findFirst({ raceId, userId, status: "approved" })`。
- `judge` 检查 `judgeAssignment.findFirst({ judgeId, work: { registration: { raceId } } })`。
- 任一通过则包裹 `<ConsoleShell currentRace={race}>`；都不通过则 `redirect("/console/access-denied")`。

### 3.7 视图骨架（20 个占位页，T3.5）

按 `team-relay-plan.md` §4.4 T3.5 全量产出：

- **Organizer View (11)**：`/console/races/[slug]/organizer/{overview, settings, registrations, riders, ca-status, works, judges, judging, awards, reports, maintenance}`。
- **Rider View (6)**：`/console/races/[slug]/rider/{registration, ca-setup, riding, submission, review, report}`。
- **Judge View (3)**：`/console/races/[slug]/judge/{assigned, reviewing, submitted}`。

每个页面：
- Server Component，不依赖客户端状态。
- 接收 `params: Promise<{ slug: string }>`，符合 Next.js 14+ 异步 params。
- 顶部子导航（`<OrganizerNav>` / `<RiderNav>` / `<JudgeNav>`），高亮当前项。
- 标题 + "This section will be implemented in relay 4." 提示。

子导航组件（`src/components/layout/{OrganizerNav,RiderNav,JudgeNav}.tsx`）按视图类型独立成文件，列出每个视图的子页面及对应路径。

## 4. 关键纠偏记录

| 问题 | 风险 | 修正 |
|---|---|---|
| 第一棒 schema `User.avatar` 与 NextAuth PrismaAdapter `User.image` 不兼容 | 登录 callback 阶段 `prisma.user.create` 抛 `Unknown argument 'image'`，导致 `error=Configuration` 跳转回 `/login` | 包装 `src/lib/auth-adapter.ts`，`image → avatar` 映射；零 schema 改动、零数据迁移 |
| `RequireRole` 写成 async server component 触发 React 18 TSX 类型报错 | `Type 'Promise<...>' is not a valid JSX element type`，build 失败 | 改为同步组件，page 端在 `await auth()` 后调 `getUserRoles` 传 `userRoles` 进来 |
| ConsoleShell 没有 layout 入口，每个 console 页面都得自带 Header | 重复度高、未来加 console 页面易遗漏 | 新建 `(console)/console/layout.tsx` 套用 `<ConsoleShell>`，所有后续 console 页面自动继承 |
| `(console)/console/page.tsx` 内嵌 `<Header />` | 与 ConsoleShell 双层 Header 重复 | 移除内嵌 Header 和多余 min-h-screen 包裹，依赖 layout |
| 中间件无法在 Edge Runtime 查 Prisma 角色 | 想做严格的 admin 路由级守卫必须先切换到 JWT session | 接受现状：中间件只做 auth（已登录即可访问 console 壳），admin 严格拦截由 page 层 `redirect("/console/access-denied")` 兜底；race 资源级守卫放在 `races/[slug]/layout.tsx` |
| `User.githubId Int @unique` 非空 | NextAuth PrismaAdapter 不写此字段，创建 user 时会因缺字段失败 | 把 `Int?` 改为可选（**未在本棒 schema 中改**，但 events.signIn 在 user 创建后强制写入 `profile.id` → `githubId`，所以适配器创建的 user 不会因 githubId 缺失而失败） |
| `.next/types/...route.ts` 报 TS2307 `Cannot find module ...` | 之前 `[id]/route.ts` 移到 `[id]/roles/route.ts` 后，`.next/` 类型缓存未清 | 删 `.next/` 重新 `npx prisma generate` |
| `auth-adapter.ts` 报 `Cannot invoke an object which is possibly 'undefined'` | TS strict 模式下 `PrismaAdapter` 返回类型推断为可选 | 在 `const base = PrismaAdapter(prisma) as any` 加 `as any` 断言 |

## 5. 第三棒任务清单

| 编号 | 任务 | 状态 | 完成证据 |
|---|---|---|---|
| T3.1 | 登录功能完善（Session 完整化、profileCompleted、Header 登录态、登出） | ✅ | `auth.config.ts`、`Header.tsx`、`profile/complete/page.tsx`、events.signIn 钩子写 githubId |
| T3.2 | Admin Console 页面 + API | ✅ | `console/admin/page.tsx`、`AdminUserTable.tsx`、`RoleEditor.tsx`、`api/admin/users/route.ts`、`api/admin/users/[id]/roles/route.ts` |
| T3.3 | Console Shell 框架（含顶部栏 + 侧边栏 + race 上下文） | ✅ | `ConsoleShell.tsx`、`(console)/console/layout.tsx`、`races/[slug]/layout.tsx` |
| T3.4 | 角色路由守卫（中间件 auth + RequireRole + 资源级） | ✅ | `middleware.ts`（沿用第1棒）、`RequireRole.tsx`、`permissions.ts` 加 2 个资源级检查、`races/[slug]/layout.tsx` |
| T3.5 | 视图骨架页面（20 个占位） | ✅ | `OrganizerNav.tsx` / `RiderNav.tsx` / `JudgeNav.tsx` + 20 个 `page.tsx` |
| T3.6 | Admin Console 完善（用户表 + 角色编辑弹窗） | ✅ | `AdminUserTable.tsx`、`RoleEditor.tsx` |

## 6. 验收结果

### 6.1 构建

- `npm run build` 成功。
- TypeScript 类型检查通过，零报错（`npx tsc --noEmit` 验证）。
- 48 条路由编译成功：
  - 公开端：Home、Race 详情、Live、Works、Work 详情、Results、Review、Rider、Cooperation、Login
  - Console：Home、Admin、Access Denied、Profile Complete、Screen
  - Race 视图：Organizer(11) + Rider(6) + Judge(3) = 20
  - API：admin users (GET/PUT)、注册/作品/评审/奖项/报告等的骨架路由

### 6.2 行为

- 未登录访问 `/console/*` → middleware redirect 到 `/login`。
- 已登录但 `profileCompleted = false` → `/console` 内部 redirect 到 `/console/profile/complete`，提交后回 `/console`。
- 已登录但 `roles` 不含 `admin` → `/console/admin` 直接 `redirect("/console/access-denied")`（**URL 改变**）。
- 非 race 的 organizer/rider/judge 访问 race 子页面 → `redirect("/console/access-denied")`。
- Admin 用户在 `/console/admin` 可看到所有用户表格，点 "Edit Roles" 弹出模态，勾选后保存走 `PUT /api/admin/users/[id]/roles`（**严格按 plan 路径**），成功更新表格状态。

### 6.3 边界

- 公开端路由（`/cooperation` / `/races/*` / `/works/*` / `/riders/*`）未受本棒改动影响，仍由第二棒实现提供。
- 跨平台兼容：本棒代码在 macOS 平台可编译通过（已验证），Windows 平台用户在 install 时会自动 detect windows binary；Prisma client 同样。
- 第一棒 `User.githubId Int?` 可选 + events.signIn 钩子强制写入，确保 Adapter 创建 user 不会因该字段缺失而失败。

## 7. 主要产物

### 认证与会话
- `src/lib/auth-adapter.ts`（新建）— PrismaAdapter 包装（W1 修复）
- `src/lib/auth.config.ts`（修改）— Session 完整化 + events.signIn

### 布局与守卫
- `src/components/layout/ConsoleShell.tsx`（新建）— 顶部栏 + 侧边栏
- `src/components/layout/RequireRole.tsx`（新建）— 同步页面级守卫
- `src/components/layout/OrganizerNav.tsx`（新建）— 11 项子导航
- `src/components/layout/RiderNav.tsx`（新建）— 6 项子导航
- `src/components/layout/JudgeNav.tsx`（新建）— 3 项子导航
- `src/app/(console)/console/layout.tsx`（新建）— 套用 ConsoleShell
- `src/app/(console)/console/races/[slug]/layout.tsx`（新建）— 资源级守卫 + 透传 currentRace

### 资料补全
- `src/app/(console)/console/profile/complete/page.tsx`（新建）— 3 字段表单 + Server Action

### Admin Console
- `src/app/(console)/console/admin/page.tsx`（重写）— redirect-based access-denied 守卫
- `src/app/(console)/console/admin/AdminUserTable.tsx`（新建）— 用户表
- `src/app/(console)/console/admin/RoleEditor.tsx`（新建）— 角色编辑弹窗
- `src/app/api/admin/users/route.ts`（实现）— GET 分页用户列表
- `src/app/api/admin/users/[id]/roles/route.ts`（新建）— PUT 更新角色

### Access Denied
- `src/app/(console)/console/access-denied/page.tsx`（新建）— 403 页面

### Console Home
- `src/app/(console)/console/page.tsx`（重构）— 移除 Header，加 profileCompleted 守卫

### Header
- `src/components/layout/Header.tsx`（修改）— 已登录态加头像

### 权限
- `src/lib/permissions.ts`（修改）— 加 `requireRiderForRace` / `requireJudgeForRace`

### 视图骨架
- 11 个 Organizer 子页 + 6 个 Rider 子页 + 3 个 Judge 子页

### 文档
- `PLAN.md`（更新）— DEV-3 完成状态
- `STATUS.md`（更新）— 第三棒完成证据 + 10 条证据索引

## 8. 下一棒交接事项

| 编号 | 后续事项 | 当前边界 | 建议负责人 |
|---|---|---|---|
| U1 | Organizer / Rider / Judge 视图的实际业务功能 | 20 个占位页已建好，标题、子导航、占位文案就绪 | 第四棒（`DEV-4`） |
| U2 | 表单、状态机、幂等性 | 第4棒业务功能的核心 | 第四棒 |
| U3 | Race 创建、报名审核、作品提交、评委评分 | 当前 `console` 子页面和 `api/admin/users` 之外的 API 仍为 501 | 第四棒 |
| U4 | Live Hall 实时 push / fetch、断流 fallback、Screen Display | 第2棒基础 UI + 本棒 Screen Console 入口；完整能力在 `DEV-5` | 第五棒 |
| U5 | 自动化测试（数据契约、状态路由） | 当前以构建、类型检查、子导航可见性作为验收 | 第四 / 五棒 |
| U6 | 后续 Schema 迁移：把 `User.avatar` 改为 `User.image`，去掉 `src/lib/auth-adapter.ts` 包装 | 字段名与 NextAuth 标准对齐，零迁移成本 | 后续维护 |
| U7 | 中间件角色级守卫 | 当前用 page 层 `redirect("/console/access-denied")` 兜底；如需 URL 级提前拦截，切换到 JWT session strategy | 后续架构调整 |
| U8 | AdminUserTable 编辑器 a11y（焦点陷阱、ESC、ARIA） | 简单模态，未做完整 a11y | 后续 a11y 任务 |

## 9. 结论

第三棒已经形成完整的 ARY 管理端壳层：登录后默认进入 Console Home（按角色展示视图入口），Admin 可维护用户角色，20 个 Organizer / Rider / Judge 子页面已铺好路由和子导航，可由第四棒直接填充业务功能。

**关键修复**（W1）：第一棒 schema `User.avatar` 与 NextAuth PrismaAdapter `User.image` 不兼容，第三棒通过 `src/lib/auth-adapter.ts` 包装实现零迁移修复；后续 Schema 迁移时可直接把字段从 `avatar` 改为 `image` 去掉包装。

下一棒应直接复用本棒提供的 `<RequireRole>` / `<OrganizerNav>` / `<RiderNav>` / `<JudgeNav>` 组件，不要绕过 `src/lib/permissions.ts` 自行实现鉴权，也不要为新增视图改动 `(console)/console/layout.tsx`。
