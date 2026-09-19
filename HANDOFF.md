# 第5棒接力说明（最终版）

## 完成时间
2026-07-15

## 负责人
同学E（第5棒，最后一棒）

## 本次产出

- [x] T5.1 CA 模拟数据接入 — `src/lib/ca-mock.ts` + `POST /api/internal/ca-mock/ingest`
- [x] T5.2 Projection 自动生成 — `src/lib/projections.ts`（5种投影）+ `POST /api/internal/projections/rebuild` + `GET /api/internal/projections`
- [x] T5.3 Live Hall 实时化 — `LiveHallClient.tsx`（5秒自动轮询）+ `GET /api/live/[slug]`
- [x] T5.4 Screen Console + Screen Display — 控制面板 + 6种大屏模式 + `/screen/[slug]` 独立路由
- [x] T5.5 Report 自动生成 — `src/lib/report-generator.ts`（3种报告）+ `POST /api/reports` + `PUT /api/reports/[id]`
- [x] T5.6 种子数据增强 — running race + judging race 完整的 CA Session / RidingMetrics / Projection 数据
- [x] T5.7 全局联调 — `npm run build` 通过，TypeScript 零错误
- [x] T5.8 部署准备 — README 更新，HANDOFF 最终版

## 如何运行

```bash
git pull origin main
npm install
cp .env.example .env.local
# 填写 GitHub OAuth 的 GITHUB_ID 和 GITHUB_SECRET
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

## 新增的关键文件

### 后端
| 文件 | 说明 |
|------|------|
| `src/lib/ca-mock.ts` | CA 模拟数据生成器 |
| `src/lib/projections.ts` | 5 种 Projection 聚合逻辑 |
| `src/lib/report-generator.ts` | 3 种 Report 自动生成 |
| `src/lib/screen-data.ts` | 大屏数据查询 |
| `src/app/api/internal/ca-mock/ingest/route.ts` | 模拟数据 API |
| `src/app/api/internal/projections/rebuild/route.ts` | Projection 重建 API |
| `src/app/api/internal/projections/route.ts` | Projection 查询 API |
| `src/app/api/live/[slug]/route.ts` | Live Hall 轮询 API |
| `src/app/api/reports/[id]/route.ts` | 报告状态转换 API |

### 前端
| 文件 | 说明 |
|------|------|
| `src/components/live/LiveHallClient.tsx` | Live Hall 自动轮询组件 |
| `src/components/screen/ScreenJumbotron.tsx` | 巨幕模式 |
| `src/components/screen/ScreenBillboard.tsx` | 信息看板模式 |
| `src/components/screen/ScreenLive.tsx` | 实时动态模式 |
| `src/components/screen/ScreenLeaderboard.tsx` | 大字体榜单模式 |
| `src/components/screen/ScreenWorks.tsx` | 作品轮播模式 |
| `src/components/screen/ScreenAnnouncement.tsx` | 公告展示模式 |
| `src/components/screen/ScreenFallback.tsx` | 大屏 fallback 组件 |
| `src/app/screen/[slug]/page.tsx` | 大屏展示页面 |

## API 路由总览

| 方法 | 路径 | 状态 | 说明 |
|------|------|------|------|
| POST | `/api/internal/ca-mock/ingest` | ✅ 新增 | 生成模拟 CA Session |
| POST | `/api/internal/projections/rebuild` | ✅ 新增 | 重建所有 Projection |
| GET | `/api/internal/projections` | ✅ 新增 | 查询 Projection |
| GET | `/api/live/[slug]` | ✅ 新增 | Live Hall 数据轮询 |
| POST | `/api/reports` | ✅ 已实现 | 生成报告（第4棒→第5棒实现） |
| PUT | `/api/reports/[id]` | ✅ 新增 | 报告状态转换 |
| GET | `/api/races` | ✅ 第1棒 | 公开赛事列表 |
| GET/PUT | `/api/races/[slug]` | ✅ 第1棒/第4棒 | 赛事详情/更新 |
| POST/PUT | `/api/registrations` | ✅ 第4棒 | 报名管理 |
| POST/PUT | `/api/works` | ✅ 第4棒 | 作品管理 |
| POST/PUT | `/api/judge-assignments` | ✅ 第4棒 | 评委分配 |
| POST/PUT | `/api/judging-records` | ✅ 第4棒 | 评审记录 |
| POST/PUT | `/api/awards` | ✅ 第4棒 | 奖项管理 |
| PUT | `/api/admin/users/[id]/roles` | ✅ 第3棒 | 角色管理 |

## 大屏使用指南

1. 以 Organizer/Admin 身份登录
2. 进入 Console → Screen
3. 选择赛事 → 选择展示模式（Jumbotron/Billboard/Live/Leaderboard/Works/Announcement）
4. 点击"在新窗口打开大屏"进行全屏投屏
5. 也可直接访问 `/screen/[slug]?mode=jumbotron`

## 已知问题

- [ ] GitHub OAuth 需要真实 OAuth App 才能端到端测试登录流程
- [ ] Organizer Settings 中 JSON 字段 (schedule/awardSettings) 目前为文本输入
- [ ] 无自动化测试套件
- [ ] Report 生成的 Markdown 内容为基础模板，手工编辑后更佳
- [ ] Screen Works 模式使用硬编码示例数据，待接入真实 Works 数据
- [ ] `User.avatar` 字段名与 NextAuth `User.image` 不一致（通过 auth-adapter 包装解决）

## 给后续同学的建议

1. 首次运行先 seed + 访问首页确认数据正常
2. 大屏展示前先运行 Projection 重建（`POST /api/internal/projections/rebuild`）
3. CA 模拟数据可通过 `POST /api/internal/ca-mock/ingest` 持续生成
4. 完整 demo 路径：首页 → 赛事 → Live Hall → Screen 大屏
5. 权限边界严格遵守 `src/lib/permissions.ts`

---

**第5棒完成，ARY MVP 五棒接力项目交付完毕。**
