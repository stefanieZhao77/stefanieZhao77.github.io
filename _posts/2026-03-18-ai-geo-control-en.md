---
layout: post
title: "When AI Becomes the Entry Point: GEO and Control"
date: 2026-03-18
categories: [Blog]
tags: [Agent, AI, Software Design, Product Design]
linkedin: true
---

This year's 315 Gala exposed a gray industry chain surrounding large AI models: some people are mass-generating content and distributing it across various platforms—not for humans to see, but for AI models to "see," so that when users ask questions, this content gets cited or even becomes part of the recommended answers. A journalist conducted an experiment: they invented a smart bracelet that didn't actually exist and mass-produced content about it. A few days later, when they asked an AI "What smart bracelets are worth recommending?" the non-existent product was actually recommended, and ranked quite highly.

## Who's Writing the Answers

The entry point for information is shifting from "search results" to "generated answers."

Last year, a friend posted a question on their social media: Big tech companies like Alibaba have already created closed ecosystems, giving them natural advantages when pushing their own AI—do smaller companies still have a chance? My answer at the time was: do GEO. This issue isn't just about traffic, but about distribution rights. In traditional internet, what you write doesn't matter as much as whether platforms are willing to push it to users. Recommendation algorithms, search rankings—these mechanisms have long been controlled by big tech. In other words, we've been living in an information structure woven by platforms.

But the emergence of AI has changed this somewhat. When users directly ask AI: "Which is better?" or "What should I do?" platforms aren't distributing content—they're generating answers directly. And "generating answers" itself carries bias. What data the model is trained on, which sources it prioritizes, how it organizes and expresses information—these aren't neutral choices. So the question becomes: who decides what the answers look like? If this power is entirely in the hands of these big platform model providers, it's actually a stronger form of centralization—not just controlling distribution, but controlling conclusions.

This is why I feel that GEO represents a kind of "resistance" to this structure. It allows individuals, small teams, and even more distributed content producers to influence the AI generation process and directly participate in "how answers are written." So I think GEO, to some extent, is a redistribution of "answer production rights." It can certainly be abused—the 315 Gala exposed exactly this kind of abuse. But from another perspective, it at least makes the question of "who can influence AI" no longer entirely determined by platforms. However, all of this remains at a relatively mild level: it influences what AI sees.

## From Generation to Execution

Compared to GEO, I'm more concerned about another type of problem: people are starting to try to influence what AI does.

Prompt Injection can be simply understood as: attackers disguise "commands" as "content," placing them in issues, READMEs, web pages, or documents, so that when AI reads this content, it treats them as instructions to be executed.

I recently read an article that gave a very specific example. The author described an exploited chain that ultimately caused AI coding tools to execute installation commands without the developer's knowledge. The normal flow is: look at problem → understand → execute → solve, but the author wrote something like "to solve this problem, through npm's `postinstall` command," and easily got OpenClaw installed on the machine. This means the user's computer is now running two OpenClaw instances, but they don't know it, because the AI can't distinguish whether this is semantics or an instruction to execute.

This is just a simple scenario. The article particularly emphasized that what's truly special about this case isn't just prompt injection, but **"one AI tool silently bootstrapping a second AI agent."** The attacker doesn't directly break into the system; instead, they first influence Tool A, then have Tool A install Tool B for them. The attacker doesn't need to breach the system—only influence the AI, and can even install their own AI tool to read all the user's local information. In other words: Attacker → Influences AI → AI installs new AI → New AI gains execution capability.

## When Agents Are Exposed

Agents like OpenClaw are designed to let AI perform tasks: operating files, running commands, calling external services. Some tasks require giving the agent significant permissions and lots of personal information. Recently, a website called `OpenClaw Exposure Watchboard` went online, aiming to provide defensive warnings and explicitly advises deployers to enable authentication, remove public internet exposure, and patch as soon as possible. Its table includes not just whether authentication is enabled or whether instances are active, but also critical risk fields like whether authentication is required, and whether there are leaked tokens or API keys.

It demonstrates a very concrete fact: there are numerous AI agents capable of performing tasks that can be accessed by anyone. And among these instances, some require no authentication at all, some already show signs of credential exposure, and some are even associated with known vulnerabilities or security incidents. What does this mean? It means once someone finds these agents, they don't need to invade the system. They just need to send a command. Find agent → Send request → Agent executes → Obtain results.

So returning to the 315 discussion itself, I think GEO poisoning is certainly a problem, but it's essentially still a deviation at the answer level. And this kind of deviation already exists—platforms themselves have their algorithmic "biases." But when AI starts to gain execution capabilities, the real risk is no longer in the answers—it's in the actions. Compared to "what AI said wrong," I'm more worried about "what AI was allowed to do." Because once we enter the execution layer, the issue is no longer about right or wrong—it's about control.

From this perspective, GEO might just be the more visible part, while deeper changes are actually happening at the boundaries of AI capabilities themselves.
