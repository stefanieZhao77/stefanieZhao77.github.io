---
layout: post
title: "Before Diving into AI Agent Development: Start by Streamlining Your Workflow"
date: 2026-02-20
categories: [Blog]
tags: [AI, Agent, Workflow, Skill]
summary: "Before diving into AI agent development, the most important step is to streamline your workflow. This article shares how to use Skills to encapsulate repetitive tasks and let AI naturally integrate into your daily development."
cover: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200"
linkedin: true
x: true
---

Recently, many developers have started pivoting toward AI agent development. The path is familiar: pick a framework, grind through documentation, watch endless videos, run official demos, and memorize interview questions.

This reminds me of how many people learned to code in the first place: typing out code, getting features to work, but never truly absorbing the knowledge. Because from start to finish, they never understood what problems the code was actually solving—they were just imitating structures. They learned syntax but not abstraction; they could use APIs but didn't understand the scenarios.

Many think they're learning something new, only to discover they've just switched to a different set of APIs. The truly difficult part isn't using those frameworks—it's whether you have a clear enough process that an agent can actually integrate into.

Let's not discuss model training for now. Most so-called "agent development" today isn't mysterious at all. It's simply reorganizing existing workflows and inserting AI into the links that previously required human judgment, information synthesis, and content generation.

The problem is, most people's workflows are inherently fuzzy. When the process is fuzzy, agents have nowhere to shine.

When the process is clear, AI starts generating value even without complex architectures.

The best way to learn is to observe yourself: which repetitive tasks do you "have to" do daily that could be handed off to an agent? Things like writing daily reports, organizing issues, crafting PR descriptions, summarizing meetings, doing code reviews, validating API consistency. These actions aren't complex, but they recur constantly and consume significant time. These are precisely where AI can most naturally step in.

---

## I Recommend Everyone Use Skills

> The essence of a Skill is building a workflow that transforms a repetitive action into a dispatchable capability unit.

I've found that the process of thinking about how to create a skill is exactly when you're doing agent engineering. When people talk about agents, they mention tool calling, MCP, memory, planning. Skills actually combine all these concepts.

I now break down many small components of my engineering work into individual skills.

I love using Obsidian and want all my documents centralized in my vault. So I created a skill that reads specific filename patterns (like [Feature], [Bug], [Release v*]) and creates corresponding issues via GitHub MCP. Since Obsidian supports bidirectional links, I can easily associate bugs and features in release documents, making tracking much easier.

My projects have many submodules, so creating worktrees is cumbersome. I built a create-worktree skill to encapsulate all related git commands. Similarly, there's a merge-worktree skill, and when all tests pass, a delete-worktree skill.

Budget is limited, so I mix good and cheaper models. I created a development-process skill: first, a good model does requirements analysis, then cheaper model subagents search the codebase for reusable code and architectures; then the good model analyzes and designs, outputting test and development plans (tests must come first!); then a regular model develops based on the plan, and finally the good model reviews all code and architecture. I dislike AI generating documents everywhere, so I have it put all intermediate files in an info folder (git-ignored, because I don't want to sync that stuff). Only when tests pass does it output a formal document for git commit.

I've created many other skills for my daily management—I'll share more details later. This post just provides a perspective, without specific code or tutorials, because I believe only through thinking and knowing where things apply does it become meaningful.

---

## Make Good Use of skill-creator & github-to-skill

With so many skills, I certainly can't write them all manually. The official skill-creator from Claude Code is a lifesaver. It's itself a skill that can generate new skills based on your documented workflows. You explain your entire process and required tools through prompts, and it generates the complete workflow. It handles most workflows excellently, and for those needing adjustment, you can easily modify the generated SKILL.md file or add your own code as tools.

github-to-skill helps you wrap GitHub repository code into a skill. Many open-source tools can be used this way, and the wrapped skills can be used within your own skill workflows.

---

Actually, many agent tools today natively support skills, making capability encapsulation and dispatching increasingly simple. But tools alone don't automatically create structure.

AI doing things isn't hard. What's hard is knowing what it should do, when to do it, and which system node to enter afterward. What's hard is whether you can break down your daily actions clearly and abstract them into reusable capabilities.

In the AI era, this ability to architect and abstract is far more valuable than learning a few more tools.