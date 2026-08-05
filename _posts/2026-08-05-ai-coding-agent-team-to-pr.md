---
layout: post
title: "AI 编码：从 Agent 团队到 PR"
date: 2026-08-05
categories: [Blog]
tags: [Agent, AI, 软件设计, 产品设计]
---


通用汽车（GM）自动驾驶部门最近公开了一组数字：重新设计工程工作流、把 AI agent 嵌入日常之后，合并的 PR 翻了三倍；而在此之前，工程师只有 15% 的时间真正在写代码。也就是说，整个team花大量时间干的不是 coding，是上下文切换、等 CI、找人 review、确认"这个改动会不会把别的地方带崩"。
其实和我个人现在的感受基本是一样的，我花在沟通和审核上的时间要比编码的时间多多了。之前用三篇文章讲了我整个开发的工作流，这篇给大家说一下项目现在整体比较成熟的情况下，我怎么做的一个issue-driven的工作流。

---

## 先把"自动"说清楚：不是替你写代码，是替你跑完一个工程师的闭环
我在之前的文章中强调过很多次，agent 的核心价值不是"写"，而是"跑完闭环"。

一个软件工程师接到一条工单，真正的工作流至少包括：

1. **读题**：理解 issue 描述、业务上下文、验收标准；
2. **查上下文**：grep 代码、看文档、翻历史 PR；
3. **做规划**：拆步骤，决定改哪些文件，先写什么测试；
4. **写 + 测**：编码、跑 lint、跑单测、debug；
5. **开 PR**：写清楚改动摘要、关联 issue、推分支；
6. **应审**： reviewer 提意见，返工；
7. **合并**：人类把关后合进主线。

agent解决的是第 4 步"写"；而 AI 编码代理团队解决的是从 1 到 5 的整条链路，并且把第 6 步变成了一个"你打回、它返工"的异步循环。

## 二、一条工单怎么变成 PR

我把这条链路画成了一张图。你可以把它理解成一个"微型的工程流水线"，每个节点都有明确的交付物，而不是黑盒。

![工单到 PR 的全景闭环](/assets/img/posts/2026-08-05-ai-coding-agent-team-to-pr/01-flow.png)

七个节点的分工如下：

| 节点 | agent 在干什么 | 人类在干什么 | 关键产出 |
|---|---|---|---|
| 工单触发 | 监听 issue、label、@指派 | 写清楚 issue / AGENTS.md | 一份可验收的任务描述 |
| 规划 Plan | 先给出执行方案，不直接写码 | 审方案、纠偏 | 被 approved 的 plan |
| 派发 Dispatch | 决定单 agent 上还是 worktree 编队 | 设置策略、分配资源 | 进入 sandbox 的任务 |
| 执行 Execute | grep、读代码、写、测、自修 | 偶尔被叫进去看日志 | 通过本地测试的改动 |
| 草稿 PR | 推 [WIP] 分支、写摘要 | 收到通知 | 一份可 diff 的 PR |
| 评审闭环 | 读 review 意见、返工 | 打回、@copilot 迭代 | 过审的 PR |
| 合并 Merge | **不能自合** | 人类把关后 merge | 进主线的改动 |

注意两个关键设计：

- **规划节点前置**：执行前先给人类看 plan。要把最便宜的"纠偏"时机提前，而不是等 40 个文件改完再发现方向错了。
- **评审闭环可打回**：agent 不是"一枪头"。你在 PR 下评论 `@copilot 这里用错了字段`，它会回到执行节点重跑，直到你过审。

---

## 三、从"一个代理"到"一支团队"：为什么角色要分开

如果只是让单个 agent 跑完上面七个节点，它就已经很强了。但真正让它逼近"一个团队"的，是**把角色拆开**。

![一支 AI 编码代理团队：一个工单，四种角色](/assets/img/posts/2026-08-05-ai-coding-agent-team-to-pr/02-roles.png)

这四个角色不一定需要四个进程，可以由同一个 agent 顺次扮演，也可以拆成独立 agent，我就是在复用我之前文章中提到的agents来做：

- **PM Agent**：把模糊需求拆成可验收的子任务。工单写得越清楚，后面翻车概率越低。
- **Coder Agent**：在 sandbox 里实际写代码、跑测试、自修 bug。
- **Reviewer Agent**：专门审 diff、做安全扫描、检查命名规范和副作用。
- **Tester Agent**：补测试、跑回归，证明"这个改动真的对"。

重点是：写的人和审的人不能是同一个上下文。一个人写的代码自己看总觉得很顺，AI 也一样。让 reviewer 用另一份 prompt、另一组规则去挑毛病，能显著降低幻觉和遗漏。

---

## 四、并行编队：Git Worktree 让多个 agent 互不干涉

角色分开之后，下一步就是**并行**。

![Git Worktree 并行编队](/assets/img/posts/2026-08-05-ai-coding-agent-team-to-pr/03-worktree.png)

传统做法是：一个 agent 在主分支上改，另一个来了只能等。用 worktree 之后：

- agent α 在 `fix-login` 里修登录；
- agent β 在 `add-pagination` 里加分页；
- agent γ 在 `perf-cache` 里做缓存优化；

它们共用同一个 `.git`，但工作目录隔离，所以不会互相覆盖未提交的改动。每个 agent 改完直接往自己的分支推一份草稿 PR，人类在 review 端统一合并。你不需要真招三个人，就能让三个并行的"数字同事"在同一代码库上各干各的。

---

## 五、两种我自己实践过的落地方式

好了，上面是思路。下面是两种我自己实践过的落地方式。

### 路径 A：GitHub Agent（最省事，零基建）

如果你已经在用 GitHub管理项目，这是最简单的一条路。现在主流的编程的 cli 和 gui 都可以直接连 GitHub。

**核心流程：**

1. 在仓库里建一个 GitHub Issue，写清楚要做什么；
2. 把 issue assign 给 `@对应的 agent，譬如@codex`（或在 PR 评论里）；
3. Copilot 在 GitHub Actions 的临时容器里启动，读代码、改代码、跑测试；
4. 它自动开一个draft PR，标题和描述都帮你写好；
5. 你在 PR 下评论 `@对应agent 这里改一下`，它循环迭代；
6. 你审过、CI 过、自己 merge。

如果是 GitHub 自己的 coploit 就更方便了。

**一次性的 setup 只需要两步：**

第一步，建一个 setup workflow，让 agent 启动时环境已经 ready：

```yaml
# .github/workflows/copilot-setup-steps.yml
name: Copilot Setup Steps
on: workflow_dispatch
jobs:
  copilot-setup-steps:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install dependencies
        run: |
          npm install          # 或 pip install -r requirements.txt
          # 这里放你项目需要的任何环境准备
```

第二步，也是**最重要的一步**：写 `AGENTS.md`。

一份好的 `AGENTS.md` 长这样：

```markdown
# Project Overview
一个基于 Next.js 15 + TypeScript 的后台管理系统。

## Tech Stack
- Framework: Next.js 15 (App Router)
- Language: TypeScript 5.x
- DB: PostgreSQL (via Prisma)
- Testing: Vitest + Testing Library

## Build & Test
- 构建: pnpm build
- 测试: pnpm test
- 类型检查: pnpm typecheck

## Code Standards
- 新功能必须补单元测试
- API 输入校验用 Zod
- 命名和 commit message 都用英文

## Project Structure
- app/: Next.js 路由页面
- components/: 共享 UI 组件
- lib/: 工具函数和 DB 操作
- tests/: 测试文件
```

**Coding Agent 的关键限制（也是护栏）：**

- 一个 issue 只能开一个 PR；
- 只能推分支，不能碰 main；
- 触发 agent 的人不能 approve 这份 PR；
- 默认会跑 CodeQL、secret scanning、dependency check；
- 不能自己 merge。

---

### 路径 B：OpenHands（开源自托管，掌控沙箱与模型）

因为最近代码搬运到自己的服务器上了，所以需要有一个工具来搭建本地的流程。如果你想要本地的 sandbox、自己的模型、自己的日志，**OpenHands** 是目前最成熟的开源方案。

**最快上手（一行命令）：**

```bash
# 用 uv 起 Python 3.12 环境，不污染全局
uvx --python 3.12 --from openhands-ai openhands
```

如果你用 Docker：

```bash
WORKSPACE_BASE=$(pwd)/my-project

docker run -it \
  -e WORKSPACE_MOUNT_PATH=$WORKSPACE_BASE \
  -v $WORKSPACE_BASE:/opt/workspace_base \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -p 3000:3000 \
  docker.all-hands.dev/all-hands-ai/openhands:main
```

**它的优势：**

- **模型自选**：Claude、GPT、Gemini、本地模型都能接；
- **沙箱自己管**：Docker 隔离，代码不离开你的机器；
- **完整 agent loop**：读 issue、规划、写代码、跑命令、debug、开 PR；
- **CodeAct 架构**：agent 直接执行代码/命令，动作空间比固定 tool call 大，但也要求 sandbox 真的要隔离。

--- 

## 六、护栏与边界：全自动不等于无人

这张图是我最想让你记住的。

![Human-in-the-loop 关卡](/assets/img/posts/2026-08-05-ai-coding-agent-team-to-pr/04-gate.png)

agent 很强，但有几个底线不能交出去：

1. **合并权在人手上**

   这是所有靠谱产品的共同设计。不要绕过这个规则。

2. **模糊工单 = 最大风险源**

   如果你只写"修一下登录"，agent 很可能给你一份"看起来对但实际不符合业务"的 PR。最安全的做法是：**issue必须包含验收标准、输入输出示例、可能影响的模块**。可以参考我之前文章中给过的 issue 模板。

3. **凭据和依赖不能盲目信任**

   agent 会读代码、会跑命令、会安装依赖。如果仓库里有恶意依赖，或者 agent 被诱导泄露 secrets，它比人类更没抵抗力。repo 的权限设置可以更好地规避风险。
   
4. **OpenLore 这类 guardrails 会越来越重要**

   最近 HN 上另一个开源项目 **OpenLore** 做了件事：给 agent 加 **deterministic, local-first memory and guardrails**。简单说，就是让 agent 的"记忆"和"不能越过的规则"本地、可审计、可版本化。这对长期运行、多 agent 协作的场景非常关键。

所以我的态度是：让 agent 跑闭环，但永远保留最后一道审计 gate。"全自动"省的是体力，不是判断力。

