---
layout: post
title: "少做一点反而更好，Pi 极简哲学详解"
date: 2026-08-14
categories: [Blog]
tags: [Agent, Pi, harness, AI工程]
---

# 少做一点反而更好，Pi 极简哲学详解

Pi 是一个极简的 coding agent harness。它的设计思路就一条，把核心压到最小。默认只给模型 4 个工具，read、write、edit、bash。系统提示词压到几百 token，而主流 coding agent 动辄烧掉七千到一万 token 才等你开口。plan mode、sub-agent、MCP、权限系统，它一律不往核心里塞，全推到扩展层，核心之外你用 TypeScript 自己写、自己审。它甚至连这些没做的东西都要写进 README，专门留了一整节叫 Here's What We Didn't Build。

Pi很适合作为Agent学习的入口。Agent 这个词被讲得很玄，自主规划、工具调用、反思循环，听着像另一种生命。但 Pi 把所有这些外在的东西剥掉以后，底下只剩一个你能从头读到尾的小东西。有人用 600 行 TypeScript 把 Pi 的核心逻辑重写了一遍。你读完就明白，Agent 没有魔法，它就是一个 while 循环加几个工具函数。看懂这一个，以后换任何框架，你都能一眼认出底下跑的是同一个循环。这篇文章就干这件事，先把 Pi 的设计思路讲清楚，再带你看一遍那 600 行代码。

## Pi 做到了什么

光说设计克制还不够，得看它有没有真本事。像 Pi 这样简单的 harness，在工作负载上表现很好，每轮注入的上下文只有主流工具的约三分之一，同质量下成本比 Claude Code、Codex 低两倍以上。少不是弱，是更干净，模型每轮要消化的噪音少了一截。

## 护城河是干净的上下文

我一直在说一个判断，工具的护城河不在功能多，在上下文干净、意图不被噪音淹没。Pi 刚好是这句话的活样本。

当所有 coding agent 都在往核心里塞功能，plan mode、sub-agent、MCP、权限系统，每加一个，系统提示词就胖一圈，模型每轮要消化的噪音就多一层。Pi 反着来，把这些全扔进扩展层，核心保持最小。你拿到的工具没有变弱，你只是终于能把它从头读到尾。

| | 主流 coding agent | Pi |
|---|---|---|
| 内置工具 | 十几到几十个，含 sub-agent、plan、MCP | 4 个，read、write、edit、bash |
| 系统提示词 | 七千到一万 token | 几百 token |
| 扩展方式 | 配置开关、黑盒 | TypeScript 扩展，你写、你审 |
| 核心能否读完 | 基本不能 | 能 |

现在围绕模型，大家开始把搭harness跑 agent 的骨架单独当成一门手艺，和 prompt engineering、context engineering 并列。有实验显示，只改 harness 层、不换模型，benchmark 分数能从 52.8% 提到 66.5%，提升幅度比换更强模型还大。在 AI 编程这一行，harness 的复杂度本身就是一种噪音。

我在《测试，测试，还是测试》里写过，好的工具不让人少想，让人更早知道自己错在哪。Pi 的减法把这件事做到了极致，极简做到底，本质是能审计。核心小到你能读源码，每一步模型能做什么、不能做什么，你全看得清。

我在《别神话 Skill》里也写过，skill 是皮，工作方式是骨。Pi 是 OpenClaw 的底层 harness，你早就站在皮是骨这一边了。harness 越薄，你自己的工程纪律就越显形，它不替你定 workflow，把 workflow 的空白交还给你。Pi 自己有句话我挺喜欢，它是harness，不是牢笼，从提示词往上整条栈都是你的。

## 代码里它到底长什么样

有人用 600 行 TypeScript 把 Pi 的核心逻辑重写了一遍，仓库叫 SaladDay/pi-from-scratch，外号 nano-pi。我看了一眼，主循环 174 行就写完了，最底下就是个 while 循环加几个工具函数。

下面我把这 600 行用尽量低的门槛拆开，它正好也是 Pi 哲学的一份解析。

### 五个文件，各管一件事

nano-pi 整个仓库实际 767 行，它把一件复杂的事拆成五件简单的事，每个文件只有一个职责。

| 文件 | 行数 | 它负责什么 | 对外暴露 |
|------|------|-----------|----------|
| llm.ts | 268 | 把 OpenAI 的 SSE 流翻译成 4 种事件，定义 Context、Message | stream、contextToOpenAIMessages、buildAssistantMessage、buildToolResultMessage |
| agent.ts | 174 | while 循环，把底层事件升级成高层事件，管住 context 增长 | runAgent、compactContext |
| tools.ts | 125 | 4 个工具的纯函数实现 | builtinTools |
| tui.ts | 88 | 终端输入加流式打印 | Tui 类 |
| cli.ts | 112 | 拼装一切加 session 落盘 | main、loadSession、persistSession |

最值得说的不是这五个数，是它们之间的依赖方向，单向的。llm 不 import agent，agent 不 import tui，tools 只认 agent 的类型，tui 只认对外契约 AgentEvent，cli 才是唯一 import 所有人的那个。这条单向链带来的好处很实在，每个模块都能单独换。你想换 UI，换 tui 就行，想换大模型供应商，改 llm 就行，上下游一行都不用动。这是后面能加一个自己的工具就拥有自己的 agent 的前提。

### 灵魂是个 while 循环

agent.ts 的全部精华，就是一个 while true。

你给模型一个任务，context。模型流式回复你，边想边说。如果它说要调个工具，你就执行那个工具，把结果塞回 context。它再说，你再执行。直到它不再调工具，或者你叫停，循环结束。这就是所谓的 Agent loop，没有更神秘的东西了。

代码里的实际顺序，我按 runAgent 里的步骤讲。

```typescript
while (true) {
  // 0. 消息太多就先压缩旧对话
  await compactContext(model, context, signal)

  // 1. 流式调 LLM，边收边攒 text 和 tool_calls
  for await (const ev of stream(model, context, { tools: toolDefs, signal })) {
    if (ev.type === 'text_delta') { text += ev.delta; yield assistant_text }
    else if (ev.type === 'tool_call') { toolCalls.push(...) }
    else if (ev.type === 'done') { stopReason = ev.stopReason }
  }

  // 2. 把这一轮的 assistant 回复塞回 context
  context.messages.push(buildAssistantMessage(text, toolCalls))

  // 3. max_tokens 截断，工具参数可能不完整，不执行，把错误放回 context 让模型重发
  if (stopReason === 'max_tokens' && toolCalls.length > 0) { ...; continue }

  // 4. 没有 tool_call 就循环结束
  if (toolCalls.length === 0) { yield turn_end; return }

  // 5. 串行执行每个 tool_call
  for (const tc of toolCalls) { result = await tool.execute(tc.args, signal); ... }

  // 6. 把 tool_result 放回 context，进入下一轮
  context.messages.push(buildToolResultMessage(results))
}
```

真正让 Agent 能干活，靠的是 context 这个不断滚动的数组。每一轮，它把模型的话、工具的结果，全推进同一个 messages 数组，下一轮再整体丢回给模型。模型以为自己一直在连续思考，其实它每次只看到一整段历史。Agent 能不能干事，不靠聪明，靠的是把自己上一步的结果喂给下一步。

### 它怎么跟模型交互

模型不是一次性把答案砸给你的。它像水龙头滴水，一个字一个字、一个 tool_call 片段一个片段地流回来。这叫流式，streaming，底层协议是 SSE，Server-Sent Events。

llm.ts 干的事，就是把 OpenAI 这种 SSE 流，翻译成自己内部用的 4 种事件。

| 事件 | 含义 |
|------|------|
| text_delta | 模型又吐出几个字 |
| tool_call | 模型要调某个工具，id、名字、参数 |
| done | 这一轮结束了，附带 stopReason |
| error | 协议层炸了，网络断、API 500、JSON 解析失败 |

这里有个坑得提一下，tool_call 也是一段一段流过来的。模型先给工具名，再一点点给参数 JSON。所以代码里用一个 toolCallBuffers 按 index 把这些碎片攒起来，等整轮结束再 JSON.parse 成完整参数。如果某段 JSON 没攒完整，被 max_tokens 截断，parse 失败就当成空参数，这也是为什么 agent 那边要专门处理参数不完整就别执行。

所谓流式，就是把等模型想完变成模型每想一个字你就先看到了。这对体验很重要，对理解更重要，Agent 等的不是一个完整答案，它一直在边收边决策。

还有一处翻译容易被忽略，contextToOpenAIMessages。nano-pi 把消息统一成 role、content 结构，content 既可以是字符串，也可以是 ContentBlock 数组，text、tool_use、tool_result。但 OpenAI 的接口规矩更碎，tool_result 必须单独成一条 role 为 tool 的消息，纯 tool_call 的 assistant 消息 content 得是 null。这个函数就是干这种内部格式对厂商格式的脏活。好的抽象少写的不只是代码，它把我说的话和厂商要听的话隔开。

### 两套事件流，前后端分开

这是我觉得 nano-pi 最漂亮的一个设计，它有两套事件类型。

llm.ts 输出 StreamEvent，text_delta、tool_call、done、error，描述的是 LLM 这条流告诉我什么。它是协议层的视角，max_tokens 来自 OpenAI 的 finish_reason 为 length，tool_use 来自 tool_calls，error 是网络或 API 挂了。

agent.ts 输出 AgentEvent，assistant_text、tool_call、tool_result、turn_end，描述的是 agent 这一轮做了什么。注意，tool_result 在 StreamEvent 里根本不存在，它是 agent 执行完工具之后造出来的事件。turn_end 则把底层的 4 种 stopReason 合并重命名，还顺手把一种畸形情况归一化，OpenAI 偶尔会返回 tool_calls 但没真给 tool_call 的内容，nano-pi 把它当成正常 end_turn。

这套分层对应的就是类似Web的前后两端分离。agent 是后端，对外只吐 AgentEvent。tui，未来的 web，日志，都是前端，只认 AgentEvent。StreamEvent 是后端内部的实现细节，前端不该知道。文档里有个演示，把 tui 整个换成一个 20 行的 HTTP server，把 tui.printText 改成 res.write，agent.ts 一行都不用动，因为 runAgent 的契约就是 AgentEvent。nano-pi 甚至用物理手段锁死这条边界，tui.ts 不 import agent.ts 的任何东西。判断一个 Agent 代码写得好不好，看事件流有没有分层就够了。没分层的，前端一改就得动核心循环，迟早会乱。

### 那 4 个工具，Agent 的手

模型光靠嘴说，改不了任何文件。要让它干活，得给它手，这就是 tools.ts 里的 4 个工具。

read_file 读文件，大文件只留最后 200 行。write_file 覆盖写文件。edit 精确替换一段文本，要求 old_string 在文件里唯一匹配。run_bash 执行 shell 命令，30 秒超时，1MB 缓冲上限。

每个工具都是纯函数，签名是 async (args) => string，不碰 agent 的任何状态。这很关键，工具越纯，越容易被替换和测试。

两个细节很重要：一是输出截断 truncateOutput。工具跑出来的结果可能巨长，全塞回 context 会爆窗口。nano-pi 的策略是尾部优先，只留最后 200 行，完整的存到临时文件，再在返回里写明路径，因为报错信息通常在末尾。二是 edit 的替换写法，它不用 content.replace(old, new)，而是用 content.replace(old_string, () => new_string)，用一个函数当第二个参数。为什么，因为 new_string 里如果带 $ 符号，\$&、\$1 之类，String.replace 会把它们当成特殊捕获符解释掉，bug 就来了。用函数包一层，$ 就乖乖当普通字符。工具是 Agent 唯一能改变世界的方式。模型再能说，没有工具，它碰不到一个字节。想给 Agent 加能力，第一步永远是加一个工具函数。

### 上下文会满，所以它得会压缩

context 是那个不断滚动的 messages 数组。但它有上限，模型的上下文窗口就那么大。聊久了，历史塞不下，怎么办。

compactContext 就是干这个的。规则很简单，当消息数达到 50，COMPACT_THRESHOLD，触发压缩。保留最近 20 条，KEEP_RECENT，把更早的丢给模型去总结。模型产出一段摘要，用一条 context summary 消息替换掉那些旧消息。

这里有两处很稳的取舍。一是压缩失败时不替换，如果模型总结失败了，nano-pi 选择保留原始消息，而不是塞一条空摘要进去，空摘要比原始对话更危险，会让模型丢掉已知信息。二是 abort，用户叫停，时不压缩，避免中途生成一个空摘要把 context 搞坏。会压缩上下文，Agent 才算能长跑。生产级的 pi 在这里做了 970 行，精确估算 token 数、找最优切割点、不拦腰切断一轮对话、跨消息边界拆分超长轮次。nano-pi 用消息数达到 50 一刀切，教的是 context 有上限、满了要压缩这个核心意识。

## 600 行留下了什么，又砍掉了什么

讲到这，你大概明白 nano-pi 在做什么了。但我想专门说一块，它故意没写什么。因为看懂一个教学版和能在生产用之间，差的正好是被砍掉的那部分。

被砍掉的工程细节，我列几个最关键的。

| 砍掉的 | 代价 | 什么时候必须加回来 |
|--------|------|-------------------|
| JSON Schema 参数校验 | 工具收到畸形参数直接报错，模型靠错误自纠 | 多 provider、多版本工具、要 IDE 补全 |
| 精确 token 数压缩 | 压缩触发时机粗糙 | 长任务、超长 session、要稳定 token 预算 |
| session branching | 不支持从中间轮次分叉恢复 | 探索性任务、A/B 不同 prompt |
| 工具并发执行 | tool_call 串行，慢数倍 | 独立工具，如并行读多个文件 |
| 多 provider 适配 | 只支持 OpenAI 兼容格式 | 换非 OpenAI 模型 |
| 权限层 | run_bash 没有审批闸门，args 不校验 | 任何要跑在真实环境里的 agent |

最后那行得重点说。nano-pi 的 run_bash 直接 exec 任意命令，没有任何审批，工具参数进来也不校验。这是教学 agent，不是安全基线。你拿它跑真实任务，等于把终端完全交给模型。

核心思想不等于生产可用。600 行 TypeScript 跑通了最小骨架，多出来的一万行 pi，是让这条骨架在生产环境里不掉链子。被砍掉的全是让生产更稳的活，跟让 agent 跑起来无关。被刻意留下的边界，tool_call 和 tool_result 必须配对、abort 时丢掉半成品、compaction 失败就降级、read_file 输出截断，这些不是为了跑起来，是为了不崩。

## 极简的代价，自由还是甩锅

上面那张表最后一行，正好接上 Pi 设计有点危险的一面，它的减法是有价的。

Pi 默认没有内置权限系统，以启动它的用户权限直接运行。文件系统、进程、网络、凭证，它全继承。官方建议你自己把它丢进容器、虚拟机、沙箱。换句话说，主流工具弹的「你确定吗」、建的权限边界，Pi 一律没做，examples 里倒有个 permission-gate.ts 扩展让你自己补。

极简把责任还给了用户，也把门槛还给了用户。对懂 sandbox、懂自己 workflow 的人，这是自由，对指望开箱即安全的人，这是坑。这跟我一直强调的 merge gate 不能交出去是同一回事，Pi 连 gate 都没帮你建，得更自觉地自己兜。

## 三条能直接用的减法

如果你也在搭自己的 agent 工作流，我的原则很简单，给 agent 做减法，先删的不是功能，是噪音。具体三步。

第一，把非核心能力推到扩展层。sub-agent、MCP、plan mode 这些，能不进核心就不进核心，用 extension 按需加载。

第二，系统提示词压到你能读完。每多 100 token，都是你每个会话持续在付的税。

第三，给每个工具问一句没有它会怎样。答不上来的，就是噪音。

说到底，上半年的军备竞赛正在反噬，下半年真正值钱的，是 harness 够干净、够你读懂、够敢把责任还给你。

## 写在最后

回到开头那句话，Agent 没有魔法。

nano-pi 是皮，agent loop 是骨。代码能复制，对循环、事件、context 这三件事的理解复制不了。框架会一个接一个地冒出来又沉下去，但只要你摸过一次这 600 行，以后不管换哪个框架，你都能一眼认出底下跑的是同一个循环。

想真懂，就跑一遍。nano-pi 配了一个很用心的教学网站 pi-from-scratch.vercel.app，文章和源码放在一起，你往下读，右边编辑器就一点点把代码补全，读完时代码也齐了。它还做了个 Trace 调试器，能打断点、逐行过执行流。线上的 Trace 是预先生成的静态数据，你浏览网站不会真的调模型 API。感兴趣的朋友可以自己动手试一下。
