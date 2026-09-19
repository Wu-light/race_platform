# ARY 项目总任务总结与当前进度

## 1. 总任务目标

### 核心目标
- 支撑第一场 Agent Racing 标杆赛完整举办。
- 让公众能够最短路径看到赛事、赛况、作品、赛果和优秀骑手。
- 让选手能够完成报名、接入 CA 数据、提交成果、查看报告。
- 让评委能够查看作品、参考骑行过程、完成评分和评语。
- 让主办方能够创建赛事、管理报名、发布赛果、生成总结。
- 让赛事沉淀为案例资产、课程资产、能力资产和商业展示资产。

### 用户价值目标
- 学生/开发者：获得真实 Agentic Development 实战机会，通过赛事证明 Agent Riding Skill，形成作品集和评价证据。
- 老师/主办方：实时观察进度、风险和问题，形成课程复盘和能力评价。
- 企业/赞助方：看到真实开发能力和 AI 协同开发效果。
- 公众/社区：观看正在发生的赛事，理解 Agent Riding Skill 的价值。

## 2. 评价标准

### 产品级验收标准（来自 `docs/ary-mvp.prd.md`）
- 赛事闭环：主办方可创建发布赛事，用户可 GitHub 登录并补全资料，选手可报名并进入 Rider View，完成实时 CA 接入和成果提交，评委可评分提交评语，主办方可发布榜单，公众可查看赛果与评审总结。
- Gallery-first：首页以赛事展示为主体，公众用户 2 次点击内能进入主推赛事、Live Hall、优秀作品和赛果。
- Riding Intelligence：Registration approved 后幂等生成 RaceProject，参赛过程中登记 CAConnection，接入已握手 CA 生成基础骑行数据，识别空骑行/无 CA/缺材料/异常风险，生成成本进度风险指标，控制 Evidence 可见性，支持骑行摘要与基础报告。
- 资产沉淀：赛事结束后有公开 Race Page、赛果页、Work Page、Rider Profile，主办方可发布赛事总结，部分作品形成案例资产。

### 工程与可用性要求
- 公开页首屏响应目标：1s 内。
- Live Hall 数据刷新目标：3s 内。
- Screen Console 等页面切换首屏加载目标：1s 内。
- MVP 应支持同时在线 200 用户访问公开端、Live Hall、Results、Works、Rider Profile。
- 单个选手 CA 接入失败或空骑行不应影响赛事公开展示与大屏稳定性。

### 任务与里程碑
- `PLAN.md` 定义近期窗口：`UX 高保真原型评审`、`报名 / CA 参赛语义整改`。
- `docs/ary.plan.md` 定义长期任务与验收：`PRD-1`、`UX-1`、`DEV-1`、`DEV-2`、`DEV-3`、`DEV-4`、`DEV-5`、`REL-1`、`OPS-1`。
- `STATUS.md` 记录当前瞬时状态和风险。

## 3. 当前任务完成进度

### 当前阶段结论
- 项目当前处于 MVP 文档基线与架构前准备阶段。
- 文档已集中到 `docs/`，并且已有设计原型 `design-prototype/`。
- 现在的重点是让 `UX-1` 高保真原型和 `PRD-TEMP-1` 语义整改获得复审通过，之后才进入 `DEV-1` 架构设计。

### 主要任务状态（来自 `STATUS.md`）
- `PRD-1`：进行中，文档基线校准中。
- `PRD-TEMP-1`：待复审，首轮整改已完成。
- `UX-1`：进行中，高保真原型已产出但尚未验收。
- `DEV-1`：暂缓，等待高保真原型输入。
- `DEV-5`：细化中，CA 接入与投影规则正在讨论。
- `REL-1` / `OPS-1`：待开始。

### 你当前负责的任务
- 你是“第1棒同学A”，你负责基础设施搭建：项目初始化、数据模型、权限、认证、种子数据、API 骨架、共享组件、HANDOFF 文档等。
- 当前仓库中已经包含很多第1棒产物：`package.json`、`prisma/schema.prisma`、`prisma/seed.ts`、`src/lib/auth*`、`src/lib/permissions.ts`、`src/app/api/auth/[...nextauth]/route.ts`、`src/components/layout/Header.tsx`、`src/components/layout/Footer.tsx`、`src/app/page.tsx`、`src/app/login/page.tsx`、`src/app/(public)/cooperation/page.tsx` 等。

### 已完成 / 已实现证据
- `docs/team-relay-plan.md` 与 `docs/conversation-transcript.md` 明确你是第1棒负责人。
- `HANDOFF.md` 已写明本次产出与运行说明。
- 主站首页、公开页面、登录页、Console 入口、Cooperation 页已有基本实现。
- 部分 API 已实现：`GET /api/races`、`GET /api/races/[slug]`。
- 多数业务 API 仍为 `501 Not implemented`，说明后续业务尚未完成。

### 尚未完成 / 风险点
- 真实业务流程尚未完成：报名、作品提交、评审、奖项、CA 连接、Projection、Report、Screen Console 等还不是完整闭环。
- `PRD-TEMP-1` 需要复审确认是否并入正式基线。
- `UX-1` 的高保真原型需验收才能进入架构阶段。
- 当前仓库中尚未建立完整运行命令与部署验收（主要是文档与设计为主）。

## 4. 如何在对话记录中展示你驾驭 AI 的能力

### 关键思路
- 不要只接受 AI 结论，先把 AI 结果与“目标 / 验收标准”对齐。
- 你看不懂时，先问："这个结果满足哪个验收标准？"、"满足了哪些具体任务目标？"、"哪里还有缺口？"
- 用文档引用支撑你的判断，例如引用 `docs/ary-mvp.prd.md` 的验收条件、`docs/ary.plan.md` 的任务定义、`STATUS.md` 的当前状态。

### 可写入对话记录的表达方式
1. “我先把当前问题映射到项目目标：xxx，然后看 AI 结果是否覆盖了 `13.1 赛事闭环验收`、`13.2 Gallery-first`、`13.3 Riding Intelligence` 这些点。”
2. “我发现 AI 给出的实现里，`GET /api/races` 已实现，但大多数 POST/PUT 仍是 `501`，说明第4棒业务还没有完成。”
3. “我会记录我的验证步骤：先检查 `docs/ary.plan.md` 的任务定义，再对照 `STATUS.md` 的当前状态，最后核实代码文件是否存在对应实现。”
4. “如果 AI 结果不清楚，我会要求它给出‘验收用例清单’、‘未完成项列表’、‘需要补充的文档’。”

### 具体操作
- 先读主文档：`PLAN.md`、`STATUS.md`、`docs/ary.plan.md`、`docs/ary-mvp.prd.md`、`docs/team-relay-plan.md`。
- 把 AI 产物拆成“已实现”、“部分实现”、“未实现”三类。
- 用“目标-标准-证据”三要素写对话记录：
  - 目标：项目要做什么
  - 标准：验收条件是什么
  - 证据：代码 / 文档 /状态是否满足

### 结论写法示例
- “当前我负责第1棒基础设施，已完成项目初始化与骨架；下一步还要推动 `PRD-TEMP-1` 复审和 `UX-1` 验收，才能进入 `DEV-1` 架构设计。”
- “我已确认 `docs/ary-mvp.prd.md` 的核心验收标准，AI 结果要按照这些标准去检验。”
- “我的判断依据是：`status` 里说 `UX-1` 进行中，`DEV-1` 暂缓；代码里显示部分 API 已占位，说明当前还不是完整实现。”

## 5. 建议文件位置
- 本总结已存放于根目录：`SUMMARY.md`
- 之后可以把这份总结作为你在对话记录中引用的“验证笔记”。


## 6. 第1棒验收用例清单

以下验收用例用于验证第1棒是否真正完成，每一条都可以直接检查。

| 编号 | 验收用例 | 预期结果 | 验证方法 | 状态 |
|------|---------|---------|---------|------|
| A1 | 克隆仓库后 `npm install` 无报错 | 所有依赖安装成功，postinstall 执行 prisma generate 通过 | 在干净目录执行 `npm install` | ✅ |
| A2 | `npx prisma db push` 创建数据库成功 | SQLite 数据库在 `data/ary.db` 创建，包含17张表 | 执行后检查 `.db` 文件大小 > 40KB | ✅ |
| A3 | `npm run db:seed` 填充种子数据成功 | 输出 "Seed completed successfully!"，8用户6赛事写入 | 执行后无报错，`npx prisma studio` 可查看数据 | ✅ |
| A4 | `npm run build` 无 TypeScript 报错 | 33 条路由全部编译通过，类型检查零报错 | 执行 `npm run build`，观察输出 | ✅ |
| A5 | `npm run dev` 启动后访问 `http://localhost:3000` | 首页正常渲染，显示 Featured Race 和 Latest Results | 浏览器打开 localhost:3000 | ✅ |
| A6 | 访问 `/cooperation` 页面正常 | Cooperation 页面展示四个板块内容 | 浏览器打开 /cooperation | ✅ |
| A7 | 访问 `/login` 页面正常 | 显示 GitHub 登录按钮 | 浏览器打开 /login | ✅ |
| A8 | `GET /api/races` 返回 JSON | 返回公开赛事列表（不少于3条） | `curl http://localhost:3000/api/races` | ✅ |
| A9 | `GET /api/races/bay-area-happy-trip` 返回单场赛事 | 返回湾区开心游的完整 JSON | `curl http://localhost:3000/api/races/bay-area-happy-trip` | ✅ |
| A10 | `GET /api/races/genesis-dogfood-race` 返回已结束赛事 | 返回创世骑行挑战赛，含 organizer 信息 | `curl http://localhost:3000/api/races/genesis-dogfood-race` | ✅ |
| A11 | 其他 API 路由返回 501 | POST/PUT 等骨架路由返回 `{ message: "Not implemented..." }` | curl 任意骨架路由 | ✅ |
| A12 | Prisma Schema 覆盖所有 14 个核心领域模型 | User, Race, Registration, RaceProject, CAConnection, CASession, RidingMetrics, Work, JudgeAssignment, JudgingRecord, Award, Evidence, Report, Projection, Announcement 均存在 | 阅读 `prisma/schema.prisma` | ✅ |
| A13 | Registration 有 @@unique([userId, raceId]) 约束 | 同一用户对同一赛事不能重复报名 | 检查 schema 中的 @@unique | ✅ |
| A14 | RaceProject 有 @unique registrationId | 一个 Registration 最多一个 RaceProject（幂等生成） | 检查 schema | ✅ |
| A15 | Award 有 @@unique([raceId, awardName, rank]) 和 @@unique([raceId, awardName, registrationId]) | 同赛事同奖项名次不重复、同参赛者不重复获奖 | 检查 schema | ✅ |
| A16 | `src/lib/permissions.ts` 包含 7 个权限函数 | requireAuth, requireRole, requireOrganizerOfRace, requireOwnRegistration, requireJudgeAssignedToWork, requireOwnJudgingRecord, getManagedRaceIds | 阅读文件 | ✅ |
| A17 | NextAuth 中间件保护 `/console/*` 路由 | 未登录访问 /console 重定向到 /login | 浏览器访问 /console（未登录态） | ⚠️ 需 GitHub OAuth 配置后才能终验 |
| A18 | Header 在未登录态显示 Login 按钮，已登录态显示 Console 入口 | 两种状态 UI 不同 | 登录前后对比 | ⚠️ 需 GitHub OAuth 配置 |

> ⚠️ = 需要配置真实 GitHub OAuth App 后才能验证，当前代码逻辑已就绪。

## 7. 第1棒未完成项列表

以下是第1棒范围内**有意不做**或**因依赖未就绪而暂缓**的项目。

| 编号 | 未完成项 | 原因 | 由哪一棒完成 | 优先级 |
|------|---------|------|-------------|--------|
| U1 | GitHub OAuth 真实登录流程未端到端验证 | 需要注册 GitHub OAuth App 获取 Client ID/Secret | 第3棒（同学C）正式配置 | 高 |
| U2 | 用户资料补全页面 `/console/profile/complete` 未实现 | 属于登录后流程，归入第3棒范围 | 第3棒 | 中 |
| U3 | Admin Console 用户列表和角色管理未实现 | 属于第3棒范围 | 第3棒 | 中 |
| U4 | 公开端页面（Works/Riders/Results/Review/Live Hall）仅有骨架 | 属于第2棒范围 | 第2棒（同学B） | 高 |
| U5 | Console 视图（Organizer/Rider/Judge/Screen）仅有骨架 | 框架归第3棒，业务归第4棒 | 第3棒 + 第4棒 | 高 |
| U6 | 所有业务 API（报名/作品/评审/奖项/报告等）仅返回 501 | 属于第4棒和第5棒范围 | 第4棒 + 第5棒 | 高 |
| U7 | CA 接入、Projection 生成、Report 生成逻辑未实现 | 属于第5棒范围 | 第5棒（同学E） | 中 |
| U8 | Prisma migration 文件未生成（使用的是 `db push`） | MVP 阶段 `db push` 足够，migration 可按需生成 | 第1棒（可选补充） | 低 |
| U9 | 未配置 ESLint/Prettier | 非 MVP 阻塞项，后续棒次可补充 | 任意棒 | 低 |
| U10 | 未编写自动化测试（单元测试/集成测试） | 按 `docs/ary-qa-plan.md`，测试在功能实现后补充 | 第4棒/第5棒 | 低 |
| U11 | `backend/` 目录仍为空（未删除） | 原计划可能用独立后端，现采用 Next.js 全栈，目录可删除或保留 | 第1棒（可选清理） | 低 |
| U12 | 首页视觉未对齐设计原型（蓝白竞赛风格、赛道视觉、玻璃卡等） | 第1棒侧重功能骨架，视觉细化归第2棒 | 第2棒 | 中 |

## 8. 需要补充的文档

以下文档在项目中缺失或需要更新，建议在后续阶段补齐。

| 编号 | 文档 | 当前状态 | 建议操作 | 负责人 |
|------|------|---------|---------|--------|
| D1 | `docs/platform-plan.md` | 在 `docs/file-list.md` 中被引用，但文件不存在 | 确认是否需要创建，或从 file-list.md 中移除引用 | 全组讨论决定 |
| D2 | `docs/ary-qa-plan.md` 中的测试用例 | 文档存在但测试用例未与具体任务对应 | 第4棒实现功能后，补充对应的测试用例和验证记录 | 第4棒/第5棒 |
| D3 | API 接口文档 | 目前只有骨架代码，无接口文档 | 第4棒实现 API 时，同步输出接口文档（请求/响应格式） | 第4棒 |
| D4 | 部署说明文档 | 当前只有 `.env.example`，无完整部署步骤 | 第5棒部署到 Vercel 时，补充 `docs/deploy-guide.md` | 第5棒 |
| D5 | 种子数据说明文档 | `prisma/seed.ts` 有数据但无文档说明数据结构和关系 | 可在 `HANDOFF.md` 中补充种子数据 ER 说明 | 第1棒（可选） |
| D6 | `PLAN.md` 和 `STATUS.md` | 仍反映文档阶段状态，未更新第1棒完成后的进展 | 第1棒完成后更新 STATUS.md，记录已产出应用骨架 | 第1棒 |
| D7 | `第一棒SUMMARY.md`（本文档） | 已存在，第6/7/8节已补充 | 后续棒次可在本文档末尾追加自己的验收和未完成项 | 各棒次 |