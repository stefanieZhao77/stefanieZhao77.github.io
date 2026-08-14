---
layout: post
title: "Doing Less Is Better: The Minimalist Philosophy of Pi"
date: 2026-08-14
categories: [Blog]
tags: [Agent, Pi, harness, AI engineering]
linkedin: true
---

# Doing Less Is Better: The Minimalist Philosophy of Pi

Pi is a minimalist coding agent harness. Its design philosophy is a single principle: keep the core as small as possible. By default, the model gets only 4 tools — read, write, edit, bash. The system prompt is compressed to a few hundred tokens, while mainstream coding agents routinely burn seven to ten thousand tokens before you even say a word. Plan mode, sub-agents, MCP, permission systems — none of these are stuffed into the core. They're all pushed to the extension layer, where you write and review TypeScript yourself. It even documents what it *didn't* build, with an entire README section called "Here's What We Didn't Build."

Pi is a great entry point for learning about Agents. The word "Agent" gets mystical treatment — autonomous planning, tool calling, reflection loops — it sounds like a new form of life. But when Pi strips all that external machinery away, what remains is a small thing you can read from start to finish. Someone rewrote Pi's core logic in 600 lines of TypeScript. Once you read it, you understand: an Agent is not magic. It's a while loop plus a few tool functions. Understand this one, and no matter what framework you switch to later, you'll immediately recognize the same loop running underneath. This article does exactly that: first it explains Pi's design thinking, then it walks you through those 600 lines.

## What Pi Achieves

Saying the design is restrained isn't enough — you have to check whether it actually delivers. A harness as simple as Pi performs very well on real workloads: it injects roughly one-third the context per turn of mainstream tools, and at the same quality its cost is more than twice as low as Claude Code or Codex. Less isn't weakness; it's cleanliness. The model has far less noise to digest each turn.

## The Moat Is a Clean Context

I keep repeating one judgment: a tool's moat isn't in having many features, it's in having a clean context where intent isn't drowned by noise. Pi is the living example of that sentence.

While every coding agent crams features into the core — plan mode, sub-agents, MCP, permission systems — each addition fattens the system prompt and adds another layer of noise for the model to digest each turn. Pi goes the other way: everything goes to the extension layer, the core stays minimal. The tools you get aren't weaker. You just can finally read it from start to finish.

| | Mainstream coding agents | Pi |
|---|---|---|
| Built-in tools | A dozen to dozens, incl. sub-agent, plan, MCP | 4: read, write, edit, bash |
| System prompt | 7,000–10,000 tokens | A few hundred tokens |
| Extension model | Config toggles, black box | TypeScript extensions, written and reviewed by you |
| Can the core be fully read? | Basically no | Yes |

Around the model, people are now treating the skill of building a harness to run an agent as a craft of its own, standing alongside prompt engineering and context engineering. Experiments show that changing only the harness layer — without swapping the model — can lift benchmark scores from 52.8% to 66.5%, a bigger improvement than switching to a stronger model. In the AI coding world, harness complexity itself is noise.

I wrote in "Testing, Testing, and More Testing" that good tools don't make you think less; they make you find out where you're wrong sooner. Pi's subtraction takes this to the extreme. Minimalism, done all the way, is auditability: the core is small enough to read the source, and you can see exactly what the model can and cannot do at every step.

I also wrote in "Don't Mythologize Skills" that the skill is the skin and the way of working is the bone. Pi is the underlying harness of OpenClaw, so you've long been on the skin-is-bone side. The thinner the harness, the more visible your own engineering discipline becomes. It doesn't decide your workflow for you; it hands the blank space of workflow back to you. Pi has a line I like: it's a harness, not a cage — the whole stack above the prompt is yours.

## What It Actually Looks Like in Code

Someone rewrote Pi's core logic in 600 lines of TypeScript. The repo is called SaladDay/pi-from-scratch, nicknamed nano-pi. I took a look: the main loop is done in 174 lines. At the very bottom it's just a while loop plus a few tool functions.

Below, I'll break those 600 lines apart with the lowest possible barrier to entry — it also happens to be an interpretation of Pi's philosophy.

### Five Files, One Job Each

The entire nano-pi repo is actually 767 lines. It breaks one complex thing into five simple things, each file with a single responsibility.

| File | Lines | What it does | Exposes |
|------|------|-----------|----------|
| llm.ts | 268 | Translates OpenAI's SSE stream into 4 events; defines Context, Message | stream, contextToOpenAIMessages, buildAssistantMessage, buildToolResultMessage |
| agent.ts | 174 | while loop; upgrades low-level events to high-level events; manages context growth | runAgent, compactContext |
| tools.ts | 125 | Pure-function implementations of the 4 tools | builtinTools |
| tui.ts | 88 | Terminal input plus streaming output | Tui class |
| cli.ts | 112 | Wires everything together plus session persistence | main, loadSession, persistSession |

The most interesting thing isn't those five numbers — it's the dependency direction between them: one-way. llm doesn't import agent, agent doesn't import tui, tools only knows agent's types, tui only knows the public AgentEvent contract, and cli is the only one that imports everyone. The benefit of this one-way chain is very real: every module can be swapped independently. Want a different UI? Swap tui. Want a different model provider? Change llm. Upstream and downstream stay untouched. This is the prerequisite for "add one tool of your own and you have your own agent."

### The Soul Is a while Loop

The entire essence of agent.ts is a `while true`.

You give the model a task — the context. The model streams its reply, thinking and talking. If it says it wants to call a tool, you execute that tool and stuff the result back into the context. It talks again, you execute again. Until it stops calling tools, or you call a halt, the loop ends. That's the so-called Agent loop. There is nothing more mysterious to it.

Here's the actual sequence in code, walking through runAgent.

```typescript
while (true) {
  // 0. If there are too many messages, compact the old conversation first
  await compactContext(model, context, signal)

  // 1. Stream the LLM call, accumulating text and tool_calls as they arrive
  for await (const ev of stream(model, context, { tools: toolDefs, signal })) {
    if (ev.type === 'text_delta') { text += ev.delta; yield assistant_text }
    else if (ev.type === 'tool_call') { toolCalls.push(...) }
    else if (ev.type === 'done') { stopReason = ev.stopReason }
  }

  // 2. Push this turn's assistant reply back into the context
  context.messages.push(buildAssistantMessage(text, toolCalls))

  // 3. max_tokens truncation: tool args may be incomplete; don't execute,
  //    put the error back in the context and let the model resend
  if (stopReason === 'max_tokens' && toolCalls.length > 0) { ...; continue }

  // 4. No tool_call means the loop ends
  if (toolCalls.length === 0) { yield turn_end; return }

  // 5. Execute each tool_call serially
  for (const tc of toolCalls) { result = await tool.execute(tc.args, signal); ... }

  // 6. Put tool_results back into the context and go to the next round
  context.messages.push(buildToolResultMessage(results))
}
```

What actually makes an Agent able to work is `context` — a constantly rolling array. Each turn, it pushes both the model's words and the tool results into the same messages array, and the next turn throws the whole thing back at the model. The model believes it's thinking continuously, when in fact it only ever sees one whole history at a time. Whether an Agent gets things done doesn't depend on cleverness — it depends on feeding its previous output into its next step.

### How It Talks to the Model

The model doesn't slam the whole answer at you at once. It drips like a faucet — one word at a time, one tool_call fragment at a time. That's streaming; the underlying protocol is SSE, Server-Sent Events.

What llm.ts does is translate an OpenAI-style SSE stream into the 4 internal events it uses.

| Event | Meaning |
|------|------|
| text_delta | The model spat out a few more characters |
| tool_call | The model wants to call a tool: id, name, arguments |
| done | This turn ended, with a stopReason attached |
| error | The protocol layer blew up: network drop, API 500, JSON parse failure |

There's a pitfall worth mentioning: tool_call also arrives piece by piece. The model sends the tool name first, then the argument JSON bit by bit. So the code uses a toolCallBuffers map keyed by index to accumulate these fragments, then JSON.parses the complete arguments at the end of the turn. If a JSON fragment was cut off by max_tokens and parsing fails, it's treated as empty arguments — which is exactly why the agent side specifically handles "don't execute if arguments are incomplete."

Streaming means turning "wait for the model to finish thinking" into "you see every word the model thinks." That matters for UX, but it matters more for understanding: an Agent isn't waiting for one complete answer; it's making decisions as it receives, all along.

There's another translation step that's easy to overlook: contextToOpenAIMessages. nano-pi normalizes messages into a role/content structure where content can be either a string or an array of ContentBlocks — text, tool_use, tool_result. But OpenAI's API conventions are more fragmented: tool_result must be its own message with role "tool", and a pure tool_call assistant message must have content null. This function does the dirty work of mapping internal format to vendor format. A good abstraction saves more than code — it separates what I say from what the vendor wants to hear.

### Two Event Streams, Frontend and Backend Separated

This is what I think is nano-pi's most beautiful design: it has two sets of event types.

llm.ts emits StreamEvent — text_delta, tool_call, done, error — describing what the LLM stream tells it. That's the protocol-layer view: max_tokens comes from OpenAI's finish_reason being "length", tool_use comes from tool_calls, error means the network or API is down.

agent.ts emits AgentEvent — assistant_text, tool_call, tool_result, turn_end — describing what the agent did in this turn. Note that tool_result doesn't exist in StreamEvent at all; it's an event the agent creates after executing a tool. And turn_end merges and renames the 4 underlying stopReasons, also normalizing one malformed case: OpenAI occasionally returns tool_calls without actually providing tool_call content, which nano-pi treats as a normal end_turn.

This layering is the frontend/backend separation, just like the Web. The agent is the backend; it only emits AgentEvent outward. The tui, a future web UI, logs — all frontends that only understand AgentEvent. StreamEvent is an implementation detail of the backend; the frontend shouldn't know about it. The docs include a demo that replaces the entire tui with a 20-line HTTP server, changing tui.printText to res.write, without touching a single line of agent.ts, because runAgent's contract is AgentEvent. nano-pi even locks the boundary by physical means: tui.ts doesn't import anything from agent.ts. To judge whether Agent code is well written, just check whether the event streams are layered. If they aren't, changing the frontend means touching the core loop, and it will get messy sooner or later.

### The Four Tools: The Agent's Hands

A model talking alone can't modify any file. To get it to work, you give it hands — that's what the 4 tools in tools.ts are.

read_file reads files, keeping only the last 200 lines of large files. write_file overwrites a file. edit performs an exact text replacement, requiring old_string to match uniquely in the file. run_bash executes shell commands with a 30-second timeout and a 1MB buffer limit.

Each tool is a pure function with signature `async (args) => string`, touching none of the agent's state. That's crucial — the purer the tool, the easier it is to replace and test.

Two details matter. First, output truncation (truncateOutput). Tool results can be huge; stuffing them all back into the context blows the window. nano-pi's strategy is tail-first: keep only the last 200 lines, save the full output to a temp file, and note the path in the return — because error messages are usually at the end. Second, edit's replacement trick: it doesn't use content.replace(old, new), but content.replace(old_string, () => new_string), with a function as the second argument. Why? Because if new_string contains $ symbols — like \$&, \$1 — String.replace interprets them as special capture references, and bugs appear. Wrapping it in a function makes $ behave as an ordinary character. Tools are the only way an Agent can change the world. No matter how eloquent the model, without tools it can't touch a single byte. The first step to giving an Agent new capability is always adding one tool function.

### Context Gets Full, So It Must Compress

Context is that constantly rolling messages array. But it has a limit — the model's context window is only so big. Chat long enough and the history won't fit. What then?

compactContext exists for this. The rule is simple: when the message count reaches 50 (COMPACT_THRESHOLD), compression triggers. Keep the most recent 20 (KEEP_RECENT), and hand the older ones to the model for summarization. The model produces a summary, which replaces the old messages as a single context-summary message.

There are two rock-solid trade-offs here. First, don't replace on failure: if the model's summary fails, nano-pi keeps the original messages rather than injecting an empty summary — an empty summary is more dangerous than the raw conversation, because it makes the model lose known information. Second, on abort (user halt), no compression happens, avoiding a mid-way empty summary corrupting the context. Only when an Agent can compress its context can it run long. Production-grade pi does 970 lines here: precisely estimating token counts, finding optimal cut points, never slicing a turn in half, splitting oversized turns across message boundaries. nano-pi's blunt "cut at 50 messages" teaches the core lesson: context has limits, and when it's full you must compress.

## What the 600 Lines Keep, and What They Cut

By now you probably understand what nano-pi does. But I want to specifically address what it deliberately doesn't include — because between understanding a teaching version and using it in production lies exactly the part that was cut.

Here are the most critical engineering details that were cut.

| Cut out | Cost | When you must add it back |
|--------|------|-------------------|
| JSON Schema argument validation | Malformed arguments make tools error out; the model self-corrects from the error | Multiple providers, multi-version tools, IDE autocomplete |
| Precise token-count compression | Coarse compression trigger timing | Long tasks, very long sessions, stable token budgets |
| Session branching | No forking/resuming from mid-turn | Exploratory tasks, A/B different prompts |
| Concurrent tool execution | tool_calls run serially, several times slower | Independent tools, e.g. reading multiple files in parallel |
| Multi-provider support | Only OpenAI-compatible format | Switching to non-OpenAI models |
| Permission layer | run_bash has no approval gate; args are not validated | Any agent that runs in a real environment |

That last row deserves emphasis. nano-pi's run_bash directly execs arbitrary commands with no approval and no argument validation. This is a teaching agent, not a security baseline. If you run real tasks with it, you're handing the entire terminal to the model.

Core ideas ≠ production-ready. The 600 lines of TypeScript run the minimal skeleton; the extra ten thousand lines of pi are what keep that skeleton from falling apart in production. Everything cut is work that makes production more stable — unrelated to getting the agent running. The boundaries deliberately kept — tool_call and tool_result must pair up, drop half-finished work on abort, degrade gracefully when compaction fails, truncate read_file output — aren't for getting it to run; they're for not crashing.

## The Price of Minimalism: Freedom or Passing the Buck

The last row of that table connects directly to the slightly dangerous side of Pi's design: its subtraction has a price.

Pi has no built-in permission system by default; it runs with the privileges of the user who started it. Filesystem, processes, network, credentials — it inherits all of them. The official advice is to put it in a container, VM, or sandbox yourself. In other words, the "are you sure?" prompts and permission boundaries that mainstream tools pop up — Pi does none of that. The examples folder does include a permission-gate.ts extension for you to add yourself.

Minimalism returns responsibility to the user, and it returns the barrier of entry to the user too. For people who understand sandboxes and their own workflow, this is freedom; for people expecting out-of-the-box safety, it's a trap. This is the same thing as my insistence that the merge gate can't be handed over — Pi doesn't even build a gate for you, so you have to catch yourself even more consciously.

## Three Subtractions You Can Use Right Away

If you're also building your own agent workflow, my principle is simple: when subtracting from an agent, what you delete first isn't features — it's noise. Three concrete steps.

First, push non-core capabilities to the extension layer. Sub-agents, MCP, plan mode — anything that doesn't have to be in the core shouldn't be; load it on demand via extensions.

Second, compress the system prompt until you can read it all. Every extra 100 tokens is a tax you pay in every single session, continuously.

Third, ask of every tool: what happens without it? If you can't answer, it's noise.

In the end, the arms race of the first half of the year is backfiring. What's actually valuable in the second half is a harness that's clean enough, readable enough, and brave enough to hand responsibility back to you.

## In Closing

Back to the opening line: Agents aren't magic.

nano-pi is the skin; the agent loop is the bone. Code can be copied; the understanding of loop, event, and context cannot. Frameworks will keep popping up and sinking, one after another — but once you've touched these 600 lines, no matter what framework you switch to later, you'll recognize the same loop running underneath at a glance.

If you really want to understand it, run it. nano-pi ships with a thoughtfully made teaching site, pi-from-scratch.vercel.app, where the article sits right next to the source code: as you read down, the editor on the right completes the code bit by bit, and by the end, the code is complete too. It also has a Trace debugger where you can set breakpoints and step through the execution flow. The online Trace is pre-generated static data — browsing the site never calls a real model API. If you're interested, go try it yourself.
