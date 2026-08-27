---
layout: post
title: "A Thousand Agents Pick Sides on Their Own: AI Has a Herd Effect Too—and It's Worse Than Ours"
date: 2026-08-27
categories: [Blog]
tags: [AI, Agent, Herd Effect, Collective Intelligence]
linkedin: true
---

Recently I came across a new experiment in which researchers put a thousand AI agents in a room and asked each to choose A or B. A and B were completely identical—picking either earned no reward, and no one told them to cooperate. The only information each agent had was what everyone else had chosen, and then it got to choose again. In the end, they converged.

This was no accident. The researchers swapped in ten different models—from GPT and Claude to the open-source Llama—and ran it over and over. Every time, the group's choice snowballed into a single answer. The paper was published in *Science Advances*, and the authors gave this phenomenon a name: the majority force.

Human herd behavior is nothing new; social psychology has studied it for a century. What's surprising is two things.

First, the agents have no memory. Each round is a brand-new conversation. An agent doesn't know what it chose in the previous round, let alone anything about "peer pressure." It simply glances at the list of others' answers and makes its own choice. In other words, herding isn't something that's taught—it's built into the model's capabilities.

Second, this process follows the exact same mathematics as a piece of iron becoming magnetized. In a ferromagnet, hundreds of millions of atomic spins point every which way, but once local interactions cross a certain threshold, they suddenly all align. The curve of an AI population converging on a single answer nearly overlaps with the curve of atomic spins aligning.

The most counterintuitive finding is this: we usually assume stronger models are more independent-minded, but the opposite is true—the stronger the model, the more it joins the crowd.

Humans are famous for a social-capacity limit called Dunbar's number: a person can sustain around 150 to 300 informal relationships before it becomes unmanageable. Yet top-tier models effortlessly sustain consensus among more than a thousand agents—several times larger than the biggest circles humans are good at. Smarter models aren't more independent; they're better at pulling the whole group along with them.

The researchers point to a state they call collective misalignment. Each agent, looked at on its own, is aligned, well-behaved, and harmless. But once they form a group, purely through conformity, the whole group can stably settle on a low-quality or even wrong solution. Whichever option shows up first—even if it's a bad idea—as long as it forms a majority first, the rest will follow it all the way.

This should set off an alarm. We're used to running safety tests on individual agents, checking whether they'll go off the rails. But an agent that passes every single test in isolation can behave completely differently inside a group. Point tests can't capture group behavior—just as a psychological assessment of one person can't surface the consensus problems of a crowd.

There's an even thornier problem, which the paper calls hysteresis. Once an error takes hold in a group, fixing the original faulty condition won't automatically bring the group's decision back. A herd path that's already in motion is far harder to reverse than to block in the first place. Inside an echo chamber of mutual reinforcement, the cost of correction is terrifyingly high.

What does this mean for people actually using agents? If you run agent teams, or use multiple agents to make decisions in parallel, this matters. When your five agents unanimously agree a plan is fine, that "consensus" carries no information about correctness—it only shows the majority force is at work. The one that's actually right may be the agent raising the objection; it could be the only one in the team making an independent judgment.

There are three concrete things you can do. Use different models for different agents—a team's members shouldn't all come from the same vendor; diversity is a natural anti-herding mechanism. Deliberately introduce a dissenting agent whose job isn't to contribute solutions but to poke holes. And run any conclusion the group passes unanimously through a separate human verification—especially for decisions with significant impact. Group consensus is a source of stability in engineering, and a source of danger in judgment; you need to know which side you're relying on.

As AI turns from a set of independent tools into a swarm of agents that can see one another, the majority force will make many decisions for us—and we may never know how those decisions were made.
