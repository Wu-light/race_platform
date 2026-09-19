# PLAN

本文是 ARY 近期任务窗口，记录近期要推进的任务和里程碑。长期任务定义见 `docs/ary.plan.md`；任务瞬时状态见 `STATUS.md`。

## 近期窗口

| 窗口 | 目标 |
| --- | --- |
| UX 高保真原型评审 | 完成 UX-1 第一轮高保真原型评审，确认能否作为架构设计输入继续推进。 |
| 报名 / CA 参赛语义整改 | 确认 Registration approved 自动生成 RaceProject、CAConnection 参赛中动态接入、CA 接入状态不再作为参赛资格硬门禁，并完成文档一致性整改。 |
| Public Site 静态闭环 | `DEV-2` 已按 `team-relay-plan.md` 完成安全公开数据层、Home、Race、Live Hall、Works / Work、Results、Review、Rider Profile、Cooperation、响应式与验收。 |
| 登录 + Console 框架 | `DEV-3` 已完成：Session 完整化、ConsoleShell + 侧边栏 + 顶部栏、Admin Console（用户表 + 角色编辑 + `requireRole("admin")` API）、资料补全流程、Organizer(11) + Rider(6) + Judge(3) 共 20 个占位骨架页面、`<RequireRole>` 同步页面级守卫 + race-scoped 资源级守卫；中间件继续只做 auth；实际业务功能进入 `DEV-4`。 |

## 近期任务

| 任务 | 目标 | 下一入口 |
| --- | --- | --- |
| `PRD-1` 文档基线与范围确认 | 完成首轮文档一致性检查，确认能否作为架构入口。 | `docs/ary.plan.md` |
| `PRD-TEMP-1` 报名 / RaceProject / CA 参赛语义整改 | 已完成首轮整改并进入待复审：PRD、领域、CA 契约、IA、UX / 高保真原型、权限、QA、OPS 和计划文档已同步新口径。 | `docs/registration-ca-rules-alignment.taskbook.md` |
| `UX-1` UX/UI 高保真原型与设计基线 | 已产出 IA 对齐版 1080P 高密度高保真原型，后续页面按高保真页面工作流继续深化。 | `docs/ux-hifi.taskbook.md`、`.agents/skills/hifi-ui-page-workflow/SKILL.md`、`design-prototype/index.html` |
| `DEV-1` 领域模型 + 权限 + 数据模型 | 输出聚合边界、数据模型草案和接口鉴权规则。 | `docs/ary-domain-analysis.v0.3.md` |
| `DEV-2` Public Site 静态闭环 | 已完成：公开数据 DTO 与白名单查询、公共组件体系、Home / Race Gallery、多状态 Race Page、Live Hall Projection 基础 UI、Works / Work、Results、Review、Rider Profile、Cooperation、320/390/1920 响应式和公开边界验收。实时 push / fetch 接入继续归入 `DEV-5`。 | `src/lib/data-access.ts`、`src/app/(public)/`、`src/components/`、`第二棒SUMMARY.md` |
| `DEV-3` 登录 / 角色 / Race Console | 已完成：Session 完整化（name/email/image/roles/profileCompleted）、ConsoleShell + 顶部栏 + 侧边栏 + 角色感知菜单、Admin Console（用户表 + 角色编辑弹窗 + `requireRole("admin")` API）、资料补全流程 + `profileCompleted` 守卫、20 个 Organizer/Rider/Judge 占位页 + 子导航、`<RequireRole>` 同步组件 + `requireRiderForRace` / `requireJudgeForRace` 资源级守卫；中间件继续只做 auth；实际业务功能进入 `DEV-4`。**注意**：第1棒 schema 的 `User.avatar` 与 NextAuth PrismaAdapter 期望的 `User.image` 不兼容，第3棒通过 `src/lib/auth-adapter.ts` 包装 adapter 把 `image → avatar` 映射实现零迁移修复；后续 Schema 迁移时可直接把 `avatar` 字段改名为 `image` 去掉包装。 | `src/lib/auth-adapter.ts`、`src/components/layout/ConsoleShell.tsx`、`src/components/layout/RequireRole.tsx`、`src/app/(console)/console/{layout,profile,access-denied,admin}/`、`src/app/api/admin/users/`、`src/app/(console)/console/races/[slug]/{layout,organizer,rider,judge}/`、`第三棒执行计划.md`、`第三棒验证手册.md` |
| `DEV-5` CA 接入 / Projection / Live Hall | 已按新口径整改 CA 原始骑行状态消息草案：CAConnection 可在参赛过程中登记和握手，合法连接数据进入证据链，接入异常进入评审前风险提示；继续收敛投影规则、字段必填性、push / fetch 边界和幂等规则。 | `docs/ary-ca-integration-spec.md` |

## 近期里程碑

| 里程碑 | 完成口径 |
| --- | --- |
| `M1` 文档基线可作为架构入口 | PRD、领域、IA、权限、QA、计划、OPS、CA 草案无高优先级冲突。 |
| `M2` 架构设计输入就绪 | 领域边界、权限规则、数据模型、CA 接入待定项、UX/UI 高保真原型和关键页面状态有明确输入。 |

## 下一步

1. 评审 `UX-1` IA 对齐版高保真原型及 `DEV-2` 已实现公开站点，确认视觉、信息层级和公开边界可作为后续页面基线。
2. 第四棒基于 `DEV-3` 提供的 20 个占位页面、子导航、`<RequireRole>` 守卫和 Admin API 模式，填充 Organizer / Rider / Judge 实际业务功能（赛事创建、报名审核、作品提交、评审、奖项发布）。
3. 进入 `DEV-5` 时将现有 Live Hall 快照读取升级为实时 Projection push / fetch 与 fallback，并完成 Screen Display；继续区分过程数据和最终 Award / Report 事实。
4. 后续页面沿用“Server Component 查询安全 DTO、Client island 仅接收可序列化公开数据”的边界，并执行构建、响应式和 404 验收。
5. 复审 `PRD-TEMP-1` 整改后的 PRD、领域、IA、UX / 高保真原型、权限、QA、OPS 和 CA 契约一致性，确认是否可将临时任务并入正式 `PRD-1` 基线。
6. 后续 Schema 迁移时考虑把 `User.avatar` 字段改名为 `User.image`（与 NextAuth PrismaAdapter 对齐），可去掉 `src/lib/auth-adapter.ts` 包装。

## 执行纪律

* 开工前读取对应任务在 `docs/ary.plan.md` 中的定义。
* 近期窗口变化时更新本文；任务状态变化时更新 `STATUS.md`。
