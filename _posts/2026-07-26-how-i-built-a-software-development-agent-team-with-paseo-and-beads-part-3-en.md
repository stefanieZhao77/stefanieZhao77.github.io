---
layout: post
title: "How I Built a Software Development Agent Team with Paseo + Beads (Part 3)"
date: 2026-07-26
categories: [Blog]
tags: [Agent, AI, Software Design, Product Design]
linkedin: true
---

In the previous post, I described the problems with the second version of the Agent Team.

In V2, I had tried to break the Agent Team into an organization that closely resembled a real software company: Product Manager, Project Manager, Architect, Frontend, Backend, Database, Tester, Reviewer, Release Manager — even considering worktree merging and version management.

The design felt complete at first. Because real software teams do work this way. Someone clarifies requirements, someone breaks down tasks, someone oversees architecture, someone implements, someone tests, someone reviews code, someone manages releases.

But once it was actually running, I found a problem: an Agent Team can't simply copy the organizational structure of a human company. Roles in human teams aren't just job titles. Behind them are years of experience, tacit understanding, boundary awareness, and organizational habits. A person knows when to suggest, when to decide, when to stop, and when not to overstep. Agents don't have these default conventions. They don't truly understand the boundaries of their role within the team. The result: the more roles you add, the more professional the system looks — but collaboration costs go up too.

So in V3, I started subtracting.

## From Full Organization, Back to a Minimal Loop

The biggest lesson from V2 was this: the goal of an Agent Team is not to simulate a real company — it's to reliably complete a software delivery. These are two different goals.

Simulating a real company means defining by roles. But if the goal is completing a delivery, then the question becomes: what are the stages of delivery? These can be simply divided into three: requirements need to be clarified, broken down, and assigned; code needs to be implemented; results need to be tested and feedback provided. What truly needs to stabilize is not a complete organizational structure, but a delivery loop.

So in V3, I converged the Agent Team into three core roles:

A Manager Agent — responsible for clarifying requirements, breaking down tasks, assigning Issues, and sending relevant context to the appropriate Agent.

A Developer Agent — responsible for implementing code based on clear Issues and context.

A Tester Agent — responsible for testing, validation, finding bugs, and writing new issues back to Beads.

## Manager Agent: Consolidating the Entry Point

The biggest problem in V1 was that the entry point was me. Requirement clarification, task breakdown, Issue descriptions, priority judgment, context — I had to do it all. Agents could work, but the upstream of the entire process was still manual.

In V2, I broke these responsibilities across multiple roles, but too many roles led to coordination chaos.

So in V3, I made a counterintuitive choice: instead of splitting clarification, breakdown, and assignment across multiple Agents, I consolidated them into a single Manager Agent. This Manager Agent's responsibilities are very clear: it's not a "boss who oversees everything" — it's the entry point and scheduler for the entire task flow.

Its first job is to turn vague requirements into actionable tasks. Many times, the requirements I provide aren't naturally executable Issues. They might be just an idea, a direction, or even a sentence like "this doesn't seem right." If you hand that directly to a Developer Agent, the results are usually unstable. So the Manager Agent first needs to clarify what the requirement actually is: a new feature, a bug, a refactor, or test feedback.

Then it needs to break the requirement into appropriate Issues and write them into Beads. The key here isn't to make tasks as granular as possible, but to break them down to a level where an Agent can execute clearly. An Issue should have a clear goal, boundaries, relevant context, and acceptance criteria. Otherwise, the Developer Agent will start filling in the gaps itself, producing something that looks impressive but goes in the wrong direction.

The Manager Agent's third responsibility is task assignment. It needs to judge whether an Issue can be worked on now, whether it depends on other Issues, whether it needs testing first, or whether it should wait for another feature to be completed. Then it sends the task and corresponding context to the Developer Agent.

This way, the Developer Agent no longer sees an isolated Issue in Beads — it receives a well-prepared work package. This package should include: why this task matters, relevant background, which files or modules are involved, how it relates to other Issues, and what "done" looks like.

## Developer Agent: Just Get the Task Done

In V2, development-related roles were finely split: Frontend, Backend, Database, Architect, sometimes even a Reviewer. The problem is that real features naturally span multiple layers. Frontend changes involve APIs, backend changes involve the database, database changes affect testing and versioning. If roles are split too finely, each Agent focuses on its own piece, but the feature itself doesn't flow smoothly.

So in V3, I stopped emphasizing Frontend Agent, Backend Agent, Database Agent as separate roles, and instead converged them into a Developer Agent. The Developer Agent has only one core responsibility: given the context and Issue boundaries, implement the task.

It does not redefine requirements. It does not re-plan the entire version. It does not decide which tasks have higher priority. And it should not expand its scope of changes arbitrarily.

In V3, I want the Developer Agent to be like an executor with a clear task. It can explore the code, ask questions, and flag unclear tasks when necessary. But it should not redefine an Issue into something else.

If it discovers new problems during development, the best approach is not to expand its scope directly — but to feed the problem back to the Manager Agent, or write it back to Beads, entering the next task cycle. This makes development behavior more controllable.

## Tester Agent: Let Feedback Re-enter the System

The third core role is the Tester Agent.

In V1, testing existed, but it was more of an afterthought — run tests after development, write bugs back to Beads if found. In V3, I started treating testing more explicitly as part of the entire closed loop.

Because for an Agent Team, testing isn't just about confirming code quality — it's the feedback entry point for the entire system to keep iterating.

After the Developer Agent finishes a task, the Tester Agent verifies the results. It checks whether the Issue is truly complete, whether it meets the acceptance criteria, whether it introduces new bugs, and whether obvious edge cases are uncovered.

If testing passes, the task moves to the next stage. If testing fails, the Tester Agent writes the problem back to Beads as a new Bug Issue. Then the Manager Agent judges the priority of these bugs and reassigns them to the Developer Agent.

This forms a loop: the Manager Agent clarifies and assigns tasks, the Developer Agent implements, the Tester Agent validates, discovered problems go back to Beads, and the Manager Agent sorts, judges, and reassigns.

At this point, Beads is no longer just a list of Issues — it's the state center of the entire Agent Team. Tasks enter here, results are updated here, bugs are reported here, and the next iteration starts from here. This loop is more complete than V1 and simpler than V2.

## Release Moves to the End

Another important change in V3: I stopped binding all tasks to a Release upfront.

In V1, the entry point was the Release. Define a version first, then break it into Issues, then let Agents work. This approach fits traditional software development habits, but in an Agent Team, it can be too rigid. Agents move fast, and they discover many issues along the way. If all tasks are locked into a Release from the start, handling ad-hoc bugs, priority shifts, and dependency changes becomes awkward.

In V2, I tried to manage this complexity through a Release Manager Agent, but that introduced yet another role and more coordination overhead.

So in V3, I prefer to push Release to the end. The core focus is on getting the task loop running stably. After a few cycles, based on the set of tasks that have stabilized, we decide what can form a Release.

This way, the Release is no longer the starting point of all tasks — it's more like a periodic snapshot. It's not used to lock down all tasks in advance, but to organize, consolidate, and make release decisions after the task flow has stabilized.

## Why Three Roles Are More Stable

For an Agent Team, what matters most is not role coverage — it's whether responsibility boundaries are clear. Three roles may be few, but their boundaries are very clear. These three roles correspond to the three most essential actions in a delivery cycle: understand, implement, verify. They are converged around the delivery loop.

As for architecture, review, release — these things are not unimportant, but they don't need to become independent Agents from the start. Architecture can be a constraint the Manager Agent considers when splitting tasks. Frontend, backend, database can be different work areas the Developer Agent handles, not separate roles from the beginning. Review can be part of the Tester Agent's work or human acceptance. Release can come at the end, with humans and systems jointly deciding whether the current task set is stable enough. And each Agent can define multiple skills to handle composite tasks.

## This Structure Can Migrate to Other Tasks

Although these three posts are about software development, this approach doesn't only apply to writing code. Many complex tasks share a similar structure.

Writing an article, for example: one Agent clarifies the topic and outlines the structure, one Agent writes the first draft, one Agent reviews and suggests revisions.

Market research: one Agent defines research questions and directions, one Agent collects and organizes information, one Agent checks evidence quality and produces conclusions.

Even many internal enterprise processes are essentially this kind of loop: requirements enter, tasks are broken down, execution proceeds, results are validated, problems are fed back, and iteration continues.

So I increasingly believe the key to multi-agent collaboration isn't "many" — it's "collaboration structure." Multiple Agents working simultaneously doesn't automatically make an Agent Team. Only when they are organized around the same task system, with stable responsibility boundaries and clear feedback loops, do they truly form a Team.

## Looking Back at These Three Versions

Looking back, these three versions represent a process of continuous convergence.

V1 focused on the task system. I used Release, Issue, Dispatcher, and Agent to string multiple Agents into a working development loop. It proved that multi-agent collaboration wasn't just a fantasy — but it also exposed problems with task clarification and context organization.

V2 focused on role division. I tried to map real software team roles onto the Agent Team, giving each role a corresponding Agent: product, project, architecture, development, testing, review, release. It solved some context transfer problems, but also introduced issues with too many roles, unclear boundaries, and increased coordination complexity.

V3 focuses on the minimal loop. I stopped pursuing organizational completeness and converged the Agent Team into three roles — Manager, Developer, Tester — forming a stable cycle of requirement clarification, code implementation, and test feedback.

This is my current basic assessment of Agent Teams: an Agent Team is not about putting a bunch of Agents together, nor is it about copying a human company. It's more like designing a workflow system that can continuously absorb tasks, execute them, validate results, and feed back problems.

After all, the goal of an Agent Team isn't to look like a team — it's to actually get things done.
