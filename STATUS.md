# STATUS

本文是 ARY 任务瞬时看板，记录当前任务状态、证据和风险。不记录历史流水。

## 当前结论

* 项目已进入 MVP 接力实现阶段，文档基线与架构细化同步进行。
* 业务文档已集中到 `docs/` 下。
* 当前正式项目任务定义入口是 `docs/ary.plan.md`。
* `PRD-TEMP-1` 已完成首轮整改，报名、RaceProject 自动生成、CAConnection 动态接入和评审前风险提示的新口径已同步到主要文档和高保真原型。
* `UX-1` 已产出第一轮高保真原型和设计说明，但尚未评审验收，不能直接进入 `M2` 或启动架构设计。
* **第1棒（同学A）已完成应用骨架搭建**：Next.js 14 全栈项目已初始化，Prisma Schema（17个模型）已对齐领域分析，种子数据已填充（8用户、6赛事），认证系统（NextAuth v5 + GitHub）和权限中间件已搭建，33 条路由编译通过。详见 `HANDOFF.md` 和 `第一棒SUMMARY.md`。
* **`DEV-2` Public Site 第二棒已全部完成**：已建立安全公开数据访问层和 DTO、蓝白竞赛组件体系，并完成 Home / Race Gallery、Race Page、Live Hall、Works / Work、Results、Review、Rider Profile、Cooperation、响应式和验收；Live Hall 当前消费种子库 Projection 快照，实时接入继续归入 `DEV-5`。
* **`DEV-3` 登录 + Console 框架第三棒已全部完成**：Session 完整化、ConsoleShell + 顶部栏 + 侧边栏、Admin Console（用户表 + 角色编辑弹窗 + `requireRole("admin")` API）、资料补全流程 + `profileCompleted` 守卫、Organizer(11) + Rider(6) + Judge(3) 共 20 个占位骨架页面、`<RequireRole>` 同步页面级守卫 + `requireRiderForRace` / `requireJudgeForRace` 资源级守卫。`npm run build` 通过，TypeScript 类型检查零报错，70+ 路由编译成功。第一棒 schema `User.avatar` 与 NextAuth PrismaAdapter 不兼容问题通过 `src/lib/auth-adapter.ts` 包装解决（`image → avatar` 映射，零迁移）。实际业务功能进入 `DEV-4`。

## 任务看板

| 任务 | 状态 | 当前判断 | 证据 / 下一入口 |
| --- | --- | --- | --- |
| `PRD-1` 文档基线与范围确认 | 进行中 | 业务文档已集中到 `docs/`，正在校准项目管理结构。 | `docs/README.md`、`docs/ary.plan.md` |
| `PRD-TEMP-1` 报名 / RaceProject / CA 参赛语义整改 | 待复审 | 已完成首轮文档和原型整改：Registration approved 自动生成 RaceProject、参赛中可新增 CAConnection、CA 接入异常进入评审前风险提示而非硬门禁。需复审是否并入正式 `PRD-1` 基线。 | `docs/registration-ca-rules-alignment.taskbook.md`、`docs/ary-mvp.prd.md`、`docs/ary-domain-analysis.v0.3.md`、`design-prototype/` |
| `UX-1` UX/UI 高保真原型与设计基线 | 进行中 | 高保真原型已按 IA 重构为 1080P 高密度蓝白竞赛风格页面，并接入样例赛事数据驱动主要页面；页面可见文案已清理 PRD / 实现说明口吻，二级页面口号式大标题已降级为对象名和状态摘要；本轮已按明确审查标准修正首页 IA：Public Header 收敛为 Races / Works / Riders / Cooperation，Race 子页面入口回到具体 Race/赛果模块，底部快捷菜单移除，Hero 与 Featured Race 合体，Latest Results / Past Races 去重，开放报名 / 合作入口命名明确，首页独立 Leaderboards / Live Skill Board 已撤销，未登录态只显示 Login；首页整改经验已沉淀为通用高保真页面工作流 Skill，后续页面需先审 IA 合约、补足领域样例数据并复用已通过页面视觉 / 交互惯例。 | `docs/ux-hifi.taskbook.md`、`.agents/skills/hifi-ui-page-workflow/SKILL.md`、`design-prototype/index.html`、`design-prototype/README.md` |
| `DEV-1` 领域模型 + 权限 + 数据模型 | 进行中 | 第1棒已完成 Prisma Schema（17个模型）、权限基础设施（7个函数）、认证系统（NextAuth v5 + GitHub）、种子数据脚本、API 骨架（15条路由）、共享组件（Header/Footer）。33 条路由 `npm run build` 通过。公开端页面和业务 API 实现待第2-5棒。 | `HANDOFF.md`、`第一棒SUMMARY.md`、`prisma/schema.prisma`、`docs/team-relay-plan.md` |
| `DEV-2` Public Site 静态闭环 | 已完成 | 已逐项覆盖 T2.1-T2.10：公开数据白名单与 JSON 校验、Home、状态驱动 Race、Live Hall 指标/活动/事件/过程榜/大屏入口、Works / Work、Results、Rider、Review、Cooperation、320/390/1920 响应式。未发布 Results/Review、非 running Live、隐藏 Race/Work、无公开作品 Rider 统一 404。 | `src/lib/data-access.ts`、`src/types/public.ts`、`src/components/`、`src/app/(public)/`、`第二棒SUMMARY.md` |
| `DEV-3` 登录 / 角色 / Race Console | 已完成 | Session 完整化（name/email/image/roles/profileCompleted 通过 `src/lib/auth-adapter.ts` 包装映射 `avatar → image`）、ConsoleShell 顶部栏 + 侧边栏、Admin Console（用户表 + Last Sign-in 列 + 角色编辑弹窗 + `PUT /api/admin/users/[id]/roles`）、资料补全流程（name/school/bio 三字段）、20 个 Organizer/Rider/Judge 占位页 + 子导航组件、`<RequireRole>` 同步组件 + race-scoped 资源级守卫（`requireRiderForRace` / `requireJudgeForRace`）。`npm run build` 通过，TypeScript 类型检查零报错。 | `src/lib/auth-adapter.ts`、`src/components/layout/{ConsoleShell,RequireRole,OrganizerNav,RiderNav,JudgeNav}.tsx`、`src/app/(console)/console/{layout,profile,access-denied,admin}/`、`src/app/api/admin/users/[id]/roles/`、`src/app/(console)/console/races/[slug]/{layout,organizer,rider,judge}/`、`第三棒执行计划.md`、`第三棒验证手册.md` |
| `DEV-5` CA 接入 / Projection / Live Hall | 细化中 | 已将 CA 作为 Agent Race 工具、比赛信号源和评审参考的口径落盘；CAConnection 可在参赛过程中登记和握手，合法连接数据进入证据链，接入异常进入评审前风险提示；`task_progress` 仅用于 unblock / 说明，不做定期推送，且不设 `session_progress` push。 | `docs/ary-ca-integration-spec.md` |
| `REL-1` 赛事彩排 / 灰度发布 / 正式发布 | 待开始 | 等待开发任务和验收证据完成。 | `docs/ary-release-ops-plan.md` |
| `OPS-1` 赛事值守 / 回滚 / 赛后归档 | 待开始 | 等待发布方案和赛事执行计划明确。 | `docs/ary-release-ops-plan.md` |

## 证据索引

| 结论 | 证据 |
| --- | --- |
| 文档集合存在且已集中到 `docs/` | `docs/*.md` |
| 第1棒应用骨架已搭建，`npm run build` 通过（33条路由） | `HANDOFF.md`、`第一棒SUMMARY.md`、`prisma/schema.prisma` |
| 第1棒产出完整接力方案和 AI 驾驭指南 | `docs/team-relay-plan.md`、`docs/conversation-transcript.md`、`docs/ai-task-tracker.md` |
| `DEV-2` 首批公开端通过生产构建和浏览器状态验收 | `src/lib/data-access.ts`、`src/app/page.tsx`、`src/app/(public)/races/[slug]/page.tsx`、`src/components/home/RaceGalleryHero.tsx` |
| `DEV-2` 公开详情页闭环完成并通过搜索、跨页导航、390px 响应式和公开 404 验收 | `src/app/(public)/races/[slug]/works/page.tsx`、`src/app/(public)/works/[slug]/page.tsx`、`src/app/(public)/races/[slug]/results/page.tsx`、`src/app/(public)/races/[slug]/review/page.tsx`、`src/app/(public)/riders/[slug]/page.tsx`、`src/app/(public)/cooperation/page.tsx` |
| `DEV-2` Live Hall 与第二棒最终验收完成：8 项指标、过程榜、事件流、刷新、大屏入口；1920/390/320 无横向溢出；浏览器无 error/warning；生产构建与 16 条状态路由符合预期 | `src/app/(public)/races/[slug]/live/page.tsx`、`src/components/live/LiveRefreshControl.tsx`、`src/lib/data-access.ts`、`第二棒SUMMARY.md` |
| `DEV-2` AI 对话、任务、纠偏和验收过程已整理为独立追踪文档 | `第二棒ai-task-tracker.md` |
| `DEV-3` Session 携带完整用户信息（name/email/image/roles/profileCompleted），通过 `src/lib/auth-adapter.ts` 包装 PrismaAdapter 解决 `User.avatar` 字段不兼容 | `src/lib/auth-adapter.ts`、`src/lib/auth.config.ts` |
| `DEV-3` Console Shell 顶部栏（64px sticky）+ 侧边栏（256px 含角色感知菜单）+ race 上下文透传 | `src/components/layout/ConsoleShell.tsx`、`src/app/(console)/console/layout.tsx`、`src/app/(console)/console/races/[slug]/layout.tsx` |
| `DEV-3` Admin 用户表 + 角色编辑弹窗（4 个 role 复选框 + PUT `/api/admin/users/[id]/roles`） | `src/app/(console)/console/admin/AdminUserTable.tsx`、`src/app/(console)/console/admin/RoleEditor.tsx`、`src/app/api/admin/users/[id]/roles/route.ts` |
| `DEV-3` 资料补全流程：未完成则强制进入 `/console/profile/complete`，Server Action 提交三字段（name/school/bio）后回 `/console` | `src/app/(console)/console/profile/complete/page.tsx`、`src/app/(console)/console/page.tsx` |
| `DEV-3` 20 个 Organizer/Rider/Judge 视图骨架页面 + 子导航 | `src/components/layout/{OrganizerNav,RiderNav,JudgeNav}.tsx`、`src/app/(console)/console/races/[slug]/{organizer,rider,judge}/` |
| `DEV-3` `<RequireRole>` 同步页面级守卫（避免 React 18 async server component 类型不匹配） | `src/components/layout/RequireRole.tsx`、`src/app/(console)/console/admin/page.tsx` |
| `DEV-3` race-scoped 资源级守卫（`requireRiderForRace` / `requireJudgeForRace`）和 redirect-based access-denied 守卫 | `src/lib/permissions.ts`、`src/app/(console)/console/races/[slug]/layout.tsx`、`src/app/(console)/console/access-denied/page.tsx` |
| `DEV-3` Admin API 鉴权统一走 `requireRole("admin")` + `PermissionError` 状态码 | `src/app/api/admin/users/route.ts`、`src/app/api/admin/users/[id]/roles/route.ts` |
| `DEV-3` Header 已登录态显示头像 + Workspace 按钮（`user.image` 或首字母 fallback） | `src/components/layout/Header.tsx` |
| `DEV-3` AI 对话、任务、纠偏和验收过程已整理为 `第三棒执行计划.md` + `第三棒验证手册.md`（未做 summary 和 ai-task-tracker，沿用前两棒模式） | `第三棒执行计划.md`、`第三棒验证手册.md` |
| 长期任务定义入口为 `docs/ary.plan.md` | `docs/ary.plan.md` |
| 近期窗口入口为 `PLAN.md` | `PLAN.md` |
| CA 接入契约已形成原始骑行状态消息草案，仍需继续讨论完善 | `docs/ary-ca-integration-spec.md` |
| 报名 / RaceProject / CA 参赛语义整改已形成临时任务书 | `docs/registration-ca-rules-alignment.taskbook.md` |
| 当前仓库包含设计原型 | `design-prototype/` |
| UX/UI 高保真原型已作为 `M2` 前置验收任务进入看板 | `PLAN.md`、`docs/ary.plan.md` |
| UX-1 高保真原型已按 IA 和 1080P 视口修订并通过本地截图验证 | `design-prototype/index.html`、`design-prototype/*.png` |
| UX-1 样例赛事数据已生成并接入原型渲染，用于支撑 IA 页面密度和状态差异 | `design-prototype/data/sample-races.json`、`design-prototype/data/sample-races.js`、`design-prototype/script.js` |
| UX-1 页面可见文案已去除 PRD、需求说明和实现术语口吻 | `design-prototype/index.html`、`design-prototype/script.js`、`design-prototype/data/sample-races.json`、`design-prototype/README.md` |
| UX-1 二级页面口号式大标题已降级为对象名和状态摘要 | `design-prototype/index.html`、`design-prototype/script.js`、`design-prototype/styles.css` |
| UX-1 本轮 IA 整改已完成：公开导航边界、Home Gallery 模块、单场 Results、Works 筛选/详情入口、Race Riders 入口、Review 下一场、Rider 能力证据、Screen 输出/控制边界，且静态兜底与动态渲染一致 | `design-prototype/index.html`、`design-prototype/script.js`、`design-prototype/styles.css` |
| UX-1 首页 IA 复审标准已落地：顶层导航不放 Race 子页面，CTA 依附具体 Race / 作品 / 合作场景，首页不设置独立 Leaderboards 模块 | `docs/ary-mvp.ia.md`、`design-prototype/index.html`、`design-prototype/script.js`、`design-prototype/README.md` |
| UX-1 外审意见已落实：Hero 直接承载 Featured Race 信息，Latest Results / Past Races 去重，Next Entry 改为开放报名 / 合作入口，Header 按未登录态只显示 Login | `design-prototype/index.html`、`design-prototype/script.js`、`design-prototype/styles.css`、`design-prototype/README.md` |
| UX-1 首页 Leaderboards 已撤销：Live Skill Board 从首页移除，过程榜保留在 Live Hall，最终榜保留在 Results | `docs/ary-mvp.ia.md`、`docs/ary-mvp.prd.md`、`docs/ux-hifi.taskbook.md`、`design-prototype/index.html`、`design-prototype/script.js`、`design-prototype/styles.css` |
| UX-1 首页视觉复审已处理：右侧首卡从重复 Race Card 改为 Open Registration，首页 page-label 横线已隐藏，避免与 Public Header 分隔线冲突 | `design-prototype/index.html`、`design-prototype/script.js`、`design-prototype/styles.css` |
| UX-1 首页 Live Now 结构已修正：独立 Live Now 框已撤销，Hero / Featured Races 直接支持 live Race 切换 | `docs/ary-mvp.ia.md`、`docs/ux-hifi.taskbook.md`、`design-prototype/index.html`、`design-prototype/script.js`、`design-prototype/README.md` |
| UX-1 首页 title 层级已修正：不在顶部额外强调 Series / Gallery title，当前 Live Race title 居中成为首屏主标题，下划线式 Live Race 切换器位于标题下方，赛题位于切换器下方 | `design-prototype/index.html`、`design-prototype/script.js`、`design-prototype/styles.css`、`design-prototype/README.md` |
| UX-1 品牌区 logo 已修正：使用 ico 原图展示，移除额外圆形套框、描边和外圈光晕 | `design-prototype/index.html`、`design-prototype/styles.css` |
| UX-1 首页布局节奏已调整：Header 更轻，Hero 信息组上移并压缩，赛道视觉下沉，作品 / Rider 卡缩高并落在赛道下缘，右侧信息栈与主 Hero 保持错落间距 | `design-prototype/styles.css` |
| UX-1 首页 Live Race 切换器已简化：取消重复赛事文字，只保留下划线式选择指示，并加入自动轮播切换 | `design-prototype/index.html`、`design-prototype/script.js`、`design-prototype/styles.css`、`design-prototype/README.md` |
| UX-1 首页 Live Race 未激活切换线已增强为浅蓝可见状态，active 状态仍保持深蓝加长 | `design-prototype/styles.css` |
| UX-1 右侧信息卡头部状态标签已降噪：从高饱和蓝色实心 pill 改为浅蓝描边淡底标签，避免抢主 Hero 注意力 | `design-prototype/styles.css` |
| UX-1 首页赛道 Riding Signal 角标已移到赛道容器左上，避免与轨迹节点产生关系误读 | `design-prototype/script.js` |
| UX-1 首页右侧辅助信息已改为 Drawer：默认只露出窄 Rail，点击后从右侧滑出 Open Registration、Latest Results、Past Races 和 Cooperation 四个模块 | `design-prototype/index.html`、`design-prototype/script.js`、`design-prototype/styles.css`、`design-prototype/README.md` |
| UX-1 首页 Live Title 已按 Drawer 默认收起态重新居中，Hero 信息组与赛道主画布中轴对齐 | `design-prototype/styles.css` |
| UX-1 品牌区 logo 已替换为马头罗盘 PNG，生成透明底裁切版并按竖向比例调整 Header 图标容器 | `design-prototype/assets/logo-horse-compass-transparent.png`、`design-prototype/index.html`、`design-prototype/styles.css` |
| UX-1 首页设计与交互短视频已录制，覆盖默认首页、Live Race 切换、右侧 Drawer 打开 / 收起，并内嵌字幕说明 | `design-prototype/recordings/ary-homepage-demo.mp4` |
| UX-1 首页整改经验已沉淀为通用高保真页面工作流 Skill，并在任务书和原型 README 中引用；后续页面需先审 IA、补领域样例数据、复用已通过页面视觉 / 交互惯例，再浏览器复审 | `.agents/skills/hifi-ui-page-workflow/SKILL.md`、`docs/ux-hifi.taskbook.md`、`design-prototype/README.md` |

## 风险与阻塞

| 项目 | 状态 |
| --- | --- |
| 架构、数据模型和接口契约尚未完成 | `DEV-1` 前置风险 |
| UX/UI 高保真原型和关键页面状态尚未评审验收 | `M2` 前置风险 |
| 报名 / RaceProject / CA 参赛语义已完成首轮整改，但仍需人工复审确认是否并入正式基线 | `PRD-TEMP-1` 待复审，重点看评审前风险命名、CAConnection 新增窗口和违规作品处理 |
| User 缺少公开 slug、Report 缺少 visibility、Projection 缺少公开性与唯一约束 | 当前公开层使用字段白名单和安全回退；后续 Schema 迁移前不生成猜测链接、不暴露原始 JSON |
| 尚无独立自动化测试套件 | 当前以 TypeScript/Next 生产构建、真实种子库页面和浏览器交互走查作为首批证据；后续补数据契约与页面状态测试 |
| Live Hall 当前是 Projection 快照 + 手动刷新，不含实时 push / fetch | 第二棒基础 UI 已完成；实时接入、断流 fallback 和 Screen Display 由 `DEV-5` 继续实现 |
