# ARY MVP 五人接力开发方案

版本：v1.0
创建时间：2026-07-10
文档类型：团队协作开发计划
上游入口：`docs/ary.plan.md`、`docs/ary-mvp.prd.md`

---

# 1. 项目概述

## 1.1 项目定位

ARY (Agent Racing Yard) 是面向 Agentic Development 时代的智能体骑行赛事平台。它通过赛事组织、过程展示、成果提交、评审总结和骑手档案，将开发者与 Coding Agent 协同完成任务的过程变成可观看、可评审、可复盘、可沉淀的能力资产。

ARY MVP 的目标不是构建完整社区平台，而是**支撑第一场可复制的 Agent Racing 标杆赛**。

## 1.2 当前状态

- 文档基线基本完成（PRD、领域分析、信息架构、权限矩阵、QA 计划、发布运维计划）
- UX 高保真原型已产出（`design-prototype/` 目录，含 10 个高保真页面）
- **尚未有任何应用代码**——backend/ 和 data/ 目录为空骨架
- 需从零开始搭建全栈应用

## 1.3 评分重点

老师强调"评分重点在于驾驭 AI 完成"，核心含义：

1. **不是比谁手写代码多**，而是比谁能高效指挥 AI 产出正确、可用的代码
2. **需求拆解能力**：能把大任务拆成 AI 能理解的小任务
3. **Prompt 工程能力**：能写出高质量指令让 AI 一次产出接近目标
4. **审阅与纠偏能力**：能发现 AI 代码的问题并修正方向
5. **整合能力**：能把多个 AI 生成的片段组合成完整可运行系统

---

# 2. 推荐技术栈

考虑到"驾驭 AI"的评分重点，选择 AI 工具最擅长生成的成熟技术栈：

| 层 | 技术选择 | 版本 | 理由 |
|---|---------|------|------|
| 全栈框架 | **Next.js** (App Router) | 14.x | 前后端一体，AI 训练数据最丰富，社区成熟 |
| 语言 | **TypeScript** | 5.x | 类型安全，AI 生成的代码质量显著更高 |
| 数据库 | **SQLite + Prisma ORM** | Prisma 5.x | 零配置，已有 `data/ary.db`，Prisma schema 清晰可读 |
| 样式 | **Tailwind CSS** | 3.x | AI 生成 Tailwind 类名非常准确，与设计原型无缝对接 |
| 认证 | **NextAuth.js** (Auth.js) | 5.x | GitHub Provider 开箱即用，文档齐全 |
| UI 组件 | **shadcn/ui** | latest | 基于 Radix UI，AI 可准确生成，可定制 |
| 图表 | **Recharts** | 2.x | React 原生图表库，适合大屏展示 |
| 部署 | **Vercel** | - | 免费额度够用，一键部署，适合展示 |

---

# 3. 项目架构

## 3.1 目录结构

```
ary/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # 根布局
│   │   ├── page.tsx                  # 首页 / Race Gallery
│   │   ├── (public)/                 # 公开端路由组
│   │   │   ├── races/
│   │   │   │   └── [slug]/
│   │   │   │       ├── page.tsx      # 赛事详情页
│   │   │   │       ├── live/         # 实况大厅
│   │   │   │       ├── works/        # 作品列表
│   │   │   │       ├── results/      # 赛果榜单
│   │   │   │       └── review/       # 评审总结
│   │   │   ├── works/
│   │   │   │   └── [slug]/page.tsx   # 作品详情页
│   │   │   ├── riders/
│   │   │   │   └── [slug]/page.tsx   # 骑手档案
│   │   │   └── cooperation/
│   │   │       └── page.tsx          # 合作页
│   │   ├── (console)/                # 管理端路由组
│   │   │   └── console/
│   │   │       ├── page.tsx          # Console 入口
│   │   │       ├── races/
│   │   │       │   └── [slug]/
│   │   │       │       ├── organizer/  # Organizer View
│   │   │       │       ├── rider/       # Rider View
│   │   │       │       └── judge/       # Judge View
│   │   │       ├── admin/              # Admin Console
│   │   │       └── screen/             # Screen Console
│   │   └── api/                       # API 路由
│   │       ├── auth/                  # NextAuth 回调
│   │       ├── races/
│   │       ├── registrations/
│   │       ├── works/
│   │       ├── judging/
│   │       ├── awards/
│   │       ├── reports/
│   │       └── admin/
│   ├── components/                   # 共享组件
│   │   ├── ui/                       # shadcn/ui 基础组件
│   │   ├── layout/                   # 布局组件 (Header, Sidebar, Shell)
│   │   ├── race/                     # 赛事相关组件
│   │   ├── work/                     # 作品相关组件
│   │   ├── rider/                    # 骑手相关组件
│   │   └── screen/                   # 大屏相关组件
│   ├── lib/                          # 共享工具库
│   │   ├── db.ts                     # Prisma 客户端单例
│   │   ├── auth.ts                   # NextAuth 配置
│   │   ├── auth.config.ts            # NextAuth 选项
│   │   ├── permissions.ts            # 权限检查函数
│   │   ├── validators.ts             # Zod 校验 schema
│   │   └── utils.ts                  # 通用工具函数
│   ├── hooks/                        # 自定义 React Hooks
│   ├── types/                        # TypeScript 类型定义
│   └── prisma/
│       ├── schema.prisma             # 数据模型（核心！）
│       ├── seed.ts                   # 种子数据脚本
│       └── migrations/               # 数据库迁移
├── public/                           # 静态资源
│   └── assets/                       # logo、图片等
├── docs/                             # 已有文档（不动）
├── design-prototype/                 # 已有原型（参考用，不动）
├── .env.example                      # 环境变量模板
├── .env.local                        # 本地环境变量（gitignore）
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── HANDOFF.md                        # 接力说明（每棒更新）
```

## 3.2 数据模型核心关系

```
User ──roles──> [rider, judge, organizer, admin]

Race ──1:N──> Registration ──1:1──> RaceProject ──1:N──> CAConnection ──1:N──> Session
  │                │
  │                └──1:1──> Work ──1:N──> JudgeAssignment ──1:N──> JudgingRecord
  │                │
  │                └──1:N──> Award
  │                └──1:N──> Evidence
  │
  └──1:N──> Report
  └──1:N──> Announcement
  └──1:N──> Projection
```

---

# 4. 五人接力分工（细化版）

## 4.1 接力总览

| 顺序 | 负责人 | 任务标题 | 核心产出 | 输入依赖 | 建议耗时 |
|------|--------|---------|---------|---------|---------|
| 第1棒 | 同学A | 基础设施搭建 | 项目脚手架 + 数据模型 + 权限 + 种子数据 | 仅文档 | 2-3天 |
| 第2棒 | 同学B | 公开端全部页面 | Public Site 9个页面，mock数据驱动 | 第1棒产出 | 2-3天 |
| 第3棒 | 同学C | 登录 + Console框架 | GitHub登录 + Admin + Console壳 | 第2棒产出 | 2-3天 |
| 第4棒 | 同学D | 核心业务流程 | 报名/作品/评审/榜单完整链路 | 第3棒产出 | 3-4天 |
| 第5棒 | 同学E | 实况展示 + 联调 | Live Hall + 大屏 + Report + 收尾 | 第4棒产出 | 3-4天 |

## 4.2 第1棒：基础设施搭建（同学A）

### 目标
搭建项目骨架，确保后续所有人都能在统一基础上开发。**这是最关键的一棒**，数据模型一旦定错，后面全部返工。

### 具体任务清单

#### T1.1 项目初始化
- `npx create-next-app@latest ary --typescript --tailwind --eslint --app --src-dir`
- 安装依赖：`prisma @prisma/client next-auth@beta @auth/prisma-adapter zod bcryptjs`
- 安装 shadcn/ui：`npx shadcn-ui@latest init`
- 配置 `next.config.js`（允许 GitHub 头像域名等）
- 配置 `tailwind.config.ts`（扩展 ARY 品牌色：蓝白竞赛主题）
- 配置 `.env.example`（DATABASE_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, NEXTAUTH_SECRET, NEXTAUTH_URL）
- 确保 `npm run dev` 能启动

#### T1.2 Prisma 数据模型（最重要！）
根据 `docs/ary-domain-analysis.v0.3.md` 的 UML 类图和领域不变量，写出 `schema.prisma`：

**必须包含的模型（14个核心模型）：**

1. **User** — id, githubId, name, email, avatar, bio, school, company, roles (JSON数组/String数组), profileCompleted, createdAt, updatedAt
2. **Race** — id, slug, title, subtitle, description, challenge, rules, schedule (JSON), status (enum), visibility, organizerId (FK User), awardSettings (JSON), submissionRequirements (JSON), createdAt, updatedAt
3. **Registration** — id, userId (FK), raceId (FK), status (enum: submitted/approved/rejected/withdrawn), submittedAt, approvedAt, createdAt, updatedAt
   - @@unique([userId, raceId]) // 一个User对同一Race最多一个Registration
4. **RaceProject** — id, registrationId (FK, unique), aggregateIngestionStatus (enum), githubRepoUrl, lastSyncedAt, createdAt, updatedAt
5. **CAConnection** — id, raceProjectId (FK), caType (enum: codex/claude_code/other), ingestionSource, connectorId, connectorVersion, externalProjectRef, ingestionStatus (enum), registeredAt, handshakeAt, disabledAt, lastSyncedAt, createdAt
6. **Session** — id, caConnectionId (FK), summary (JSON), startedAt, endedAt, messageCount, toolCallCount, tokenCost, createdAt
7. **Work** — id, slug, registrationId (FK), title, description, demoUrl, githubUrl, videoUrl, techDescription, status (enum), visibility (enum), createdAt, updatedAt
8. **JudgeAssignment** — id, workId (FK), judgeId (FK User), assignedByUserId, assignedAt, createdAt
9. **JudgingRecord** — id, assignmentId (FK), scoreResult (Float), scoreRiding (Float), comments, status (enum), submittedAt, createdAt
10. **Award** — id, raceId (FK), registrationId (FK), workId (FK, optional), awardName, rank (Int), decisionReason, publishedAt, createdAt
    - @@unique([raceId, awardName, rank]) // 同Race同奖项名次唯一
    - @@unique([raceId, awardName, registrationId]) // 同Race同奖项名不重复授予
11. **Evidence** — id, registrationId (FK), type (enum), title, summary, sourceRef, visibility, createdAt
12. **Report** — id, raceId (FK), type (enum), status (enum), subjectRegistrationId (FK, optional), content, generatedAt, publishedAt, createdAt
13. **Projection** — id, raceId (FK), type (enum), data (JSON), lastRebuiltAt, createdAt
14. **Announcement** — id, raceId (FK), title, body, visibility, publishedAt, createdAt

**枚举值必须与文档完全一致**（见 `ary-domain-analysis.v0.3.md` 1.6 节）

#### T1.3 数据库初始化
- 运行 `npx prisma migrate dev --name init` 生成迁移
- 编写 `prisma/seed.ts`：至少包含 3 场不同状态的 Race、5 个 User（含 rider/judge/organizer/admin 不同角色）、样例 Registration、Works、Awards
- 参考 `design-prototype/data/sample-races.json` 的样例数据
- 确保 `npx prisma db seed` 能成功运行

#### T1.4 认证系统
- 配置 NextAuth.js v5 (Auth.js)：`src/lib/auth.ts` 和 `src/lib/auth.config.ts`
- GitHub Provider 配置，回调页面 `/api/auth/callback/github`
- 登录后自动创建/更新 User 记录
- 中间件 `src/middleware.ts`：保护 `/console/*` 路由
- Session 中携带 User.roles

#### T1.5 权限基础设施
- `src/lib/permissions.ts`：实现基于角色的权限检查函数
  - `requireRole(roles: string[])` — 检查当前用户是否拥有指定角色
  - `requireOrganizerOfRace(raceId)` — 检查是否为赛事主办方
  - `requireOwnRegistration(userId)` — 检查是否为本人资源
  - `requireJudgeAssignment(judgeId)` — 检查是否为分配的评委
- 权限矩阵完全对齐 `docs/ary-permission-matrix.md`

#### T1.6 API 框架
- 创建 API 路由骨架（每个文件只需返回 `{ message: "not implemented" }`）：
  - `/api/races/` — GET 列表, POST 创建
  - `/api/races/[id]/` — GET/PUT 单个赛事
  - `/api/registrations/` — POST 提交报名
  - `/api/registrations/[id]/` — PUT 审核
  - `/api/works/` — POST 创建作品
  - `/api/works/[id]/` — GET/PUT 单个作品
  - `/api/admin/users/` — GET 用户列表, PUT 更新 roles
  - 等等

#### T1.7 共享组件（最小集）
- `src/components/layout/Header.tsx` — 公开端导航栏（Races / Works / Riders / Cooperation + Login）
- `src/components/layout/Footer.tsx` — 页脚
- `src/components/ui/` — shadcn/ui 已安装的基础组件

#### T1.8 HANDOFF.md 编写
说明以下内容：
- 如何启动项目（`npm install`, `cp .env.example .env.local`, 填环境变量, `npx prisma migrate dev`, `npx prisma db seed`, `npm run dev`）
- 数据模型 ER 简图
- 已有哪些 API 路由（骨架还是已实现）
- 已知问题和待完善点

### 同学A 的 AI 协作要点
- **写 schema.prisma 时**，把 `ary-domain-analysis.v0.3.md` 的 UML 类图部分贴给 AI，让它对照生成 Prisma schema
- **写权限中间件时**，把 `ary-permission-matrix.md` 的完整矩阵贴给 AI
- **写种子数据时**，把 `sample-races.json` 贴给 AI 让它转换
- 关键验证：跑通 `prisma migrate dev` 和 `npm run dev` 确认无报错

---

## 4.3 第2棒：公开端页面（同学B）

### 目标
完成 Public Site 全部页面，使用种子数据/mock数据渲染，**不依赖后端 API**。第2棒结束时，任何人都能打开浏览器看到完整的 ARY 公开端。

### 依赖
- 第1棒的 schema.prisma（用于类型定义）
- 第1棒的种子数据结构
- `design-prototype/` 中的原型（HTML/CSS/JS，参考视觉和交互）
- `docs/ary-mvp.ia.md`（页面信息架构和 URL 结构）

### 具体任务清单

#### T2.1 页面数据层
- 创建 `src/lib/data-access.ts`：封装 Prisma 查询（`getRaces`, `getRaceBySlug`, `getWorks`, `getWorkBySlug`, `getRiderBySlug`, `getResults`, `getReview` 等）
- 先全部用 `seed.ts` 中的静态数据或直接在 Server Component 中 import Prisma 查询
- 注意：公开端只查公开数据（visible/published 过滤）

#### T2.2 首页 / Race Gallery (`/`)
**参考原型**：`design-prototype/index.html` 的 Home 部分

核心模块（按 IA 规范）：
- **Hero / Featured Races**：居中赛事标题 → 下划线式 Live Race 切换器 → 赛题 → 指标（参赛人数、作品数）和主 CTA
- **右侧 Drawer（Rail 默认收起）**：Open Registration、Latest Results、Past Races、Cooperation
- **Featured Works**：精选作品卡片
- **Featured Riders**：优秀骑手卡片
- **Past Races**：往届赛事列表
- **CTA 区**：报名 / 办赛 / 赞助 / 合作

交互要求：
- Live Race 切换器点击可切换不同 live Race（如有多场），Hero 内容随之更新
- 右侧 Drawer 点击 Rail 滑出，点击外部收起
- Live Race 切换器自动轮播（可选，加分项）

#### T2.3 赛事详情页 (`/races/[slug]`)
**参考 IA**：`docs/ary-mvp.ia.md` 7.2 节

根据赛事状态展示不同内容：
- **报名中**：Hero → 赛题说明 → 为什么参加 → 赛程 → 交付要求 → 评审标准 → 奖项 → 报名 CTA
- **进行中**：Live Hall 入口 → 当前阶段 → 活跃骑手 → 进度看板 → 当前榜单 → 公告
- **评审中**：已提交作品 → 评审进度 → 评委阵容 → 结果公布时间
- **已结束**：获奖名单 → 最终排行榜 → 优秀作品 → 评审总结 → 优秀骑手 → 下一场 CTA

内部导航（Tab 切换或锚点）：
- Overview / Rules / Live / Riders / Works / Results / Review

#### T2.4 实况大厅 (`/races/[slug]/live`)
- 赛事状态横幅（Race Status Banner）
- 阶段进度条
- 关键指标卡片（参赛人数、活跃骑手、已提交作品、平均进度、总成本、高风险数）
- 骑手活动动态流
- 当前过程榜单
- 大屏入口链接

#### T2.5 作品列表 (`/races/[slug]/works`) + 作品详情 (`/works/[slug]`)
- 作品卡片网格：作品名、作者、亮点、Demo入口、奖项标识
- 筛选/排序
- 作品详情页：作品概览、Demo/视频、问题定义、解决方案、技术方案、骑行摘要、评委点评、作者信息

#### T2.6 赛果页 (`/races/[slug]/results`)
- 赛事结果摘要
- 奖项榜单（分组展示）：总成绩榜、最佳作品、最佳 Agent Rider、最佳纠偏、最佳成本控制、最佳复盘
- 获奖作品展示
- 骑行能力亮点
- 评审总结入口

#### T2.7 骑手档案 (`/riders/[slug]`)
- 基础信息：姓名、学校/单位
- 参赛记录：参加过的赛事列表
- 作品记录：提交过的作品
- 获奖记录：获得的奖项
- Agent Riding Skill 标签
- 骑行数据摘要（成本/进度/风险表现）
- 能力证据

#### T2.8 评审总结 (`/races/[slug]/review`)
- 评审总结文本
- 获奖说明
- 典型案例
- 评委观点
- 下一场建议

#### T2.9 Cooperation (`/cooperation`)
- 什么是 ARY
- 什么是 Agent Riding Skill
- 如何参赛 / 如何办赛 / 如何赞助
- 联系合作

#### T2.10 响应式适配
- 桌面端 1920x1080 为主视口
- 移动端关键页面适配（首页、Race Page、Work Page）
- 蓝白竞赛视觉风格（参考原型 CSS 变量）

### 同学B 的 AI 协作要点
- **每个页面**，先把 IA 文档中对应的页面结构贴给 AI，让它生成布局骨架
- **视觉风格**，把 `design-prototype/styles.css` 贴给 AI，让它提取品牌色、间距、排版规则
- **样例数据**，把 `sample-races.json` 的结构告诉 AI，让页面使用正确的字段名
- 使用 Server Component 直接查 Prisma，避免 "use client" 范围过大
- 页面模块化：每个模块（HeroCard, WorkCard, RiderCard, Drawer 等）单独成组件

---

## 4.4 第3棒：登录 + Console 框架（同学C）

### 目标
打通 GitHub 登录链路，完成 Admin Console，搭建 Race Console 的整体框架（Shell + 路由 + 视图骨架）。

### 依赖
- 第1棒的认证基础设施（NextAuth 配置、Prisma schema）
- 第2棒的公开端页面（Header 需要显示登录状态）

### 具体任务清单

#### T3.1 登录功能完善
- 验证 GitHub OAuth 登录流程（如果第1棒有 bug，修复）
- 登录回调页面：首次登录引导补全资料
- 用户资料补全页面 (`/console/profile/complete`)：
  - 显示名称、学校/单位、个人简介
  - 表单提交后更新 User.profileCompleted = true
- 登出功能
- Header 的登录态切换（未登录: Login 按钮 + 公开导航；已登录: 头像 + Console Entry）
- Session 中携带用户完整信息（roles, profileCompleted）

#### T3.2 Admin Console (`/console/admin`)
- 用户列表页：展示所有 ARY User（GitHub 名、显示名、资料状态、角色、最近登录时间）
- 用户详情/角色编辑：Admin 可以给用户添加/移除 rider、judge、organizer、admin 角色
- 权限守卫：仅 admin role 可访问
- API 路由：
  - `GET /api/admin/users` — 用户列表（分页）
  - `PUT /api/admin/users/[id]/roles` — 更新用户角色

#### T3.3 Console Shell 框架
- `src/components/layout/ConsoleShell.tsx`：
  - 左侧边栏（根据 role 展示不同菜单项）
  - 顶部栏（当前用户信息、当前 Race 上下文、退出按钮）
  - 主内容区
- 路由结构：
  - `/console` — Console Home，根据 roles 展示可进入的视图卡片
  - `/console/races/[slug]/organizer/*` — Organizer View
  - `/console/races/[slug]/rider/*` — Rider View
  - `/console/races/[slug]/judge/*` — Judge View
  - `/console/admin/*` — Admin Console
  - `/console/screen/*` — Screen Console（入口占位）

#### T3.4 角色路由守卫
- 中间件 `src/middleware.ts` 增强：
  - `/console/admin/*` → 需要 admin role
  - `/console/races/[slug]/organizer/*` → 需要 organizer role + managed race 检查
  - `/console/races/[slug]/rider/*` → 需要 rider role + own registration 检查
  - `/console/races/[slug]/judge/*` → 需要 judge role + assignment 检查
- 页面级守卫组件 `RequireRole`：
  ```tsx
  <RequireRole roles={['admin']} fallback={<AccessDenied />}>
    <AdminContent />
  </RequireRole>
  ```

#### T3.5 视图骨架页面（占位）
每个视图先创建空白页面，只有标题和占位内容，确保路由和导航正常工作：

**Organizer View 占位页面**（共11个）：
- `/console/races/[slug]/organizer/` — Overview
- `/console/races/[slug]/organizer/settings` — Race Settings
- `/console/races/[slug]/organizer/registrations` — 报名管理
- `/console/races/[slug]/organizer/riders` — 选手管理
- `/console/races/[slug]/organizer/ca-status` — CA 状态
- `/console/races/[slug]/organizer/works` — 作品管理
- `/console/races/[slug]/organizer/judges` — 评委分配
- `/console/races/[slug]/organizer/judging` — 评审进度
- `/console/races/[slug]/organizer/awards` — 奖项榜单
- `/console/races/[slug]/organizer/reports` — 报告
- `/console/races/[slug]/organizer/maintenance` — 内部维护

**Rider View 占位页面**（共6个）：
- `/console/races/[slug]/rider/` — Registration Status
- `/console/races/[slug]/rider/ca-setup` — CA Setup
- `/console/races/[slug]/rider/riding` — Riding Status
- `/console/races/[slug]/rider/submission` — Work Submission
- `/console/races/[slug]/rider/review` — Review Result
- `/console/races/[slug]/rider/report` — Rider Report

**Judge View 占位页面**（共3个）：
- `/console/races/[slug]/judge/assigned` — Assigned Works
- `/console/races/[slug]/judge/reviewing` — Reviewing
- `/console/races/[slug]/judge/submitted` — Submitted Reviews

#### T3.6 Admin Console 页面完善
- 用户列表（表格：头像、GitHub ID、名称、角色标签、资料状态、操作）
- 角色编辑弹窗/抽屉（复选框：rider, judge, organizer, admin）

### 同学C 的 AI 协作要点
- **NextAuth 问题**：NextAuth v5 (Auth.js) 的 API 变化大，遇到报错直接把错误信息贴给 AI 让它修复
- **路由守卫**：先写好需求描述（"管理员才能访问 /console/admin，否则重定向到403页面"），让 AI 生成中间件代码
- **Console Shell**：给 AI 一个 ASCII 草图描述侧边栏+内容区布局，让它生成 Tailwind 代码

---

## 4.5 第4棒：核心业务流程（同学D）

### 目标
实现 ARY 的核心业务闭环：赛事管理 → 报名审核 → 作品提交 → 评委评审 → 榜单发布。这是**业务逻辑最密集**的一棒。

### 依赖
- 第3棒的 Console Shell 框架（在空白页面上填内容）
- 第1棒的权限系统
- 完整的 Prisma schema

### 具体任务清单

#### T4.1 Organizer View 功能实现

**Race Settings（赛事设置）**：
- 创建赛事表单：标题、slug（自动生成）、描述、赛题、规则、赛程（开始时间、报名截止、提交截止、评审截止、结束时间）、奖项设置、提交要求
- 编辑赛事（draft/published 状态的赛事）
- 发布/撤回/归档赛事
- 赛事发布后生成公开 slug
- API: `POST/PUT /api/races`, `PUT /api/races/[id]/publish`, `PUT /api/races/[id]/archive`

**Registrations（报名管理）**：
- 报名列表：展示所有报名记录，按状态筛选（submitted/approved/rejected/withdrawn）
- 审核操作：通过/拒绝，填写审核备注
- 批量审核
- API: `GET /api/races/[id]/registrations`, `PUT /api/registrations/[id]/approve`, `PUT /api/registrations/[id]/reject`

**Riders（选手管理）**：
- 选手名册：所有 approved 选手列表
- 每个选手显示：User 信息、CA 接入状态、作品状态、风险提示
- 点击进入选手详情

**CA Status（CA 接入状态）**：
- RaceProject 聚合接入健康度总览：not_configured / connected / active / failed 各多少人
- 单个选手的 CAConnection 列表和状态
- 接入异常标记

**Works Management（作品管理）**：
- 已提交作品列表
- 作品详情查看
- 锁定/解锁/隐藏/发布作品
- API: `PUT /api/works/[id]/lock`, `PUT /api/works/[id]/hide`

**Judges（评委分配）**：
- 评委列表管理（从拥有 judge role 的 User 中选择）
- 将作品分配给评委（一对一或一对多）
- 已分配关系展示
- API: `POST /api/judge-assignments`, `DELETE /api/judge-assignments/[id]`

**Judging Progress（评审进度）**：
- 评审完成率概览
- 每个评委的评审进度
- 未提交评审的提醒

**Awards（奖项榜单）**：
- 榜单草稿：为每个奖项类别（总成绩榜、最佳作品、最佳 Agent Rider、最佳纠偏、最佳成本控制、最佳复盘）设置排名
- 关联获奖 Registration 和 Work
- 发布/撤回榜单
- API: `POST/PUT /api/awards`, `PUT /api/awards/publish`

#### T4.2 Rider View 功能实现

**Registration Status（报名状态）**：
- 显示当前报名状态和审核结果
- 报名按钮（公开 Race 报名中状态）
- 关键时间节点展示

**RaceProject 自动生成**：
- Registration approved 后**幂等生成** RaceProject（检查是否已存在）
- 关联 GitHub Repo 输入
- API: 在 approve Registration 时自动触发

**CA Setup（CA 接入配置）**：
- 新增 CAConnection：选择 CA 类型（claude_code/codex/other）、输入 connector ID、外部 Project 引用
- CAConnection 列表：显示状态（not_configured/connected/active/failed）
- 登记和握手的 UI 流程
- API: `POST /api/race-projects/[id]/ca-connections`, `PUT /api/ca-connections/[id]`

**Riding Status（骑行状态）**：
- CA 接入健康度指示
- 成本/进度/风险指标展示
- Session 摘要列表
- 证据缺口提示（CA 未配置或无数据时）

**Work Submission（作品提交）**：
- 作品表单：标题、简介、Demo 链接、GitHub 链接、演示视频、技术说明
- 草稿保存/提交
- 提交后不可编辑（除非 Organizer 解锁）
- API: `POST /api/works`, `PUT /api/works/[id]`

**Review Result（评审结果查看）**：
- 评分和评语展示
- 获奖信息

#### T4.3 Judge View 功能实现

**Assigned Works（分配作品列表）**：
- 显示分配给当前 Judge 的所有作品
- 每个作品显示：名称、作者、提交时间、评审状态

**Reviewing（评审表单）**：
- 作品详情查看
- 骑行摘要查看
- 评分表单：作品结果评分（scoreResult，1-10分）、骑行能力评分（scoreRiding，1-10分）、评语
- 提交评审
- API: `POST /api/judging-records`, `PUT /api/judging-records/[id]`

**Submitted Reviews（已提交评审）**：
- 已提交评审列表
- 查看已提交的评分和评语
- 在允许的时间窗口内修改

#### T4.4 业务逻辑关键约束
- Registration approved 后必须幂等生成 RaceProject（检查已有则跳过）
- CA 接入状态不影响作品提交（仅做风险提示）
- Works 提交/锁定状态机正确
- 权限检查在每个 API 路由中执行
- 所有操作写入日志/有时间戳

### 同学D 的 AI 协作要点
- **表单**：把需要的字段列给 AI，加上 Zod 校验，让 AI 生成 React Hook Form + Zod 的完整表单
- **状态机**：把状态转换规则（如 Registration: submitted→approved/rejected）告诉 AI，让它生成正确的数据库操作
- **幂等性**：特别告诉 AI "Registration approved 时，先查是否已有 RaceProject，有则跳过"，避免重复创建
- **评审前风险提示**：把 Review Flag 的 6 种情况（空骑行、无 CA 数据、空作品、缺必填材料、疑似违规、接入异常）列给 AI，让它生成检查函数

---

## 4.6 第5棒：实况展示 + 收尾联调（同学E）

### 目标
实现 ARY 的核心差异化能力——CA 数据模拟接入、Live Hall 实况展示、大屏展示，以及整体联调、bug 修复、演示准备。

### 依赖
- 第4棒完成的业务数据（有真实的 Registration/Work/JudgingRecord/Award 数据）
- 第2棒的 Live Hall 前端框架

### 具体任务清单

#### T5.1 CA 数据模拟接入
MVP 阶段不接入真实 CA（Claude Code/Codex），而是**模拟 CA 数据源**：

- 创建 `src/lib/ca-mock.ts`：生成模拟的骑行 Session 数据
  - 模拟 Session：startedAt, endedAt, messageCount, toolCallCount, tokenCost
  - 模拟 RidingMetrics：costSummary, progressSummary, riskSummary, skillSummary
- 创建定时任务脚本（或手动触发）：
  - `POST /api/internal/ca-mock/ingest` — 为活跃的 CAConnection 生成模拟数据
  - 每次调用生成 1-3 条新 Session，更新指标
- CA 接入状态变更模拟：not_configured → connected → active

#### T5.2 Projection 生成
- `src/lib/projections.ts`：
  - `generateRaceProgressProjection(raceId)` — 赛事整体进度
  - `generateCostProjection(raceId)` — 成本统计
  - `generateRiskProjection(raceId)` — 风险统计
  - `generateCurrentLeaderboardProjection(raceId)` — 过程榜单
  - `generateScreenFeedProjection(raceId)` — 大屏 feed
- API: `POST /api/internal/projections/rebuild` — 手动触发重算
- Projection 数据存储到 Projection 表
- Projection 失败不影响源数据

#### T5.3 Live Hall 功能实现 (`/races/[slug]/live`)
- 实时刷新（轮询或 Server-Sent Events，MVP 用 5 秒轮询）
- 展示内容：
  - 当前参赛人数 / 活跃骑手数
  - 已启动 Session 数 / 已提交作品数
  - 平均进度 / 总 token/cost 消耗
  - 高风险骑手数
  - 骑手动态事件流（最近 20 条）
  - 当前过程榜单
- 数据全部来自 Projection，不直接读原始 Session

#### T5.4 Screen Console (`/console/screen`)
- 赛事选择器
- 显示模式切换：Jumbotron / Billboard / Live / Leaderboard / Works / Announcement
- 主题/校准设置（基本版）
- 全屏按钮

#### T5.5 Screen Display（大屏展示视图）
- Jumbotron 模式：大标题 + 关键数字 + 赛事状态，远距离可读
- Billboard 模式：信息看板，榜单 + 公告 + 状态
- Live 模式：实时骑手动态 feed + 进度条
- Leaderboard 模式：当前榜单（大字号）
- Works 模式：精选作品轮播
- Announcement 模式：公告展示
- Fallback 处理：Projection 失败时显示最近一次成功数据或静态公告

#### T5.6 Report 生成
- `src/lib/report-generator.ts`：
  - `generateRiderReport(registrationId)` — 生成选手报告
  - `generateRaceReport(raceId)` — 生成赛事报告
  - `generateReviewSummary(raceId)` — 生成评审总结
- 报告内容：汇总 JudgingRecord、Award、Evidence、RidingMetrics
- Report 状态机：draft → generated → reviewed → published
- 未发布 Report 不出现在公开端
- 手动重跑/编辑后发布

#### T5.7 全局联调
- 从头走通完整用户路径：
  1. 公开访问 → 浏览首页 → 进入赛事 → 查看实况/作品/赛果
  2. GitHub 登录 → 补全资料 → Admin 分配角色
  3. Organizer 创建赛事 → 发布 → 审核报名
  4. Rider 报名 → 接入 CA → 提交作品
  5. Organizer 分配评委 → Judge 评分
  6. Organizer 发布榜单 → 公众查看赛果
  7. 大屏展示实况和榜单
- 修复所有发现的 bug
- 权限校验全路径测试

#### T5.8 种子数据增强
- 基于完整业务流程，更新 `prisma/seed.ts`，确保种子数据能支撑完整 demo
- 至少有一场"已完成"赛事（有完整数据：报名→作品→评审→榜单→报告）
- 至少有一场"进行中"赛事（有活跃数据和 Projection）

#### T5.9 部署准备
- Vercel 部署配置
- 环境变量整理
- README 更新（部署说明）

### 同学E 的 AI 协作要点
- **模拟数据**：告诉 AI "生成 20 条模拟 CA Session，tokenCost 在 1000-50000 之间按正态分布"，让它写模拟逻辑
- **大屏 CSS**：大屏对布局要求高，给 AI 明确的视口尺寸（如 1920x1080）和字号要求（最小 24px），让它适配
- **错误处理**：给 AI 所有可能的异常情况（Projection 失败、无数据、网络断开），让它为每个异常写 fallback UI

---

# 5. 驾驭 AI 实战指南

## 5.1 核心原则

老师说"评分的重点在于驾驭 AI"。这句话的含义是：

> **不是看谁写了多少行代码，而是看谁能让 AI 准确地、高效地产出正确的代码，并能在 AI 偏离方向时及时纠偏。**

## 5.2 AI 偏离方向的 6 种常见情况与对策

### 情况1：AI 自己发明需求
**表现**：AI 在你的需求之外加了一堆"锦上添花"的功能，比如你要一个列表，它给你加了搜索、排序、分页、导出 Excel。

**对策**：
- Prompt 中明确写："只做我要求的功能，不要添加任何我未提及的能力"
- 发现后立即说："你添加了 A、B、C 功能，这些不是我要求的，请移除，只保留 D"
- 不要忍——发现偏离立刻纠正，积少成多后面全乱

### 情况2：AI 使用了错误的技术或过时 API
**表现**：AI 用了 v4 的 NextAuth 语法（但项目装的是 v5）、用了 Pages Router（但项目是 App Router）。

**对策**：
- Prompt 开头注明技术栈和版本："本项目使用 Next.js 14 App Router + TypeScript + NextAuth v5 + Prisma"
- 如果 AI 写错了，直接粘贴报错信息让它修复
- 第1棒同学要在 `HANDOFF.md` 中明确列出所有依赖的版本号

### 情况3：AI 忽略了项目已有的代码规范
**表现**：AI 创建了新的组件，但命名方式、文件路径、import 顺序与现有代码不一致。

**对策**：
- Prompt 中附上一个已有组件的完整代码作为"参考样本"
- 发现不一致时说："请按照 src/components/race/RaceCard.tsx 的风格重写，保持一致的 import 顺序、命名和导出方式"

### 情况4：AI 生成了看似正确但逻辑有 bug 的代码
**表现**：权限检查漏了边界条件、状态机跳过了某个状态、数据查询漏了过滤条件。

**对策**：
- 对照文档中的约束逐条检查（如"Registration approved 后才生成 RaceProject"）
- 发现逻辑错误时，不要自己默默改，而是告诉 AI："这里缺少了对 XXX 情况的处理，请补充。具体来说，当 YYY 时应该 ZZZ"
- 对于权限相关的代码，必须对照 `ary-permission-matrix.md` 逐行检查

### 情况5：AI 生成的前端与设计原型差距大
**表现**：AI 写的 Tailwind 代码页面看起来和设计原型完全不一个风格。

**对策**：
- 把 `design-prototype/styles.css` 的 CSS 变量和关键组件样式贴给 AI
- 把原型的截图描述告诉 AI："蓝白配色、赛道视觉、玻璃卡效果、高密度信息布局"
- 给出具体的颜色值：主色 #1E3A5F（深蓝）、辅色 #F0F4F8（浅蓝灰）、强调色 #3B82F6

### 情况6：AI 生成代码后不验证、直接说"完成"
**表现**：AI 说做完了，但代码有 TypeScript 报错、import 路径不存在、引用了不存在的组件。

**对策**：
- 每个功能完成后，必须跑 `npm run build` 或 `npx tsc --noEmit` 检查类型
- 在浏览器中实际打开页面走一遍交互
- 把报错信息直接贴给 AI 让它修

## 5.3 高质量 Prompt 模板

### 模板1：新功能开发
```
【技术栈】Next.js 14 App Router, TypeScript, Prisma, Tailwind CSS, shadcn/ui
【需求】[一句话描述功能]
【页面/路由】[文件路径]
【输入数据】[数据来源和字段]
【输出/行为】[用户看到什么、可以做什么]
【约束】[不做的事、特殊规则]
【参考文件】[已有相似功能的文件路径]
请生成完整代码。
```

### 模板2：Bug 修复
```
【环境】Next.js 14 App Router, TypeScript, [相关依赖版本]
【现象】[描述 bug，截图或报错信息]
【复现步骤】[1. 2. 3.]
【期望行为】[应该怎样]
【相关文件】[涉及的文件路径]
请分析原因并给出修复方案。
```

### 模板3：代码审查
```
请审查以下代码：
- 是否有逻辑错误（对照规则：[粘贴业务规则]）
- 权限检查是否完整
- 错误处理是否覆盖
- 是否有 TypeScript 类型问题
[粘贴代码]
```

## 5.4 每棒检查清单

在交给下一棒之前，确认以下全部通过：

- [ ] `npm run build` 无报错（TypeScript + ESLint）
- [ ] `npm run dev` 正常启动
- [ ] `npx prisma migrate dev` 能正常运行
- [ ] 所有新增页面在浏览器中能渲染（内容可以不全，但不能白屏/500）
- [ ] `HANDOFF.md` 已更新本次产出
- [ ] 代码已 commit（清晰的 commit message）
- [ ] 种子数据可通过 `npx prisma db seed` 重新填充

---

# 6. 接力规则

## 6.1 代码交接
1. **第N棒完成后 commit + push**，确保远程仓库有最新代码
2. **第N+1棒 clone/pull 后先跑 `npm install && npx prisma migrate dev && npx prisma db seed && npm run dev`**，确认能跑起来再开始
3. **如果跑不起来，立即联系上一棒同学修复**，不要在坏基础上继续开发

## 6.2 沟通要求
1. 每棒完成后在群内发消息："第X棒完成，已 push，HANDOFF.md 已更新"
2. 遇到不确定的需求（文档有歧义），先群内讨论达成共识再写代码
3. 发现上一棒的 bug，修复后告知上一棒同学（帮助互相学习）

## 6.3 HANDOFF.md 模板

```markdown
# 第X棒接力说明

## 完成时间
YYYY-MM-DD

## 负责人
同学X

## 本次产出
- [ ] 功能A（已完成 / 部分完成）
- [ ] 功能B
- ...

## 如何运行
1. git clone ...
2. cp .env.example .env.local
3. 填写环境变量（需要 GitHub OAuth App 的 Client ID 和 Secret）
4. npm install
5. npx prisma migrate dev
6. npx prisma db seed
7. npm run dev

## 新增/修改的文件
- src/app/xxx/page.tsx — XXX页面
- src/lib/xxx.ts — XXX功能
- ...

## API 路由列表
| 方法 | 路径 | 状态 | 说明 |
|------|------|------|------|
| GET | /api/races | 已完成 | 获取公开赛事列表 |
| POST | /api/races | 骨架 | 创建赛事（待第4棒实现） |
| ... | ... | ... | ... |

## 已知问题
- [ ] 问题A的描述
- [ ] 问题B的描述

## 给下一棒的建议
- 建议先看 XXX 文件了解数据结构
- YYY 页面的交互可以参考原型 ZZZ
- 注意 AAA 的权限需要特殊处理
```

---

# 7. 时间规划建议

| 阶段 | 内容 | 建议时间 |
|------|------|---------|
| 准备 | 全组一起通读文档，对齐理解 | 半天 |
| 第1棒 | 基础设施 + 数据模型 | 2-3天 |
| 第1棒 Review | 全组一起 review schema.prisma | 1小时 |
| 第2棒 | 公开端全部页面 | 2-3天 |
| 第3棒 | 登录 + Console 框架 | 2-3天 |
| 第4棒 | 核心业务流程 | 3-4天 |
| 第5棒 | 实况展示 + 联调收尾 | 3-4天 |
| 缓冲 | Bug 修复 + 演示准备 | 1-2天 |
| **合计** | | **约 2-3 周** |

---

# 8. 风险与应对

| 风险 | 概率 | 影响 | 应对 |
|------|------|------|------|
| 第1棒 schema 设计有缺陷 | 中 | 高 | 全组一起 review schema.prisma 后再进入第2棒 |
| 某棒同学进度严重落后 | 中 | 高 | 其他同学提前熟悉前后棒内容，必要时并行帮忙 |
| AI 生成代码质量不稳定 | 高 | 中 | 严格走"生成→审查→修正"循环，不盲目信任 |
| 集成时出现大量冲突 | 中 | 中 | 每棒都基于上棒最新代码，及时 pull |
| 时间不够，部分功能做不完 | 中 | 中 | P0 功能优先，P1/P2 可展示 mock 状态 |

---

# 9. 参考资料索引

| 文档 | 路径 | 用途 |
|------|------|------|
| 产品需求 | `docs/ary-mvp.prd.md` | 理解产品目标和验收标准 |
| 信息架构 | `docs/ary-mvp.ia.md` | 页面结构、导航、URL 设计 |
| 领域模型 | `docs/ary-domain-analysis.v0.3.md` | 数据模型设计依据 |
| 权限矩阵 | `docs/ary-permission-matrix.md` | API 鉴权规则 |
| 开发任务 | `docs/ary.plan.md` | DEV-1 到 DEV-7 任务定义 |
| 高保真原型 | `design-prototype/index.html` | 前端视觉和交互参考 |
| 样例数据 | `design-prototype/data/sample-races.json` | 种子数据参考 |
| 近期窗口 | `PLAN.md` | 当前阶段和近期里程碑 |
| 任务看板 | `STATUS.md` | 当前任务状态 |
