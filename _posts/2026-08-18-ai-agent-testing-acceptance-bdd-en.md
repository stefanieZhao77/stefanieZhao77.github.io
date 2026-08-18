---
layout: post
title: "Testing and Acceptance in the AI Agent Era: It Starts with BDD"
date: 2026-08-18
categories: [Blog]
tags: [Agent, BDD, Testing, AI Engineering]
linkedin: true
---

# Testing and Acceptance in the AI Agent Era: It Starts with BDD

Why is testing AI agents so hard? Traditional testing rests on an implicit premise: the same input should always produce the same output. Assertions pin down both halves, and if one is right, the other is wrong. That premise simply doesn't hold for agents. Ask the same question and the model gives a different answer this time; the tool call paths differ, even the number of steps can change. Asserting "the reply must exactly equal this sentence" is meaningless.

So testing agents requires a shift in mindset: from "verify whether the implementation is correct" to "accept the behavior that should be". That is exactly what BDD was made for.

## What is BDD?

BDD, Behavior-Driven Development, was proposed by Dan North in 2006. It doesn't care what the code looks like inside; it only cares about the behavior the system exhibits to users. Tests are written in natural language in the Given/When/Then format, written together by business, development, and QA — what gets written is both the requirement and the acceptance criteria. Its most important shift: elevating "test" from a verification tool to a "specification". Tests answer whether the code is right; specifications answer what the behavior should be.

A Gherkin scenario looks like this:

```
Export fewer than ten thousand rows of data
Given the user is looking at a dashboard with 8,432 rows
When the user clicks "Export CSV"
Then the file starts downloading within 5 seconds
And the file contains exactly 8,432 rows
```

Business people can read it without knowing code, review it, and even write it themselves.

Why does BDD fit the agent era even better?

First, BDD cares about the behavior contract, not implementation details. Agents are probabilistic systems; you can't dictate how it does each step, but you can dictate what outcome it must achieve. Given/When/Then cuts the reasoning space into segments, constraining only the boundaries, not the route — the agent finds its own way.

Second, acceptance criteria are becoming the agent's system prompt. I once read that acceptance criteria are the new system prompt. I've found agents often pass tests in ways that don't match real business (because their goal is to pass the tests). As long as the tests can be changed, it will always find the laziest path to green — the classic case being quietly changing "all eligible products get discounted" into "at least one product gets discounted". Gherkin plugs this hole. Tests are written before the code, in business language, signed off by the product owner, and stored in a file everyone can read.

Third, scenarios are both tests and the agent's execution blueprint. Give an agent a piece of Gherkin and you've given it a clear behavioral spec; it writes the implementation against it and reworks if it can't pass. That is BDD-driven agent delivery.

## How do you actually test?

BDD provides the skeleton; asserting agent output quality truly relies on three layers:

Layer one, deterministic assertions. Are the tool calls correct, are parameter formats correct, are required fields present, is latency under budget. These can always be hard-coded and should never regress.

Layer two, LLM as judge. Relevance, tone, coherence, hallucination detection — these can't be asserted with booleans, so have one model grade another model's output against a rubric you wrote. With a good rubric, LLM judges agree with human review about 80% to 85% of the time. Some people write the LLM judge's score threshold directly into the BDD Then step, e.g. "reply correctness score must be no lower than 0.7". This practice comes from a hands-on session at a 2026 developer conference: Behave runs the Gherkin scenarios, DeepEval does the scoring, test reports carry the full Q&A transcripts, and it runs on every push in CI.

Layer three, adversarial inputs. Prompt injection, jailbreaks, boundary phrasing — these need dedicated red-team testing. Tools like Promptfoo build injection and jailbreak detection into their built-in features.

Tool choice depends on your team's workflow:

| Tool | Form | Best for |
| ---- | ---- | ---- |
| DeepEval | Open source, pytest style | Python teams that want it alongside existing unit tests |
| Promptfoo | Open source, YAML/CLI | Local runs, model comparison, and red-teaming |
| LangSmith | Managed service | LangChain/LangGraph users who need production observability |
| Braintrust | Managed platform | Larger teams that need unified evaluation plus production monitoring |

There are plenty of tools, but what truly determines evaluation quality is the test set you start with. Anthropic's official advice: pick 20 to 50 tasks from real user failures as a starting point, better than fabricating 200 synthetic cases. Real failures expose the distribution shift between expectations and reality; synthetic data revolves around the happy path and misses all the failure modes. Balance positive and negative examples — refusing to do what users shouldn't ask for also counts as correct behavior. Two independent graders should agree. Isolate state between runs. And watch for evaluation saturation: once the pass rate hits 100%, the cases are too easy and it's time to swap them. Public benchmarks have a shelf life of only six months to a year; once they become a target to game, they no longer measure what you care about. That's Goodhart's law, validated by LiveCodeBench's constantly updated problem set.

Start with five to ten golden cases: real problems you'll encounter paired with ideal answers. Assert the deterministic parts with code; for the semantic parts, pick just one or two of the most important metrics for the LLM to judge. Every commit that changes a prompt, tool, or logic triggers an evaluation. Review failing cases weekly and add new ones from production incidents. Pick one open-source tool to get going — DeepEval with pytest, or Promptfoo with CI. Either works.

Acceptance criteria are the cheapest boundary line of the agent era. They give "what did we get right" a definition everyone can understand and no one can silently change. You don't need an expensive framework; you just need to write behavioral expectations into an executable, readable, signed-off file, and let the agent work against it. BDD has been doing this for twenty years — now it's its turn to shine.
