---
layout: post
title: "Don't Mythologize Skills — What Matters Is the Way of Working Behind Them"
date: 2026-08-12
categories: [Blog]
tags: [Agent, skill, AI engineering, way of working]
linkedin: true
---

# Don't Mythologize Skills — What Matters Is the Way of Working Behind Them

As model capabilities improve, I'd also recommend using fewer of those complex skills. I think most of us know this feeling: you install a pile of hyped-up skills, and yet you don't see much real improvement when you actually use them. I've always advised people to straighten out their own workflow first, rather than blindly copying someone else's — no matter how famous they are.

This trend has been especially strong over the past six months, and it's quite frustrating. It feels like everyone is collecting skills, sharing skills, and bookmarking skills — as if feeding an Agent a nicely written `.md` file will suddenly make it reliable, sensible, and infallible. Some people even treat it as the iron rule for taming out-of-control Agents: unclear requirements? Add a clarification skill. Code keeps being wrong? Add a review skill. Workflow drifting off? Add a constraint skill. In the end, you burn a ton of tokens without much better results.

A skill itself doesn't produce capability — it just copies capability that already exists. What you should learn is how the person behind it works on a daily basis.

## What a Skill Is, and What It Isn't

Let's be direct. A Skill makes implicit working methods explicit: it takes the process in some capable person's head — prompts, steps, constraints, and tool calls — and writes it down so an Agent can follow it too. That in itself is valuable; it makes good methods replicable and distributable.

But a skill can't solve problems you didn't know how to solve in the first place.

This is a trap people fall into easily. Many assume that adding a requirement-clarification skill will make the Agent clarify requirements on its own. Wrong. That skill works because the person who designed it already had a method for clarifying requirements — they simply encoded their habit into a file. If you don't have that method in your own head, the skill you copied is just an empty shell. The Agent reads the script, asks surface-level questions that miss the point, and you still start work in a fog.

When you see an impressive skill, your first reaction shouldn't be "I need to install this too." The question should be: how does the person behind this file actually work?

## grill me: Not a Questioning Trick, but a Discipline of Exhausting Uncertainty

First example: grill me.

On the surface, it's a skill that makes the model keep asking you questions until both sides are clear before starting. Many people find it novel — the model learned to ask back, how cool. But I often run into it over-asking, so when to stop it, and where the boundaries of questioning lie, is your own skill.

What's really valuable isn't the act of "the model asking questions" — it's the rule behind it: before writing the first line of code, force out all the ambiguity, conflicts, and omissions in the business logic.

Whether in development or design, this rule matters enormously.

Think about it. A requirement doc casually says "process the file after the user uploads it." What does "process" mean — parse, compress, or recognize and classify? What if it fails — retry or error out? How much concurrency is normal? How does sensitive-file compliance pass? If even one of these isn't thought through, you discover the misunderstanding only after writing the code — and fixing it costs ten times more than asking upfront.

What grill me does is force you to think all of that through before acting. It turns "align first, then execute" into a mandatory process.

Learning from grill me isn't about making the model ask questions. It's about exhausting uncertainty before you start. That discipline should stay with you even after you delete the skill file.

## The TDD in superpower: Borrow the Thinking, Not the Form

Second example: the test-driven workflows in skills like superpower.

Their approach: write tests first, define what "done" looks like, then write the implementation to satisfy them. The thinking is genuinely good — it gives every stage a verifiable standard instead of coding head-down until you discover problems at the end. They also emphasize stage-by-stage progress reports, which is especially important when collaborating with an Agent, because you need to know where it is and whether it's on track.

In practice, though, you'll find the skill writes you a pile of tests — it gets very slow and becomes a burden. Especially since verifying anything means running a bunch of regression tests every time. A lot of those tests are completely unnecessary.

I wrote a dedicated piece about testing before: tests are not medals, they're brakes; not decoration, they're a steering wheel. Earlier tests are faster, narrower, cheaper; later tests are fewer, heavier, and closer to reality. During exploration and prototyping, you have no idea what the final form looks like — pairing three tests with every line of code at that stage is pure negative equity. Don't be bound by TDD's form, struggling for half a day to produce a single line of working business logic while fighting the test framework.

| What to borrow (the thinking) | What not to copy (the form) |
|---|---|
| Define what success looks like for this step before starting | Forcing N tests per line of code |
| Leave a deliverable at each stage that humans and models can inspect | Writing full test suites regardless of stage importance |
| Stage-by-stage reports to keep both sides aligned | TDD for the sake of TDD |

You don't really need TDD. You need to know what success looks like before starting, and leave an inspectable checkpoint at every stage. Take the thinking, discard the form as you see fit. Borrow the discipline of setting standards before acting — not the ritual of red-green-green test passes.

## How to Learn from a Skill

When you see a good skill, don't rush to bookmark it. First ask yourself three things.

1. Which implicit working method does it make explicit — turning ambiguity into clarity, delivering in stages, or setting verification checkpoints?
2. Where does this method solve a problem in my own work — misreading requirements, or discovering halfway that the direction is wrong?
3. Can I strip it down into a habit that works without depending on the file?

The skill you truly absorb is the set of actions you'd still follow with the file closed: align before starting, leave checkpoints at each stage, have a verifiable standard for done, and verify truth before presenting conclusions.

Once these actions become instinct, your work is solid whether or not you write the skill file.

Skill is the skin; way of working is the bone. Files can be copied; instincts can't. Good skills help you know earlier where you should slow down — the more of those, the better. The kind that lets you stop thinking is more dangerous to keep.

Next time you see a stunning skill, don't hit bookmark first. Ask one question first: how does the person behind it work on a daily basis? The answer is often worth far more than the file itself. This knack for looking at the person rather than the file may become increasingly important.
