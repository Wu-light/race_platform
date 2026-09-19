# ARY 第二棒 Public Site 总结

## 1. 任务目标

第二棒负责完成 ARY Public Site 公开端，依据 `docs/team-relay-plan.md` 第 4.3 节覆盖 T2.1–T2.10：

- 安全公开数据访问层。
- Home / Race Gallery。
- 多状态 Race Page。
- Live Hall。
- Works / Work Page。
- Results。
- Rider Profile。
- Review。
- Cooperation。
- 桌面端与移动端响应式、视觉统一和验收。

公开端使用 Prisma Server Component 查询种子数据库，不依赖业务 API；所有页面遵循 Gallery-first、Race 上下文和公开可见性规则。

## 2. 当前完成结论

`DEV-2 Public Site 静态闭环` 已完成，`team-relay-plan.md` 的第二棒 T2.1–T2.10 均已有对应实现和验收证据。

Live Hall 当前读取数据库中的 Projection 快照，并支持手动刷新。实时 push / fetch、断流 fallback、Screen Display 联动属于第五棒 `DEV-5`，第二棒没有使用模拟实时数据伪装该能力。

## 3. 主要实现

### 3.1 安全公开数据层

- 建立 `src/lib/data-access.ts` 作为 `server-only` 数据访问边界。
- 建立 `src/types/public.ts`，页面仅消费可序列化公开 DTO，不接收 Prisma Record。
- Race 必须同时满足 `visibility=public` 和公开状态白名单。
- Work 必须满足 `visibility=public`、`submitted/locked` 和 approved Registration。
- Award 仅在 `publishedAt` 已到达且 Race 为 `completed/archived` 时公开。
- Review 仅查询已发布的 `review_summary` Report。
- Projection 仅解析 `race_progress`、`current_leaderboard` 白名单字段。
- JSON 使用 Zod 校验，损坏或未知字段安全回退。
- 外部链接仅允许 HTTP / HTTPS。
- Evidence 仅输出 public 标题、摘要和经过校验的公开指标，不输出原始 `sourceRef`。
- 不选择 `email`、`githubId`、`roles`、Account、Session、原始 CA Session 或未发布 JudgingRecord。

### 3.2 组件与视觉体系

- PublicPageShell、Header、Footer、桌面/移动导航、Skip Link。
- ActionLink、StatusBadge、MetricCard、SectionHeading、EmptyState、SafeMarkdown。
- RaceCard、WorkCard、RiderCard、RaceHero、RaceLifecycle、RaceSchedule、RaceNavigation。
- 蓝白竞赛色板、玻璃卡、速度线背景、赛道视觉和统一焦点样式。
- 移动导航和 Drawer 支持滚动锁定、焦点陷阱、Escape、遮罩关闭和关闭后回焦。

### 3.3 Home / Race Gallery

- Featured Race Hero 和 Live Race Switcher。
- Rider、作品、进度、Session 等公开指标。
- Featured Work / Rider。
- Race Updates Drawer：Open Registration、Latest Results、Past Races、Cooperation。
- 自动轮播、暂停控制、键盘切换和 reduced-motion 处理。
- Works、Riders、Race Gallery 和合作 CTA。

### 3.4 Race Page

- 根据 `registration/running/submitting/judging/completed/archived` 调整内容和 CTA。
- 报名态：参赛收益、赛题、赛程、交付要求、MVP 固定评审维度、奖项和报名入口。
- 进行中：Live Hall、阶段、公开指标、过程榜预览和公告。
- 评审中：作品、评审时间和安全空态；不公开 JudgeAssignment 或未发布评语。
- 已结束：Award 预览、优秀作品、Rider、Results 和 Review 入口。
- 内部导航根据状态和发布事实动态显示 Live / Works / Results / Review。

### 3.5 Live Hall

- Race Status Banner 和赛事生命周期。
- Riders、Active、Sessions、Works、Progress、Tokens、Cost、Risk 八项指标。
- `current_leaderboard` 过程榜：排名、进度、成本、风险。
- Rider Activity 聚合卡。
- Event Stream：公开公告和 Projection 更新时间。
- 风险说明、公开投影刷新、大屏控制入口。
- 明确过程榜不是最终 Results，最终事实来自 Award / Report。
- 非 running Race 的 Live Hall 返回 404。

### 3.6 Works / Work Page

- Works 支持本地搜索、奖项优先/名称排序、数量反馈和安全空态。
- Work Page 展示问题定义、解决方案、Demo、视频、代码、技术方案、公开 Evidence、Award 理由、作者和 Race 上下文。
- 隐藏、草稿和未公开作品返回 404。
- 不执行作品内容中的 HTML 或脚本。

### 3.7 Results / Review

- Results 按 Award 名称分组并按 rank 排序。
- 展示获奖作品、Rider 能力亮点和 Review 入口。
- Review 展示安全 Markdown、获奖说明、典型案例、公开 Evidence 和下一场建议。
- “评委观点”仅引用已随 Award 发布的 `decisionReason`，不读取没有公开标记的 JudgingRecord。
- 未发布 Results / Review 返回 404，且不进入 Race 导航。

### 3.8 Rider Profile

- 基础信息、学校/单位、参赛记录、作品记录、获奖记录和技能标签。
- 从 public Evidence 白名单字段聚合 Sessions、Tokens、Corrections、Progress。
- 没有公开来源的 Cost / Risk 明确显示“未公开”。
- 不输出报名状态、账户字段或原始骑行数据。
- 当前 User Schema 没有 slug，暂用稳定 opaque User id 作为路由段，不按姓名生成猜测 slug。

### 3.9 Cooperation

- ARY 和 Agent Riding Skill 说明。
- 学生、老师/学校、企业、社区四类参与者价值。
- 参赛、办赛、企业命题/赞助路径。
- 未配置公开邮箱时不展示虚假联系方式。

## 4. 关键纠偏记录

| 问题 | 风险 | 修正 |
|---|---|---|
| Race 使用“非 draft 即公开” | 可能放行未知状态 | 使用 public visibility + 明确状态白名单 |
| User 没有 slug | 按姓名生成会冲突或产生猜测链接 | 暂用稳定 opaque User id |
| 移动端 Drawer 按钮被 Header 覆盖 | 点击命中错误元素 | 调整按钮位置，Drawer 使用 Portal，并恢复触发按钮焦点 |
| Projection 被误用为最终榜单 | 过程数据污染赛果事实 | Live 只展示过程榜，Results 只读取已发布 Award |
| JudgingRecord 无发布标记 | 泄露评分或评语 | 公开端不查询 JudgingRecord，只展示已发布 Award 判断 |
| Rider 数据要求成本/风险 | 容易读取内部 CA 或 Report | 仅聚合 public Evidence；无公开来源显示“未公开” |
| Report 文本与事实表数字冲突 | 页面统计失真 | 统计始终从 Registration、Work、Award 事实表计算 |

## 5. 第二棒任务清单

| 编号 | 任务 | 状态 | 完成证据 |
|---|---|---|---|
| T2.1 | 页面数据层 | ✅ | `src/lib/data-access.ts`、`src/types/public.ts` |
| T2.2 | Home / Race Gallery | ✅ | `src/app/page.tsx`、`src/components/home/RaceGalleryHero.tsx` |
| T2.3 | Race Page | ✅ | `src/app/(public)/races/[slug]/page.tsx` |
| T2.4 | Live Hall | ✅ | `src/app/(public)/races/[slug]/live/page.tsx` |
| T2.5 | Works / Work Page | ✅ | Works 与 Work 路由、WorksExplorer、WorkCard |
| T2.6 | Results | ✅ | `src/app/(public)/races/[slug]/results/page.tsx` |
| T2.7 | Rider Profile | ✅ | `src/app/(public)/riders/[slug]/page.tsx` |
| T2.8 | Review | ✅ | `src/app/(public)/races/[slug]/review/page.tsx` |
| T2.9 | Cooperation | ✅ | `src/app/(public)/cooperation/page.tsx` |
| T2.10 | 响应式适配 | ✅ | 1920×1080、390px、320px 浏览器验收 |

## 6. 验收结果

### 6.1 构建

- `npm run build` 成功。
- TypeScript 类型检查成功。
- Next.js 全部 33 条路由编译通过。
- Live Hall First Load JS 约 110 kB。

### 6.2 浏览器交互

- 首页 Race Switcher、Drawer 正常。
- 移动导航打开/关闭正常。
- Works 搜索和排序正常。
- Live Hall 刷新后保持当前 Race 并重新读取 Projection。
- Work、Rider、Race、Results、Review 跨页入口正常。
- 浏览器 error / warning 日志为空。

### 6.3 响应式

- 1920×1080：Header、Hero、阶段、赛道、指标和过程榜视觉统一。
- 390px：Home、Race、Live Hall、Work 无横向溢出，CTA 自动堆叠。
- 320px：品牌区和页面内容无横向溢出。

### 6.4 生产状态码

| 场景 | 预期 | 结果 |
|---|---:|---:|
| Home、各公开 Race、Works、Work、Results、Review、Rider、Cooperation | 200 | ✅ |
| running Race 的 Live Hall | 200 | ✅ |
| 非 running Race 的 Live Hall | 404 | ✅ |
| 未发布 Results / Review | 404 | ✅ |
| hidden Work | 404 | ✅ |
| hidden / draft Race | 404 | ✅ |

## 7. 主要产物

- `src/lib/data-access.ts`
- `src/types/public.ts`
- `src/app/page.tsx`
- `src/app/(public)/races/[slug]/page.tsx`
- `src/app/(public)/races/[slug]/live/page.tsx`
- `src/app/(public)/races/[slug]/works/page.tsx`
- `src/app/(public)/races/[slug]/results/page.tsx`
- `src/app/(public)/races/[slug]/review/page.tsx`
- `src/app/(public)/works/[slug]/page.tsx`
- `src/app/(public)/riders/[slug]/page.tsx`
- `src/app/(public)/cooperation/page.tsx`
- `src/components/home/`
- `src/components/live/`
- `src/components/layout/`
- `src/components/race/`
- `src/components/work/`
- `src/components/rider/`
- `src/components/ui/`
- `PLAN.md`
- `STATUS.md`
- `第二棒SUMMARY.md`
- `第二棒ai-task-tracker.md`

## 8. 下一棒交接事项

| 编号 | 后续事项 | 当前边界 | 建议负责人 |
|---|---|---|---|
| U1 | Live 实时 push / fetch | 当前为 Projection 快照 + 手动刷新 | 第5棒 |
| U2 | 断流 fallback | 当前缺少最近成功快照与断流状态 | 第5棒 |
| U3 | Screen Display | 仅保留 Screen Console 入口 | 第5棒 |
| U4 | User 公开 slug | 当前暂用 opaque User id | 后续 Schema 迁移 |
| U5 | Report visibility | 当前用 type/status/publishedAt 白名单 | 后续 Schema 迁移 |
| U6 | JudgingRecord 发布标记 | 当前公开端完全不查询原始评审记录 | 第4棒/Schema 迁移 |
| U7 | 自动化测试 | 当前以构建、状态码和浏览器走查验收 | 第4棒/第5棒 |

## 9. 结论

第二棒已经形成可直接浏览、状态正确、响应式完整、公开边界明确的 ARY Public Site。后续开发应复用现有 DTO、组件和可见性规则，不要绕过 `src/lib/data-access.ts` 直接向公开页面传递内部 Prisma 数据。
