# ARY (Agent Racing Yard)

面向 Agentic Development 时代的智能体骑行赛事平台。通过赛事组织、过程展示、成果提交、评审总结和骑手档案，将开发者与 Coding Agent 协同完成任务的过程变成可观看、可评审、可复盘、可沉淀的能力资产。

## 技术栈

| 层 | 技术 |
|---|------|
| 全栈框架 | Next.js 14 (App Router) |
| 语言 | TypeScript 5.x |
| 数据库 | SQLite + Prisma ORM 5.x |
| 样式 | Tailwind CSS 3.x + shadcn/ui |
| 认证 | NextAuth.js v5 (GitHub Provider) |
| 图表 | Recharts |

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，填写 GitHub OAuth 的 GITHUB_ID 和 GITHUB_SECRET
# 生成 NEXTAUTH_SECRET: openssl rand -base64 32

# 3. 初始化数据库
npx prisma db push
npm run db:seed

# 4. 启动开发服务器
npm run dev
```

打开 http://localhost:3000

## Demo 账号（种子数据）

| 角色 | 用户名 | GitHub ID |
|------|--------|-----------|
| Admin | ARY Admin | 9999 |
| Organizer/Judge | Emma Liu | 1005 |
| Rider/Organizer | Alice Wang | 1001 |
| Rider/Judge | Carol Li | 1003 |
| Rider | Bob Zhang | 1002 |

> 种子数据包含 6 场赛事（completed/running/registration/judging/draft/archived），
> 完整的 CA 模拟 Session 数据、Projection、Reports 等。

## 部署 (Vercel)

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel

# 设置环境变量（在 Vercel Dashboard 或 CLI）
# DATABASE_URL, AUTH_SECRET, AUTH_GITHUB_ID, AUTH_GITHUB_SECRET, NEXT_PUBLIC_APP_URL
```

## 项目结构

```
ary/
├── src/
│   ├── app/
│   │   ├── (public)/        # 公开端
│   │   ├── (console)/       # 管理端 (Organizer/Rider/Judge/Admin/Screen)
│   │   ├── screen/          # 大屏展示
│   │   └── api/             # API 路由
│   ├── components/
│   │   ├── layout/          # 布局组件 (Header, Shell, Nav)
│   │   ├── screen/          # 大屏模式组件 (6种)
│   │   ├── live/            # Live Hall 组件
│   │   ├── home/            # 首页组件
│   │   ├── race/            # 赛事组件
│   │   ├── work/            # 作品组件
│   │   ├── rider/           # 骑手组件
│   │   └── ui/              # 基础 UI 组件
│   └── lib/                 # 工具库
├── prisma/                  # 数据模型 + 种子数据
├── docs/                    # 产品/技术文档
├── design-prototype/        # UX 高保真原型
└── PLAN.md / STATUS.md      # 项目进度看板
```

## 文档路由

| 文档 | 作用 |
| --- | --- |
| `docs/ary-mvp.prd.md` | 产品目标、MVP 范围、角色路径、产品验收口径 |
| `docs/ary-domain-analysis.v0.3.md` | 领域概念、核心对象、关系和不变量 |
| `docs/ary-mvp.ia.md` | 信息架构、页面层级、导航、页面状态 |
| `docs/ary-permission-matrix.md` | 资源动作级权限、角色范围和接口鉴权 |
| `docs/ary.plan.md` | 研发任务定义、工作域编号、任务产出 |
| `docs/ary-qa-plan.md` | 测试覆盖、回归要求和质量门 |
| `docs/ary-release-ops-plan.md` | 发布、监控、备份、值守和回滚 |
| `docs/ary-ca-integration-spec.md` | CA 接入契约草案 |
| `docs/team-relay-plan.md` | 五人接力开发方案
