---
layout: post
title: "From Tools to Capabilities: Why SaaS Is Disappearing"
date: 2026-04-26
categories: [Blog]
tags: [SaaS, AI, Agent, Business Model]
linkedin: true
---

I recently read Amazon CEO Andy Jassy's shareholder letter, where he mentioned that Amazon's 2026 capital expenditure is projected at around \$200 billion, with a significant portion going to AI infrastructure. OpenAI alone has signed long-term contracts exceeding \$100 billion and has begun cutting SaaS budgets.

Many interpret this as a "bold bet on the future of AI." But from another perspective, it's more like a monopoly game — using capital scale to push the barrier to entry for AI infrastructure to a level that the vast majority of small and medium enterprises can never reach. This means the demand for AI infrastructure isn't something that will emerge in the future — it has already been locked in. Once computing power, models, and platforms are locked up by a handful of companies through capital scale, the barrier to entry at this layer becomes so high that most companies simply cannot participate.

The problem is that this change will propagate directly upstream. For the SaaS industry, this isn't distant news — it's an existential threat right at the doorstep.

## The SaaS Business Model Is Collapsing

Many describe the SaaS predicament as "value anchors drifting" — customers are no longer satisfied with "renting software to use themselves"; they want experiences reshaped by AI. This characterization is too gentle. The reality is that the middle layer that SaaS relies on for survival is collapsing.

For the past two decades, SaaS business models were built on this logic: enterprises need someone to help move useful software to the cloud and continuously maintain, update, and integrate it. SaaS companies are this "middleman," earning "connection value."

But now, this layer of connection is disappearing because the upstream logic has changed. Hyperscalers like AWS and Azure are no longer just providing infrastructure — they're starting to offer AI capabilities, agent capabilities, and even directly handle business logic. Meanwhile, downstream user logic is also changing: they want to simply state their needs and have them resolved, without logging in, configuring, or learning entire workflows. Users are bypassing SaaS entirely, solving problems directly with ChatGPT or various agents, and can even have agents operate their computers to complete tasks that previously required SaaS.

Document organization, spreadsheet generation, statistical analysis — these typical SaaS scenarios are being rapidly absorbed. SaaS companies caught in the middle suddenly find themselves losing their raison d'être in a squeeze from both sides.

This is also why many SaaS companies' first reaction — adding an AI chatbox to their existing product — is almost destined to fail. Because a chatbox doesn't change the essence of SaaS. It's still a tool that requires people to log in, click, configure, and learn. What customers really want is "things get done without logging into anything." When behavioral patterns change, optimizing the existing product form becomes meaningless. I've previously analyzed in detail how to approach agent-oriented software development.

## "Going Back to a Blank Slate" Is a Giant's Privilege

Jassy repeatedly emphasized in his letter that true leaders must dare to "go back to the beginning and rethink from a blank slate." He cited examples like the Bedrock team rewriting their core engine in 76 days and Alexa+ completely restructuring its brain. These words sound inspiring, but for most SaaS companies, "going back to a blank slate" is essentially suicide.

A SaaS company with stable revenue, hundreds of customer contracts, fixed team structures, and cash flow pressures — how could it possibly reinvent itself overnight? You have customers, contracts, teams, and cash flow pressures. You can't truly "tear everything down and start over."

## Three Pragmatic Paths Forward

Since breaking the giants' monopoly is nearly impossible, what can small and mid-sized SaaS companies do?

### Become a "Component Supplier" for the Agent Ecosystem

Rather than trying to build an all-powerful AI assistant, break yourself down into atomic capabilities that agents can call. Let other agents access your data, your rules, and your industry knowledge through APIs or CLIs, rather than having humans log into your web interface. The CLI is essentially the "business interface" of the AI era. When invocation becomes mainstream, the product itself is no longer the unit of delivery — capability is.

### Hide in Niches Too Deep for Giants to Bother With

General scenarios — CRM, HR, project management, finance — will almost certainly be swept away by large platforms using AI. But vertical domains requiring deep industry know-how, complex compliance, relationship-based delivery, and localized service are areas where giants typically won't or can't go deep.

Future opportunities for small SaaS may not lie in "better project management tools" but in "tools that better understand filing processes," "tools that better understand niche tax or labor laws," or "tools that better understand specific manufacturing quality inspection standards." This isn't a sexy path, but it might be the only realistic one. After all, no matter how powerful AI becomes, it still needs to be fed data — and truly valuable data often hides in these extremely narrow, deeply specialized scenarios.

### Become the "Requirement Translation + Engineering Execution" Middle Layer

Users often don't know what they truly need. What they express are vague, outcome-oriented requirements rather than directly executable instructions. There still needs to be a layer of "translation" in between — converting natural language and business objectives into structured processes, data, and constraints.

At the same time, many problems won't disappear with AI's emergence — they'll become even more complex: how to unify data formats, how to connect processes, how to control permissions, how to ensure security and compliance. These are all highly engineering-intensive problems. In other words, even if agents can directly complete tasks, the systems behind those tasks still need to be built and maintained.

This set of capabilities is where software companies might truly find their place in the future.

## Who Gets to Stay at the Table?

So the question isn't really whether SaaS will be replaced by AI, but whether you're still understanding SaaS the old way. If today you still see yourself as a "software company" and still believe that the product and technology themselves are moats, the problem has already emerged. Because technology is becoming part of the infrastructure — encapsulated and invoked, not purchased.

Software won't disappear, but its form is changing. Past software was a tool for people to use; future software is a capability to be called.