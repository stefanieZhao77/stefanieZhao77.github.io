---
layout: post
title: "How I Built a Software Development Agent Team with Paseo + Beads (Part 2)"
date: 2026-07-05
categories: [Blog]
tags: [Agent, AI, Software Design, Product Design]
linkedin: true
---

In the previous post, I described how the first version of the Agent Team got off the ground.
The initial workflow was quite straightforward: I would define a Release, break it down into Features and Bugs, and write them into Beads. Then through a Dispatcher, these Issues would be assigned to different Agents for development, testing, and fixing.
Once this workflow was running, Agent coding was no longer just "a conversation between me and an AI" — it felt more like orchestrating a small development queue.
But the first version quickly exposed some problems: the entry point of the entire system was still me. I had to clarify requirements, break down tasks, write Issues, judge priorities, and supply context. Agents could pick up tasks and fix bugs, but whether they acted correctly still depended on how thoroughly I had done the upfront work and how clearly I had drawn the boundaries.
The first version appeared to have an automatic loop, but its upstream was still highly dependent on my efficiency.
So I started working on the second version. If development tasks could be handed to Agents, why not requirement clarification, task breakdown, context management, and version management too?

## Version 2: Restructuring the Agent Team Like a Software Organization

Since human software development isn't done by one person, but through collaboration among product managers, project managers, architects, frontend developers, backend developers, testers, reviewers, release managers, and others — why couldn't the Agent Team be designed the same way?

So I began offloading the work that had been on my shoulders in V1:

• The Product Manager Agent clarifies ambiguous requirements into well-defined ones.

• The Project Manager (Manager Agent) breaks down tasks, manages Issues, prioritizes, and assigns tasks to the appropriate Agents.

• The Architect Agent evaluates the overall technical approach, module boundaries, and implementation paths.

• The Frontend Agent handles UI, interactions, and API integration.

• The Backend Agent handles APIs, business logic, and service layers.

• The Database Agent handles schemas, migrations, and data structures.

• The Testing Agent validates functionality, discovers bugs, and writes them back to Beads.

• The Reviewer Agent performs code review.

• The Release Manager Agent manages version cadence, worktree merging, and release-related tasks.

This way, it no longer looked like a few Agents grabbing Issues in Beads — it resembled a properly structured software development organization. It had finally evolved from "task distribution" to "team collaboration."

In V2, I wanted the Manager Agent to become the new orchestration center. It wouldn't just distribute Issues from Beads to different Agents, but would also gather relevant context and package it together for the assigned Agent. This step was crucial because V1 had a major problem: Agents sometimes only saw an isolated Issue without understanding the background behind it.

In V2, this problem was somewhat mitigated. The Manager Agent could bundle requirement context, related Issues, dependency relationships, and current version goals together for the executing Agent. Instead of just saying "go fix this bug," Agents received more complete context: where the bug came from, which Feature it was related to, what couldn't be touched in the current version, and what criteria needed to be met after completion. Everything was documented.

But new problems emerged.

## More Roles, More Organizational Problems

After V2 was running, I quickly discovered a problem: the more finely I split roles, the more professional the system looked, but collaboration itself became increasingly complex.

At first, I thought that as long as I defined a role for an Agent, it would work like its human counterpart. But in human teams, "roles" involve more than just picking up and executing tasks — they also require knowing the right "timing." A product manager knows when to clarify requirements. A developer knows which issues need to go back to the PM for discussion. An architect knows when to provide a design versus when not to jump in and modify code directly. A reviewer knows their focus is review, and also knows when an issue should be escalated to the right person.

These things aren't written in job titles. They come from years of software engineering experience, team collaboration habits, and organizational tacit knowledge — things Agents don't inherently possess. If you tell an Agent "you are the Architect Agent," it will start thinking like an architect. If you tell it "you are the Reviewer Agent," it will start checking code quality. If you tell it "you are the Release Manager," it will focus on versioning and merging.

But the problem is, it doesn't truly understand the boundaries and actual responsibility flow of that role within the team. It knows what it's called, but that doesn't mean it knows when to step in and when to step back. So V2 began to show some chaos.

## Typical Chaos: Everyone Helping, But Boundaries Blurred

The most typical form of chaos in V2 was multiple roles trying to插手 the same problem.

Consider a Feature that required changes to the frontend UI, backend APIs, and a minor database schema adjustment. In the ideal flow: the Product Manager Agent clarifies requirements, the Manager Agent breaks down tasks, the Architect Agent evaluates the overall approach, then the Frontend, Backend, and Database Agents implement respectively, the Testing Agent validates, the Reviewer Agent reviews, and finally the Release Manager Agent handles merging and versioning. But in reality, things rarely went that smoothly.

The Product Manager Agent might slip in implementation suggestions while clarifying requirements. The Architect Agent might deem that approach insufficient and redesign the technical path. The Manager Agent then had to decide whether to follow the PM's breakdown or the architect's. The Frontend Agent, finding the APIs insufficient, would start suggesting backend changes. The Backend Agent would decide the requirement should actually adjust the database. The Database Agent would worry about impacts on future releases. The Reviewer Agent would propose a new set of changes. And the Release Manager Agent, when finally merging worktrees, would discover that multiple Agents had modified the same files.

Every Agent was trying its best, but because role boundaries weren't stable enough, the entire system began generating additional coordination overhead. Human teams have this problem too — one role dominates, another oversteps, or the PM doesn't clarify decision rights, all slowing down collaboration. But in human teams, people eventually develop默契 (tacit understanding). In an Agent Team, if these boundaries aren't explicitly designed, they won't form automatically.

## More Roles ≠ Better. Agent Team Granularity Shouldn't Be Too Fine

Initially, I split roles so finely because I wanted to replicate a more "professional" human development team. But after running it, I realized that human team roles work not just because of their positioning, but because of the vast amount of implicit organizational experience behind them. These boundaries might be common sense to humans, but not to Agents. If you don't encode these boundaries into the system, simply telling an Agent "you are role X" means it will understand the role linguistically but not organizationally.

More roles aren't necessarily better. The more roles you have, the higher the demands on your collaboration protocols. Without sufficiently clear protocols, more roles won't bring stronger team capabilities — they'll bring more coordination overhead.

## V2 Still Wasn't Ideal

What truly matters in software development isn't how many roles you have, but whether you can reliably complete a delivery. How many Agents does it really take to complete one software delivery cycle? That was the starting point for V3.

In V3, I began subtracting: consolidating clarification, breakdown, and assignment into one Agent; consolidating development into one Agent; consolidating testing and feedback into one Agent. Not because the other roles aren't important, but because for an Agent Team, the first thing that needs to stabilize isn't organizational completeness — it's whether the delivery闭环 (closed loop) can actually work. So in V3, I shifted from "does it look like a team" to "can it form a minimally viable delivery system."