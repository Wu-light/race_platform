import { readFileSync } from "fs";
import { resolve } from "path";

// Prisma Client 在 tsx 下不自动读 .env，手动加载
for (const name of [".env", ".env.local"]) {
  const path = resolve(__dirname, "..", name);
  try {
    const content = readFileSync(path, "utf-8");
    for (const line of content.split("\n")) {
      const match = line.match(/^\s*([^#=]+?)\s*=\s*["']?(.+?)["']?\s*$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
      }
    }
  } catch {}
}

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding ARY database...");

  // 清理旧数据（确保可重复运行）
  await prisma.judgingRecord.deleteMany();
  await prisma.judgeAssignment.deleteMany();
  await prisma.evidence.deleteMany();
  await prisma.cASession.deleteMany();
  await prisma.ridingMetrics.deleteMany();
  await prisma.cAConnection.deleteMany();
  await prisma.award.deleteMany();
  await prisma.report.deleteMany();
  await prisma.projection.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.work.deleteMany();
  await prisma.raceProject.deleteMany();
  await prisma.registration.deleteMany();
  await prisma.race.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  console.log("Cleared existing data");

  // ========== Users ==========
  const alice = await prisma.user.upsert({
    where: { githubId: 1001 },
    update: {},
    create: {
      githubId: 1001,
      name: "Alice Wang",
      email: "alice@example.com",
      avatar: "https://avatars.githubusercontent.com/u/1001",
      bio: "Full-stack developer & AI enthusiast",
      school: "UC Berkeley",
      roles: JSON.stringify(["rider", "organizer"]),
      profileCompleted: true,
    },
  });

  const bob = await prisma.user.upsert({
    where: { githubId: 1002 },
    update: {},
    create: {
      githubId: 1002,
      name: "Bob Zhang",
      email: "bob@example.com",
      avatar: "https://avatars.githubusercontent.com/u/1002",
      bio: "CS student, love building with AI",
      school: "Tsinghua University",
      roles: JSON.stringify(["rider"]),
      profileCompleted: true,
    },
  });

  const carol = await prisma.user.upsert({
    where: { githubId: 1003 },
    update: {},
    create: {
      githubId: 1003,
      name: "Carol Li",
      email: "carol@example.com",
      avatar: "https://avatars.githubusercontent.com/u/1003",
      bio: "UX designer turned developer",
      school: "Zhejiang University",
      roles: JSON.stringify(["rider", "judge"]),
      profileCompleted: true,
    },
  });

  const dave = await prisma.user.upsert({
    where: { githubId: 1004 },
    update: {},
    create: {
      githubId: 1004,
      name: "Dave Chen",
      email: "dave@example.com",
      avatar: "https://avatars.githubusercontent.com/u/1004",
      bio: "Open source contributor",
      school: "Shanghai Jiao Tong University",
      roles: JSON.stringify(["rider"]),
      profileCompleted: true,
    },
  });

  const emma = await prisma.user.upsert({
    where: { githubId: 1005 },
    update: {},
    create: {
      githubId: 1005,
      name: "Emma Liu",
      email: "emma@example.com",
      avatar: "https://avatars.githubusercontent.com/u/1005",
      bio: "Professor & hackathon organizer",
      school: "Peking University",
      roles: JSON.stringify(["organizer", "judge", "admin"]),
      profileCompleted: true,
    },
  });

  const frank = await prisma.user.upsert({
    where: { githubId: 1006 },
    update: {},
    create: {
      githubId: 1006,
      name: "Frank Wu",
      email: "frank@example.com",
      avatar: "https://avatars.githubusercontent.com/u/1006",
      bio: "AI engineer",
      company: "TechCorp",
      roles: JSON.stringify(["rider"]),
      profileCompleted: true,
    },
  });

  const grace = await prisma.user.upsert({
    where: { githubId: 1007 },
    update: {},
    create: {
      githubId: 1007,
      name: "Grace Zhao",
      email: "grace@example.com",
      avatar: "https://avatars.githubusercontent.com/u/1007",
      bio: "Backend engineer",
      school: "Nanjing University",
      roles: JSON.stringify(["rider"]),
      profileCompleted: true,
    },
  });

  const admin = await prisma.user.upsert({
    where: { githubId: 9999 },
    update: {},
    create: {
      githubId: 9999,
      name: "ARY Admin",
      email: "admin@ary.dev",
      avatar: "https://avatars.githubusercontent.com/u/9999",
      bio: "System administrator",
      roles: JSON.stringify(["admin"]),
      profileCompleted: true,
    },
  });

  console.log(`Created ${8} users`);

  // ========== Races ==========

  // 1. Completed race
  const race1 = await prisma.race.create({
    data: {
      slug: "genesis-dogfood-race",
      title: "创世骑行挑战赛",
      subtitle: "ARY 自己的创世故事",
      description: "参赛者骑行 Coding Agent 打造 ARY 的第一场创世赛，从混乱起跑到作品冲线，形成平台自己的开场故事。",
      challenge: "用 Agent 协作开发 ARY 自身，让平台从第一场 self-dogfood Race 中诞生。",
      rules: "个人参赛，必须使用 Coding Agent 完成至少 80% 的代码产出。",
      schedule: JSON.stringify({
        registrationStart: "2026-03-01",
        registrationEnd: "2026-03-15",
        raceStart: "2026-03-16",
        raceEnd: "2026-03-30",
        submissionDeadline: "2026-03-30T23:59:59",
        judgingEnd: "2026-04-07",
      }),
      status: "completed",
      visibility: "public",
      awardSettings: JSON.stringify(["最佳自举作品", "最佳领域拆解", "最佳复盘"]),
      submissionRequirements: JSON.stringify({
        fields: ["title", "description", "demoUrl", "githubUrl", "techDescription"],
        format: "markdown",
      }),
      organizerId: emma.id,
    },
  });

  // 2. Running race (Featured)
  const race2 = await prisma.race.create({
    data: {
      slug: "bay-area-happy-trip",
      title: "湾区开心游",
      subtitle: "大湾区旅行伴随 Agent",
      description: "构建大湾区旅行、游玩伴随 Agent，像你身边手头的旅行达人和本地精英，让用户无所不知、玩得尽兴。",
      challenge: "让 Agent 能理解用户偏好、实时位置、预算、交通、天气和本地文化，生成可信、好玩、可执行的旅行陪伴方案。",
      rules: "个人参赛。Agent 需能接受实时输入并给出个性化建议。评分重点在实用性和体验。",
      schedule: JSON.stringify({
        registrationStart: "2026-05-01",
        registrationEnd: "2026-05-20",
        raceStart: "2026-05-21",
        raceEnd: "2026-06-10",
        submissionDeadline: "2026-06-10T23:59:59",
        judgingEnd: "2026-06-20",
      }),
      status: "running",
      visibility: "public",
      awardSettings: JSON.stringify(["最佳旅行Agent", "最佳用户体验", "最佳技术实现", "最佳成本控制"]),
      submissionRequirements: JSON.stringify({
        fields: ["title", "description", "demoUrl", "githubUrl", "videoUrl", "techDescription"],
        format: "markdown",
        note: "Demo 必须可交互",
      }),
      organizerId: emma.id,
    },
  });

  // 3. Registration race
  const race3 = await prisma.race.create({
    data: {
      slug: "merchant-copilot",
      title: "网商经营 Copilot",
      subtitle: "电商经营 AI 副驾驶",
      description: "开发一款帮助网商经营者分析数据、优化选品、生成营销文案和规划库存的 AI Copilot。",
      challenge: "让 Agent 成为商家日常经营中的决策伙伴，能理解电商数据并给出可执行的建议。",
      rules: "个人参赛。需使用至少一种 Coding Agent 完成开发。",
      schedule: JSON.stringify({
        registrationStart: "2026-06-01",
        registrationEnd: "2026-07-15",
        raceStart: "2026-07-16",
        raceEnd: "2026-08-05",
        submissionDeadline: "2026-08-05T23:59:59",
        judgingEnd: "2026-08-20",
      }),
      status: "registration",
      visibility: "public",
      awardSettings: JSON.stringify(["最佳商业洞察", "最佳技术方案", "最佳成本控制"]),
      submissionRequirements: JSON.stringify({
        fields: ["title", "description", "demoUrl", "githubUrl", "techDescription"],
        format: "markdown",
      }),
      organizerId: alice.id,
    },
  });

  // 4. Judging race
  const race4 = await prisma.race.create({
    data: {
      slug: "media-ops-agent",
      title: "自媒体运营 Agent",
      subtitle: "内容运营智能化",
      description: "开发一款可帮助主人规划选题、生成内容、发布排期、复盘数据和维护品牌语气的自媒体运营 Agent。",
      challenge: "让 Agent 像运营助理一样持续协助内容生产和复盘，而不是只生成一次文案。",
      rules: "个人参赛。需要展示 Agent 在内容运营全链路中的协作能力。",
      schedule: JSON.stringify({
        registrationStart: "2026-04-01",
        registrationEnd: "2026-04-20",
        raceStart: "2026-04-21",
        raceEnd: "2026-05-10",
        submissionDeadline: "2026-05-10T23:59:59",
        judgingEnd: "2026-07-15",
      }),
      status: "judging",
      visibility: "public",
      awardSettings: JSON.stringify(["最佳运营闭环", "最佳品牌语气", "最佳数据复盘"]),
      submissionRequirements: JSON.stringify({
        fields: ["title", "description", "demoUrl", "githubUrl", "videoUrl", "techDescription"],
        format: "markdown",
      }),
      organizerId: emma.id,
    },
  });

  // 5. Draft race
  const race5 = await prisma.race.create({
    data: {
      slug: "health-habit-coach",
      title: "健康习惯教练",
      subtitle: "AI 驱动的个人健康管理",
      description: "开发一款帮助用户建立和维持健康习惯的 AI 教练 Agent，涵盖饮食、运动、睡眠和心理健康。",
      challenge: "Agent 需要能根据用户数据定制个性化计划，并在长期互动中调整策略。",
      rules: "个人参赛。",
      schedule: JSON.stringify({}),
      status: "draft",
      visibility: "hidden",
      awardSettings: JSON.stringify([]),
      submissionRequirements: JSON.stringify({}),
      organizerId: alice.id,
    },
  });

  // 6. Archived race
  const race6 = await prisma.race.create({
    data: {
      slug: "gov-service-navigator",
      title: "政务办事导航 Agent",
      subtitle: "让政务服务更简单",
      description: "开发帮助市民理解政务流程、准备材料、导航办事的 AI Agent。",
      challenge: "将复杂的政务流程转化为简单、可操作的步骤引导，让市民少跑腿。",
      rules: "个人参赛。",
      schedule: JSON.stringify({
        registrationStart: "2026-01-01",
        registrationEnd: "2026-01-20",
        raceStart: "2026-01-21",
        raceEnd: "2026-02-10",
        submissionDeadline: "2026-02-10T23:59:59",
        judgingEnd: "2026-02-25",
      }),
      status: "archived",
      visibility: "public",
      awardSettings: JSON.stringify(["最佳公共服务", "最佳用户体验", "最佳技术实现"]),
      submissionRequirements: JSON.stringify({
        fields: ["title", "description", "demoUrl", "githubUrl", "techDescription"],
        format: "markdown",
      }),
      organizerId: emma.id,
    },
  });

  console.log(`Created ${6} races`);

  // ========== Registrations ==========
  // Race 1 (completed) registrations
  const reg1a = await prisma.registration.create({
    data: { userId: alice.id, raceId: race1.id, status: "approved", approvedAt: new Date("2026-03-15") },
  });
  const reg1b = await prisma.registration.create({
    data: { userId: bob.id, raceId: race1.id, status: "approved", approvedAt: new Date("2026-03-15") },
  });
  const reg1c = await prisma.registration.create({
    data: { userId: carol.id, raceId: race1.id, status: "approved", approvedAt: new Date("2026-03-15") },
  });

  // Race 2 (running) registrations
  const reg2a = await prisma.registration.create({
    data: { userId: bob.id, raceId: race2.id, status: "approved", approvedAt: new Date("2026-05-20") },
  });
  const reg2b = await prisma.registration.create({
    data: { userId: dave.id, raceId: race2.id, status: "approved", approvedAt: new Date("2026-05-20") },
  });
  const reg2c = await prisma.registration.create({
    data: { userId: frank.id, raceId: race2.id, status: "approved", approvedAt: new Date("2026-05-20") },
  });
  const reg2d = await prisma.registration.create({
    data: { userId: grace.id, raceId: race2.id, status: "approved", approvedAt: new Date("2026-05-20") },
  });

  // Race 3 (registration) registrations
  await prisma.registration.create({
    data: { userId: dave.id, raceId: race3.id, status: "submitted" },
  });
  await prisma.registration.create({
    data: { userId: frank.id, raceId: race3.id, status: "submitted" },
  });

  // Race 4 (judging) registrations
  const reg4a = await prisma.registration.create({
    data: { userId: alice.id, raceId: race4.id, status: "approved", approvedAt: new Date("2026-04-20") },
  });
  const reg4b = await prisma.registration.create({
    data: { userId: frank.id, raceId: race4.id, status: "approved", approvedAt: new Date("2026-04-20") },
  });
  const reg4c = await prisma.registration.create({
    data: { userId: grace.id, raceId: race4.id, status: "approved", approvedAt: new Date("2026-04-20") },
  });

  console.log("Created registrations");

  // ========== RaceProjects (auto-generated on approval) ==========
  await prisma.raceProject.createMany({
    data: [
      { registrationId: reg1a.id, aggregateIngestionStatus: "active", githubRepoUrl: "https://github.com/alice/ary-genesis" },
      { registrationId: reg1b.id, aggregateIngestionStatus: "active", githubRepoUrl: "https://github.com/bob/ary-genesis" },
      { registrationId: reg1c.id, aggregateIngestionStatus: "failed", githubRepoUrl: "https://github.com/carol/ary-genesis" },
      { registrationId: reg2a.id, aggregateIngestionStatus: "active", githubRepoUrl: "https://github.com/bob/bay-area-trip" },
      { registrationId: reg2b.id, aggregateIngestionStatus: "connected", githubRepoUrl: "https://github.com/dave/bay-area-trip" },
      { registrationId: reg2c.id, aggregateIngestionStatus: "active", githubRepoUrl: "https://github.com/frank/bay-area-trip" },
      { registrationId: reg2d.id, aggregateIngestionStatus: "not_configured" },
      { registrationId: reg4a.id, aggregateIngestionStatus: "active", githubRepoUrl: "https://github.com/alice/media-ops" },
      { registrationId: reg4b.id, aggregateIngestionStatus: "connected", githubRepoUrl: "https://github.com/frank/media-ops" },
      { registrationId: reg4c.id, aggregateIngestionStatus: "active", githubRepoUrl: "https://github.com/grace/media-ops" },
    ],
  });

  console.log("Created race projects");

  // ========== Works ==========
  const work1 = await prisma.work.create({
    data: {
      slug: "ary-platform-core",
      registrationId: reg1a.id,
      title: "ARY 平台核心引擎",
      description: "基于 Next.js + AI Agent 构建的赛事平台核心引擎，包含赛事管理、实时数据接入和评审系统。",
      demoUrl: "https://ary-demo.vercel.app",
      githubUrl: "https://github.com/alice/ary-genesis",
      techDescription: "使用 Next.js 14 App Router + TypeScript + Prisma + Tailwind CSS 构建全栈应用。Agent 完成了约 85% 的前端组件和 70% 的后端 API。",
      status: "submitted",
      visibility: "public",
    },
  });

  const work2 = await prisma.work.create({
    data: {
      slug: "agent-riding-dashboard",
      registrationId: reg1b.id,
      title: "Agent 骑行仪表盘",
      description: "实时展示 Agent 骑行过程的可视化仪表盘，支持成本、进度、风险跟踪和 Session 回放。",
      demoUrl: "https://riding-dash.vercel.app",
      githubUrl: "https://github.com/bob/ary-genesis",
      techDescription: "React + D3.js + WebSocket 实时数据推送。Agent 协作完成数据接入层和大屏组件。",
      status: "submitted",
      visibility: "public",
    },
  });

  const work3 = await prisma.work.create({
    data: {
      slug: "bay-area-travel-companion",
      registrationId: reg2a.id,
      title: "湾区旅行伴侣",
      description: "智能旅行规划 Agent，根据用户偏好实时生成个性化旅行方案。",
      demoUrl: "https://bay-travel.vercel.app",
      githubUrl: "https://github.com/bob/bay-area-trip",
      techDescription: "Next.js + LangChain + 地图 API 集成。Agent 完成 80% 的规划逻辑。",
      status: "submitted",
      visibility: "public",
    },
  });

  const work4 = await prisma.work.create({
    data: {
      slug: "gba-local-insider",
      registrationId: reg2c.id,
      title: "GBA 本地通",
      description: "大湾区本地生活达人 Agent，涵盖美食、景点、交通和文化活动。",
      demoUrl: "https://gba-insider.vercel.app",
      githubUrl: "https://github.com/frank/bay-area-trip",
      techDescription: "React Native + AI SDK。Agent 完成 UI 和推荐算法的核心实现。",
      status: "draft",
      visibility: "hidden",
    },
  });

  const work5 = await prisma.work.create({
    data: {
      slug: "content-ops-autopilot",
      registrationId: reg4a.id,
      title: "内容运营自动驾驶",
      description: "从选题到发布的全链路内容运营 Agent平台。",
      demoUrl: "https://content-ops.vercel.app",
      githubUrl: "https://github.com/alice/media-ops",
      techDescription: "Next.js + AI + CMS 集成。Agent 完成约 75% 的代码产出。",
      status: "submitted",
      visibility: "public",
    },
  });

  console.log("Created works");

  // ========== Judge Assignments + Judging Records (for completed race) ==========
  const assignment1 = await prisma.judgeAssignment.create({
    data: { workId: work1.id, judgeId: carol.id, assignedByUserId: emma.id },
  });
  const assignment2 = await prisma.judgeAssignment.create({
    data: { workId: work2.id, judgeId: emma.id, assignedByUserId: emma.id },
  });

  await prisma.judgingRecord.createMany({
    data: [
      {
        assignmentId: assignment1.id,
        scoreResult: 8.5,
        scoreRiding: 9.0,
        comments: "优秀的全栈平台实现，Agent 骑行过程清晰可追溯。技术方案扎实，代码结构清晰。",
        status: "submitted",
        submittedAt: new Date("2026-04-05"),
      },
      {
        assignmentId: assignment2.id,
        scoreResult: 8.0,
        scoreRiding: 8.5,
        comments: "可视化设计出色，实时数据展示流畅。建议增强数据导出和分析能力。",
        status: "submitted",
        submittedAt: new Date("2026-04-06"),
      },
    ],
  });

  console.log("Created judge assignments and judging records");

  // ========== Awards (for completed race) ==========
  await prisma.award.createMany({
    data: [
      {
        raceId: race1.id,
        registrationId: reg1a.id,
        workId: work1.id,
        awardName: "最佳自举作品",
        rank: 1,
        decisionReason: "从零构建了完整的 ARY 平台核心，代码产出质量高，Agent 骑行过程与方法论清晰。",
        publishedAt: new Date("2026-04-10"),
      },
      {
        raceId: race1.id,
        registrationId: reg1b.id,
        workId: work2.id,
        awardName: "最佳自举作品",
        rank: 2,
        decisionReason: "可视化仪表盘设计出色，为 Agent 骑行过程提供了直观的监控和复盘工具。",
        publishedAt: new Date("2026-04-10"),
      },
      {
        raceId: race1.id,
        registrationId: reg1a.id,
        workId: work1.id,
        awardName: "最佳领域拆解",
        rank: 1,
        decisionReason: "对赛事平台领域的问题拆解精准，技术方案和产品设计高度对齐。",
        publishedAt: new Date("2026-04-10"),
      },
      {
        raceId: race1.id,
        registrationId: reg1b.id,
        workId: work2.id,
        awardName: "最佳复盘",
        rank: 1,
        decisionReason: "骑行过程记录完整，对 Agent 协作中的关键决策和纠偏有深刻反思。",
        publishedAt: new Date("2026-04-10"),
      },
    ],
  });

  console.log("Created awards");

  // ========== Evidence ==========
  await prisma.evidence.createMany({
    data: [
      {
        registrationId: reg1a.id,
        type: "session_summary",
        title: "ARY 核心引擎 Agent 骑行摘要",
        summary: "共 37 个 Session，总 token 消耗 2.1M，关键纠偏 12 次，平均完成率 85%。",
        sourceRef: JSON.stringify({ sessions: 37, totalTokens: 2100000, corrections: 12 }),
        visibility: "public",
      },
      {
        registrationId: reg1b.id,
        type: "session_summary",
        title: "仪表盘开发 Agent 骑行摘要",
        summary: "共 28 个 Session，总 token 消耗 1.5M，关键纠偏 8 次。",
        sourceRef: JSON.stringify({ sessions: 28, totalTokens: 1500000, corrections: 8 }),
        visibility: "public",
      },
      {
        registrationId: reg2a.id,
        type: "session_summary",
        title: "湾区旅行伴侣骑行中 - 进度报告",
        summary: "已完成 15 个 Session，当前进度 65%，预计按时完成。",
        sourceRef: JSON.stringify({ sessions: 15, progress: 0.65 }),
        visibility: "internal",
      },
    ],
  });

  console.log("Created evidence");

  // ========== Reports ==========
  await prisma.report.create({
    data: {
      raceId: race1.id,
      type: "race_report",
      status: "published",
      content: `# 创世骑行挑战赛 - 赛事报告\n\n## 赛事概览\n- 参赛人数: 18\n- 提交作品: 12\n- 公开作品: 8\n- 总 Session 数: 143\n\n## 关键发现\n1. 使用 Agent 的开发者平均效率提升 3-5 倍\n2. 关键成功因素: 清晰的任务拆解 + 及时的纠偏\n3. 主要挑战: 需求变更时的 Agent 方向调整\n\n## 优秀作品\n- ARY 平台核心引擎 (Alice Wang)\n- Agent 骑行仪表盘 (Bob Zhang)`,
      generatedAt: new Date("2026-04-08"),
      publishedAt: new Date("2026-04-12"),
    },
  });

  await prisma.report.create({
    data: {
      raceId: race1.id,
      type: "rider_report",
      status: "published",
      subjectRegistrationId: reg1a.id,
      content: `# 选手报告 - Alice Wang\n\n## 骑行表现\n- 总 Session: 37\n- Token 消耗: 2.1M\n- 关键纠偏: 12次\n- 完成率: 85%\n\n## 能力评估\n- 目标拆解: 9/10\n- Agent 协同: 8.5/10\n- 纠偏能力: 9/10\n- 技术判断: 8.5/10\n- 成本控制: 8/10\n- 复盘表达: 9/10\n\n## 建议\n建议在大型项目中使用更细粒度的 Agent prompt 模板以提高首轮准确率。`,
      generatedAt: new Date("2026-04-08"),
      publishedAt: new Date("2026-04-12"),
    },
  });

  await prisma.report.create({
    data: {
      raceId: race1.id,
      type: "review_summary",
      status: "published",
      content: `# 评审总结 - 创世骑行挑战赛\n\n## 评审概况\n评委们一致认为第一届 ARY 创世赛成功验证了 Agent Racing 的核心理念。作品质量超出预期，参赛者展现了出色的 Agent 驾驭能力。\n\n## 关键洞察\n1. Agent 骑行方法论开始形成\n2. 过程数据对评审有重要参考价值\n3. 纠偏能力成为区分优秀骑手的关键指标`,
      generatedAt: new Date("2026-04-09"),
      publishedAt: new Date("2026-04-13"),
    },
  });

  console.log("Created reports");

  // ========== Announcements ==========
  await prisma.announcement.createMany({
    data: [
      {
        raceId: race2.id,
        title: "比赛进入冲刺阶段",
        body: "距离提交截止还有 5 天！请尽快完成作品并提交。如遇到 CA 接入问题，请及时联系主办方。",
        visibility: "public",
      },
      {
        raceId: race2.id,
        title: "本周五 Live Hall 特别展示",
        body: "本周五 20:00 将在 Live Hall 展示当前领先骑手的实时骑行过程，欢迎大家观看！",
        visibility: "public",
      },
      {
        raceId: race4.id,
        title: "评审进行中",
        body: "目前已完成 60% 的作品评审，预计 7 月 15 日公布结果。",
        visibility: "public",
      },
    ],
  });

  console.log("Created announcements");

  // ========== CA Connections + Sessions + RidingMetrics (第5棒 T5.6) ==========

  // -- Race 2 (running) CA 数据 --
  const rp2a = await prisma.raceProject.findUnique({ where: { registrationId: reg2a.id } });
  const rp2b = await prisma.raceProject.findUnique({ where: { registrationId: reg2b.id } });
  const rp2c = await prisma.raceProject.findUnique({ where: { registrationId: reg2c.id } });
  const rp2d = await prisma.raceProject.findUnique({ where: { registrationId: reg2d.id } });

  const conn2a = await prisma.cAConnection.create({
    data: {
      raceProjectId: rp2a!.id,
      caType: "claude_code",
      ingestionSource: "ca_realtime",
      connectorId: "conn-bob-bay",
      connectorVersion: "1.2.0",
      externalProjectRef: "bob/bay-area-trip",
      ingestionStatus: "active",
      registeredAt: new Date("2026-05-21"),
      handshakeAt: new Date("2026-05-21"),
    },
  });
  const conn2b = await prisma.cAConnection.create({
    data: {
      raceProjectId: rp2b!.id,
      caType: "codex",
      ingestionSource: "ca_realtime",
      connectorId: "conn-dave-bay",
      connectorVersion: "2.0.1",
      externalProjectRef: "dave/bay-area-trip",
      ingestionStatus: "connected",
      registeredAt: new Date("2026-05-22"),
      handshakeAt: new Date("2026-05-22"),
    },
  });
  const conn2c = await prisma.cAConnection.create({
    data: {
      raceProjectId: rp2c!.id,
      caType: "claude_code",
      ingestionSource: "ca_realtime",
      connectorId: "conn-frank-bay",
      connectorVersion: "1.3.1",
      externalProjectRef: "frank/bay-area-trip",
      ingestionStatus: "active",
      registeredAt: new Date("2026-05-21"),
      handshakeAt: new Date("2026-05-21"),
    },
  });

  // Grace (reg2d) has no CA connection configured (not_configured → 风险提示场景)

  // Generate CASessions for each connection
  const now = new Date();
  const sessionData2a = Array.from({ length: 12 }, (_, i) => ({
    caConnectionId: conn2a.id,
    summary: JSON.stringify({ totalMessages: 20 + i * 3, totalToolCalls: 5 + i, peakConcurrency: 2, modelUsed: "claude-sonnet-5" }),
    startedAt: new Date(now.getTime() - (12 - i) * 4 * 60 * 60 * 1000),
    endedAt: new Date(now.getTime() - (12 - i) * 4 * 60 * 60 * 1000 + (30 + i * 5) * 60 * 1000),
    messageCount: 25 + i * 4,
    toolCallCount: 6 + i,
    tokenCost: 8000 + i * 3000,
  }));
  await prisma.cASession.createMany({ data: sessionData2a });

  const sessionData2b = Array.from({ length: 8 }, (_, i) => ({
    caConnectionId: conn2b.id,
    summary: JSON.stringify({ totalMessages: 15 + i * 2, totalToolCalls: 3 + i, peakConcurrency: 1, modelUsed: "codex" }),
    startedAt: new Date(now.getTime() - (8 - i) * 5 * 60 * 60 * 1000),
    endedAt: new Date(now.getTime() - (8 - i) * 5 * 60 * 60 * 1000 + (20 + i * 3) * 60 * 1000),
    messageCount: 18 + i * 3,
    toolCallCount: 4 + i,
    tokenCost: 5000 + i * 2000,
  }));
  await prisma.cASession.createMany({ data: sessionData2b });

  const sessionData2c = Array.from({ length: 10 }, (_, i) => ({
    caConnectionId: conn2c.id,
    summary: JSON.stringify({ totalMessages: 30 + i * 2, totalToolCalls: 8 + i, peakConcurrency: 3, modelUsed: "claude-opus-4-8" }),
    startedAt: new Date(now.getTime() - (10 - i) * 3 * 60 * 60 * 1000),
    endedAt: new Date(now.getTime() - (10 - i) * 3 * 60 * 60 * 1000 + (25 + i * 4) * 60 * 1000),
    messageCount: 35 + i * 5,
    toolCallCount: 10 + i,
    tokenCost: 12000 + i * 4000,
  }));
  await prisma.cASession.createMany({ data: sessionData2c });

  // RidingMetrics for running race
  await prisma.ridingMetrics.createMany({
    data: [
      {
        caConnectionId: conn2a.id,
        costSummary: JSON.stringify({ totalTokenCost: 180000, estimatedUsdCost: 2.7, avgCostPerSession: 15000, costEfficiency: "高效", trend: "stable" }),
        progressSummary: JSON.stringify({ completionPercent: 78, milestonesCompleted: 3, totalMilestones: 5, estimatedRemaining: 15 }),
        riskSummary: JSON.stringify({ level: "low", signals: [], recommendation: "目前表现正常" }),
        skillSummary: JSON.stringify({ targetDecomposition: 9, agentCollaboration: 8, correctionAbility: 7, technicalJudgment: 8, costControl: 9, reviewExpression: 8 }),
      },
      {
        caConnectionId: conn2b.id,
        costSummary: JSON.stringify({ totalTokenCost: 72000, estimatedUsdCost: 1.08, avgCostPerSession: 9000, costEfficiency: "高效", trend: "falling" }),
        progressSummary: JSON.stringify({ completionPercent: 45, milestonesCompleted: 2, totalMilestones: 5, estimatedRemaining: 35 }),
        riskSummary: JSON.stringify({ level: "medium", signals: ["作品仓库长时间无 commit"], recommendation: "持续观察，暂无阻塞风险" }),
        skillSummary: JSON.stringify({ targetDecomposition: 7, agentCollaboration: 6, correctionAbility: 7, technicalJudgment: 7, costControl: 8, reviewExpression: 6 }),
      },
      {
        caConnectionId: conn2c.id,
        costSummary: JSON.stringify({ totalTokenCost: 220000, estimatedUsdCost: 3.3, avgCostPerSession: 22000, costEfficiency: "偏高", trend: "rising" }),
        progressSummary: JSON.stringify({ completionPercent: 65, milestonesCompleted: 3, totalMilestones: 5, estimatedRemaining: 25 }),
        riskSummary: JSON.stringify({ level: "low", signals: [], recommendation: "目前表现正常" }),
        skillSummary: JSON.stringify({ targetDecomposition: 8, agentCollaboration: 9, correctionAbility: 8, technicalJudgment: 9, costControl: 6, reviewExpression: 7 }),
      },
    ],
  });

  // -- Race 4 (judging) CA 数据 --
  const rp4a = await prisma.raceProject.findUnique({ where: { registrationId: reg4a.id } });
  const rp4b = await prisma.raceProject.findUnique({ where: { registrationId: reg4b.id } });
  const rp4c = await prisma.raceProject.findUnique({ where: { registrationId: reg4c.id } });

  const conn4a = await prisma.cAConnection.create({
    data: {
      raceProjectId: rp4a!.id,
      caType: "claude_code",
      ingestionSource: "ca_realtime",
      connectorId: "conn-alice-media",
      connectorVersion: "1.2.0",
      externalProjectRef: "alice/media-ops",
      ingestionStatus: "active",
      registeredAt: new Date("2026-04-21"),
      handshakeAt: new Date("2026-04-21"),
    },
  });
  const conn4b = await prisma.cAConnection.create({
    data: {
      raceProjectId: rp4b!.id,
      caType: "codex",
      ingestionSource: "ca_realtime",
      connectorId: "conn-frank-media",
      connectorVersion: "2.0.1",
      externalProjectRef: "frank/media-ops",
      ingestionStatus: "connected",
      registeredAt: new Date("2026-04-22"),
      handshakeAt: new Date("2026-04-22"),
    },
  });
  const conn4c = await prisma.cAConnection.create({
    data: {
      raceProjectId: rp4c!.id,
      caType: "claude_code",
      ingestionSource: "ca_realtime",
      connectorId: "conn-grace-media",
      connectorVersion: "1.3.0",
      externalProjectRef: "grace/media-ops",
      ingestionStatus: "active",
      registeredAt: new Date("2026-04-21"),
      handshakeAt: new Date("2026-04-21"),
    },
  });

  const baseTime4 = new Date("2026-05-05").getTime();
  await prisma.cASession.createMany({
    data: [
      ...Array.from({ length: 15 }, (_, i) => ({
        caConnectionId: conn4a.id,
        summary: JSON.stringify({ totalMessages: 25 + i * 2, totalToolCalls: 7 + i, peakConcurrency: 2, modelUsed: "claude-sonnet-5" }),
        startedAt: new Date(baseTime4 - (15 - i) * 3 * 60 * 60 * 1000),
        endedAt: new Date(baseTime4 - (15 - i) * 3 * 60 * 60 * 1000 + (30 + i * 5) * 60 * 1000),
        messageCount: 30 + i * 3,
        toolCallCount: 8 + i,
        tokenCost: 10000 + i * 2500,
      })),
      ...Array.from({ length: 10 }, (_, i) => ({
        caConnectionId: conn4b.id,
        summary: JSON.stringify({ totalMessages: 20 + i, totalToolCalls: 5 + i, peakConcurrency: 1, modelUsed: "codex" }),
        startedAt: new Date(baseTime4 - (10 - i) * 4 * 60 * 60 * 1000),
        endedAt: new Date(baseTime4 - (10 - i) * 4 * 60 * 60 * 1000 + (20 + i * 3) * 60 * 1000),
        messageCount: 22 + i * 2,
        toolCallCount: 5 + i,
        tokenCost: 6000 + i * 2000,
      })),
      ...Array.from({ length: 12 }, (_, i) => ({
        caConnectionId: conn4c.id,
        summary: JSON.stringify({ totalMessages: 28 + i * 2, totalToolCalls: 6 + i, peakConcurrency: 2, modelUsed: "claude-opus-4-8" }),
        startedAt: new Date(baseTime4 - (12 - i) * 3 * 60 * 60 * 1000),
        endedAt: new Date(baseTime4 - (12 - i) * 3 * 60 * 60 * 1000 + (25 + i * 4) * 60 * 1000),
        messageCount: 32 + i * 4,
        toolCallCount: 8 + i,
        tokenCost: 9000 + i * 3000,
      })),
    ],
  });

  await prisma.ridingMetrics.createMany({
    data: [
      {
        caConnectionId: conn4a.id,
        costSummary: JSON.stringify({ totalTokenCost: 210000, estimatedUsdCost: 3.15, avgCostPerSession: 14000, costEfficiency: "正常", trend: "stable" }),
        progressSummary: JSON.stringify({ completionPercent: 85, milestonesCompleted: 4, totalMilestones: 5, estimatedRemaining: 10 }),
        riskSummary: JSON.stringify({ level: "low", signals: [], recommendation: "目前表现正常" }),
        skillSummary: JSON.stringify({ targetDecomposition: 9, agentCollaboration: 8, correctionAbility: 9, technicalJudgment: 8, costControl: 8, reviewExpression: 9 }),
      },
      {
        caConnectionId: conn4b.id,
        costSummary: JSON.stringify({ totalTokenCost: 90000, estimatedUsdCost: 1.35, avgCostPerSession: 9000, costEfficiency: "高效", trend: "falling" }),
        progressSummary: JSON.stringify({ completionPercent: 65, milestonesCompleted: 3, totalMilestones: 5, estimatedRemaining: 25 }),
        riskSummary: JSON.stringify({ level: "medium", signals: ["大量工具调用失败重试"], recommendation: "持续观察，暂无阻塞风险" }),
        skillSummary: JSON.stringify({ targetDecomposition: 7, agentCollaboration: 6, correctionAbility: 7, technicalJudgment: 7, costControl: 9, reviewExpression: 6 }),
      },
      {
        caConnectionId: conn4c.id,
        costSummary: JSON.stringify({ totalTokenCost: 150000, estimatedUsdCost: 2.25, avgCostPerSession: 12500, costEfficiency: "正常", trend: "stable" }),
        progressSummary: JSON.stringify({ completionPercent: 75, milestonesCompleted: 3, totalMilestones: 5, estimatedRemaining: 20 }),
        riskSummary: JSON.stringify({ level: "low", signals: [], recommendation: "目前表现正常" }),
        skillSummary: JSON.stringify({ targetDecomposition: 8, agentCollaboration: 8, correctionAbility: 8, technicalJudgment: 8, costControl: 7, reviewExpression: 8 }),
      },
    ],
  });

  // Judge assignments + records for judging race (media-ops-agent)
  const assignment4a = await prisma.judgeAssignment.create({
    data: { workId: work5.id, judgeId: carol.id, assignedByUserId: emma.id },
  });

  await prisma.judgingRecord.create({
    data: {
      assignmentId: assignment4a.id,
      scoreResult: 7.0,
      scoreRiding: 7.5,
      comments: "运营闭环设计思路清晰，但品牌语气一致性和多平台分发策略还需加强。Agent 骑行过程有较好的纠偏记录。",
      status: "submitted",
      submittedAt: new Date("2026-07-01"),
    },
  });

  console.log("Created CA connections, sessions, and riding metrics (T5.6)");

  // ========== Enhanced Projections (第5棒 T5.6) ==========
  await prisma.projection.createMany({
    data: [
      // Running race projections (updated with richer data)
      {
        raceId: race2.id,
        type: "race_progress",
        data: JSON.stringify({
          totalRiders: 4,
          activeRiders: 3,
          sessionsStarted: 30,
          worksSubmitted: 1,
          averageProgress: 63,
          totalTokens: 472000,
          totalCost: 7.08,
          highRiskRiders: 1,
        }),
        lastRebuiltAt: new Date(),
      },
      {
        raceId: race2.id,
        type: "current_leaderboard",
        data: JSON.stringify({
          rankings: [
            { riderName: "Bob Zhang", progress: 78, cost: 2.70, risk: "low" },
            { riderName: "Frank Wu", progress: 65, cost: 3.30, risk: "low" },
            { riderName: "Dave Chen", progress: 45, cost: 1.08, risk: "medium" },
            { riderName: "Grace Zhao", progress: 15, cost: 0, risk: "high" },
          ],
        }),
        lastRebuiltAt: new Date(),
      },
      {
        raceId: race2.id,
        type: "cost",
        data: JSON.stringify({
          totalTokenCost: 472000,
          totalUsdCost: 7.08,
          averageTokenCost: 118000,
          perRider: [
            { riderName: "Frank Wu", tokenCost: 220000, usdCost: 3.30 },
            { riderName: "Bob Zhang", tokenCost: 180000, usdCost: 2.70 },
            { riderName: "Dave Chen", tokenCost: 72000, usdCost: 1.08 },
            { riderName: "Grace Zhao", tokenCost: 0, usdCost: 0 },
          ],
        }),
        lastRebuiltAt: new Date(),
      },
      {
        raceId: race2.id,
        type: "risk",
        data: JSON.stringify({
          summary: { low: 2, medium: 1, high: 1, total: 4 },
          highRiskDetails: [
            { riderName: "Grace Zhao", signals: ["RidingMetrics 进度停滞超过 24h", "CAConnection 未配置"], progress: 15 },
          ],
        }),
        lastRebuiltAt: new Date(),
      },
      {
        raceId: race2.id,
        type: "screen_feed",
        data: JSON.stringify({
          events: [
            { id: "e1", type: "announcement", title: "比赛进入冲刺阶段", description: "距离提交截止还有 5 天！请尽快完成作品并提交。", occurredAt: new Date().toISOString() },
            { id: "e2", type: "announcement", title: "本周五 Live Hall 特别展示", description: "本周五 20:00 将在 Live Hall 展示当前领先骑手的实时骑行过程。", occurredAt: new Date(Date.now() - 3600000).toISOString() },
            { id: "e3", type: "session", title: "Bob Zhang 完成了一次骑行", description: "消息: 68, 工具调用: 17", occurredAt: new Date(Date.now() - 7200000).toISOString() },
            { id: "e4", type: "session", title: "Frank Wu 完成了一次骑行", description: "消息: 75, 工具调用: 19", occurredAt: new Date(Date.now() - 10800000).toISOString() },
          ],
        }),
        lastRebuiltAt: new Date(),
      },
      // Judging race projections
      {
        raceId: race4.id,
        type: "race_progress",
        data: JSON.stringify({
          totalRiders: 3,
          activeRiders: 0,
          sessionsStarted: 37,
          worksSubmitted: 1,
          averageProgress: 75,
          totalTokens: 450000,
          totalCost: 6.75,
          highRiskRiders: 0,
        }),
        lastRebuiltAt: new Date(),
      },
      {
        raceId: race4.id,
        type: "current_leaderboard",
        data: JSON.stringify({
          rankings: [
            { riderName: "Alice Wang", progress: 85, cost: 3.15, risk: "low" },
            { riderName: "Grace Zhao", progress: 75, cost: 2.25, risk: "low" },
            { riderName: "Frank Wu", progress: 65, cost: 1.35, risk: "medium" },
          ],
        }),
        lastRebuiltAt: new Date(),
      },
    ],
  });

  // Update RaceProject aggregate statuses to reflect CA data
  await prisma.raceProject.update({ where: { registrationId: reg2a.id }, data: { aggregateIngestionStatus: "active", connectionHealth: JSON.stringify({ connections: 1, active: 1, sessions: 12 }) } });
  await prisma.raceProject.update({ where: { registrationId: reg2b.id }, data: { aggregateIngestionStatus: "connected", connectionHealth: JSON.stringify({ connections: 1, active: 0, sessions: 8 }) } });
  await prisma.raceProject.update({ where: { registrationId: reg2c.id }, data: { aggregateIngestionStatus: "active", connectionHealth: JSON.stringify({ connections: 1, active: 1, sessions: 10 }) } });
  await prisma.raceProject.update({ where: { registrationId: reg4a.id }, data: { aggregateIngestionStatus: "active", connectionHealth: JSON.stringify({ connections: 1, active: 1, sessions: 15 }) } });
  await prisma.raceProject.update({ where: { registrationId: reg4b.id }, data: { aggregateIngestionStatus: "connected", connectionHealth: JSON.stringify({ connections: 1, active: 0, sessions: 10 }) } });
  await prisma.raceProject.update({ where: { registrationId: reg4c.id }, data: { aggregateIngestionStatus: "active", connectionHealth: JSON.stringify({ connections: 1, active: 1, sessions: 12 }) } });

  console.log("Created enhanced projections (T5.6)");
  console.log("\nSeed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
