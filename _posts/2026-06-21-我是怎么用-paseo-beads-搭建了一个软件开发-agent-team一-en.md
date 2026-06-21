---
layout: post
title: "How I Built a Software Development Agent Team with Paseo + Beads (Part 1)"
date: 2026-06-21
categories: [Blog]
tags: ['Agent', 'AI', 'Software Design', 'Product Design']
linkedin: true
---

This is a solution for burning tokens faster, haha.

This series will be divided into three parts, introducing the origin of my ideas, and what problems I discovered in practice, thus optimizing three different versions of the solution.

## Why I Wanted an Agent Team

When most people start using coding agents, they still treat them as enhanced assistants. For example, I tell it to help me fix this API, or check why this page is throwing errors, or add a unit test.

This approach works well, but it has a problem: humans are still the central node, and humans become the efficiency bottleneck.

All tasks require me to switch, all contexts require me to organize, and all progress requires me to remember. The Agent is responsible for execution, but I'm responsible for stuffing the entire project back into its context.

If it's just a small feature, this is not a problem. But when I start handling frontend, backend, database, testing, and deployment simultaneously, I find myself not really becoming lighter, just transferring some of the pressure of 'writing code' to 'constantly assigning tasks to Agents, explaining, checking, and correcting'.

So I thought, can we use agents to simulate human software development teams? We would have requirements, tasks, Issues, status, dependencies, Review, Release. The Agent Team is the same, it can't just be built on prompts, it also needs task structure.

## Paseo and Beads: One Manages People, One Manages Tasks

When I saw these two tools, I suddenly realized 'these two things can be combined'.

The first is [Paseo](https://github.com/getpaseo/paseo). Simply put, it's a tool for managing coding agents. It runs a daemon locally, and you can connect to it through desktop, mobile, web, or CLI to start and manage different coding agents. So my understanding of Paseo is: it's more like an Agent dispatcher. The problem it solves is not 'what is the task', but 'how do these Agents run, how are they managed, and how can I conveniently see what they're doing'.

The second is [Beads](https://github.com/gastownhall/beads). It's a local issue/memory system for coding agents. Compared to ordinary Markdown Todo, Beads emphasizes structured tasks, dependency relationships, and state tracking. In other words, it doesn't just let you write a bunch of to-do items, but turns tasks into work objects that agents can continuously read, update, and push forward. So it's very suitable for local data management.

These two tools together, Paseo is responsible for making multiple Agents run and supporting multiple clients to view; Beads is responsible for making multiple Agents know what they should do, as a standard data source. I am responsible for defining goals, judging priorities, and accepting results.

## First Version Workflow: Release → Issue → Agent

After having this idea, my first version design was still based on the original workflow. In previous articles, I also introduced how I used Obsidian as a data source to manage releases, features, and bugs, and how to synchronize with GitHub issues, then let agents automatically read issues to develop.

The entry point is still Release. That is, I first define a version goal: what features should be completed in this version, what problems should be fixed, and what state should be achieved in the end. Then, I will split this Release into a set of Issues and put them in Beads. The Issues here are roughly divided into two categories: one is Feature, which is the function that needs to be added or modified; the other is Bug, which is the problem discovered during development, testing, or use.

To make this agent team work automatically, I added a Dispatcher and wrote some rules for task allocation logic. The Dispatcher's role is to read the current Issues from Beads and assign them to different Agents for processing. Features are usually taken by development Agents and implemented following TDD, and the Test Agent will continuously record discovered Bugs to Beads. Bugs can be automatically triggered, taken, and attempted to be fixed by idle Agents.

At this point, the entire process becomes a continuously running cycle. And because Paseo supports different providers, I use a configuration file to assign different models to different agents (this step purely depends on personal financial resources, those with token freedom can ignore it). Finally, after review, I intervene to see if the function is completed according to my ideas and requirements, and after final approval, automatically submit a PR.

And I made a kanban for the entire process, where you can see which issues are being worked on by which agents, which ones are in my approval process, and you can directly approve in the interface, and then automatically submit a PR.

## It Actually Ran

When the first version actually ran, I was actually very excited.

However, after this process ran for a while, I also saw many problems.

The first problem is that the early requirement clarification and task splitting still completely depend on me.

Although Agents can take Issues, the Dispatcher can assign tasks, and Bugs discovered by testing can be written back to Beads, how to define the initial Feature, how to split requirements, and how to write Issues still depend on me. This means that the entire system seems to have an automatic cycle, but its efficiency bottleneck is still me. As long as I don't split the requirements clearly, the Agents behind cannot steadily advance. As long as I don't write the Issues clearly, no matter how actively the Dispatcher assigns tasks, it just pushes unclear tasks to Agents faster.

The second problem is that Issues must be written very clearly.

When developers get a vague task, they often proactively ask questions, or rely on project experience to complete the context. But Agents don't necessarily do this. Sometimes they start executing overconfidently, and even make wrong judgments based on an incomplete Issue.

If the Issue doesn't clearly write the background, boundaries, acceptance criteria, and related dependencies, it may misunderstand the task. If the relationship between multiple Issues is not clearly described, it may also make changes where it shouldn't. If a Bug simply writes the phenomenon without explaining which function, version, or context it appears in, the Agent can easily treat it as an isolated problem.

The third problem is that Agents don't necessarily really understand the background.

This is the most critical problem in the first version. In the Release → Issue splitting method, I originally thought that Release provided the general direction and Issue provided specific tasks, which would be enough. But after actually running it, I found that Agents often only receive a specific Issue, not the complete Release background.

That is, it knows it has a work order, but doesn't necessarily know why this work order exists. It knows it needs to fix a Bug, but doesn't necessarily know the relationship between this Bug and the current version goal. It knows it needs to implement a Feature, but doesn't necessarily understand the position of this Feature in the entire product process.

For me, there is usually a lot of implicit information behind an Issue: why this version needs to do it, which functions cannot be changed temporarily, which modules are only temporary solutions, and which problems should be solved in subsequent versions. But for Agents, if this background is not explicitly written into the Issue, or not transmitted to it through some mechanism, it is likely to only see local tasks and not the overall intention.

The fourth problem is that temporarily added Bugs will make the system chaotic.

At first, I thought it was natural for Bugs to automatically enter Beads and be automatically taken and solved by Agents. Because this looks like a self-healing cycle: testing discovers problems, writes back Issues, and Agents fix them. But later I found that if there is a lack of Release background and task context, temporarily added Bugs will disrupt the Agent's understanding of current work.

Some Bugs are actually just intermediate states produced when the current Feature is not completed, some Bugs are not consistent with the current Release goals and should be processed later, some Bugs look urgent but actually depend on another task that has not been completed, and some Bugs will make the Agent jump to another module to change code, resulting in new conflicts.

At this time, although the number of Issues in Beads has increased, the system is not necessarily smarter. Because Issues themselves are just task objects, they also need sufficient background, priority, and dependency relationships to become truly executable workflows.

## The First Version Was Not a Failure, But a Necessary Prototype

The first version was not a failure.

It completed a very important task: letting me string multiple Agents into a runnable development cycle for the first time. Before this version, my question was: can multiple Agents collaborate around the same project? After this version, my question became: if they can really collaborate, how should I organize them to avoid chaos?

The first version showed me the possibility of an Agent Team. But it also made me realize that just having Issues and automatic assignment is not enough. Because what really limits efficiency is not the Agent's ability to execute tasks, but whether tasks are clarified before entering the system; whether Agents understand the background when taking tasks; whether temporary Bugs are placed in the correct position when entering the cycle. That is, the difficulty of an Agent Team is not just 'letting Agents work', but 'letting Agents do the right work in the right context'.

So in the second version, I started trying to solve these problems.

Since in the first version, requirement clarification, task splitting, and priority judgment are still on me, can we also split these responsibilities? Since in real software teams there are product managers, project managers, frontend, backend, database, and testing, should the Agent Team also be organized this way?

So, I started the second version experiment: splitting the Agent Team more like a real software development team. As a result, new problems also came.