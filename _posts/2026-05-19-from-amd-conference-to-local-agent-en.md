---
layout: post
title: "The Next Phase of AI: From the AMD Conference to Building Local Agents"
date: 2026-05-19
categories: [Blog]
tags: [AI, AMD, Local AI, Agent, Enterprise AI]
linkedin: true
---

After attending the AMD conference this morning, my biggest takeaway wasn't about how powerful the hardware is. It was that AMD has bet on something that will be a crucial deployment model for AI's future.

Over the past year or two, conversations about AI have defaulted to cloud-based large models, API calls, token consumption, and model capability rankings. The implicit assumption is that as long as models keep getting stronger, enterprises just need to plug into a good API and AI transformation will happen naturally. But from my experience building enterprise AI products, reality is far more complex.

What enterprises truly care about isn't "can I access the most powerful model?" but more fundamental questions: Can my data stay under my control? Can my knowledge base stay local? Can AI truly understand and execute my business processes? Can we control costs? Will the system keep working when the network is unstable?

This is exactly why I believe AMD has chosen the right direction. They aren't just talking about more compute power. They're describing a new form of AI infrastructure: local devices, local models, enterprise private knowledge bases, multi-agent orchestration, with cloud capabilities accessed only when necessary. The conference repeatedly emphasized that after the AI demand explosion, the key is no longer who burns the most compute, but who uses it more intelligently. AMD broke down AI development into a combination of laptop, local workstation, and cloud paths — rather than pushing everything to the cloud.

## Cloud API Isn't the Only Path for AI

Many people still think of AI as purely an API model: an enterprise raises a request, the system sends content to a cloud-based large model, the model returns a result, and the business system continues from there.

But this model has several inherent limitations:

First, **data security**. Especially in China's enterprise environment, many companies are unwilling to send their core data, customer information, process flows, and internal knowledge bases to external platforms. Even if technical anonymization is possible, it's hard to accept psychologically and from a compliance standpoint. What many enterprises really want is: AI is usable, but core data stays local.

Second, **cost**. Current cloud-based large models have significant "capability redundancy." Many business processes don't need the most powerful model at every step. Tasks like internal knowledge base Q&A, document screening, order information sorting, process status determination, simple data extraction, and classification value stability, low cost, controllability, and high-frequency invocation far more than using the most expensive, most powerful model every time.

Third, **network**. Many people overlook this when building AI applications, but in real enterprise scenarios, network stability is a major variable. If a business process is highly dependent on remote APIs, then network latency, access failures, and service fluctuations all become part of the business system's risk profile. For high-frequency, low-latency, privacy-sensitive scenarios, local models are actually more practical.

I increasingly believe the mainstream form of AI won't be "all cloud" but a hybrid architecture combining cloud-based large models, local models, edge devices, and enterprise private systems. The cloud handles the most complex, general, reasoning-heavy tasks; local models handle high-frequency, low-cost, privacy-sensitive tasks tightly coupled with business processes. The conference also noted that the future is device-cloud collaboration, where local models take on more work in low-cost and privacy scenarios, only calling more advanced cloud models when tasks are complex enough.

## AMD's Focus on Local AI in China Is a Very Practical Decision

AMD's decision to emphasize local AI in China makes perfect sense.

Chinese enterprises have strong demand for AI, but that doesn't mean they'll unconditionally embrace cloud APIs. On the contrary, once enterprises enter real business deployment, they become very concerned about data asset ownership, knowledge base localization, system controllability, and long-term costs.

This aligns closely with my own experience building enterprise AI products. It's not that enterprises don't want to use AI — it's that they struggle to accept a completely black-box, fully externally dependent, continuously token-consuming system that keeps sending core data outward. This becomes even more pronounced when AI starts entering internal business processes rather than just acting as a chat assistant.

Because once AI truly participates in business operations, it's no longer just answering questions — it needs to understand the company's customers, products, processes, rules, historical data, and internal experience. At that point, what's most valuable to an enterprise isn't "which model they called," but whether they've structured their data and processes into assets that AI can invoke.

Kai-Fu Lee's comments at the conference about enterprise AI transformation pointed to the same thing: a company's true competitiveness must ultimately be held in its own hands. Only when AI can participate in real work within a local environment — visible, controllable, and manageable — will enterprises entrust core business to it.

I deeply agree with this. The key to enterprise AI transformation isn't purchasing an AI tool or launching a chat interface. It's about gradually transforming the knowledge scattered across documents, spreadsheets, meetings, personnel experience, and business systems into digital assets that agents can understand, invoke, execute, and provide feedback on.

## Not Every Task Needs the Most Powerful Model

In the past, discussions about AI defaulted to "the stronger the model, the better." But entering real enterprise scenarios reveals this assumption doesn't always hold.

Enterprises have many tasks that are fundamentally structured execution rather than open-ended creation. Recognizing which table a form should be imported into, determining whether a customer requirement is complete, checking if an order is missing fields, organizing action items from meeting minutes, or advancing a process step based on existing workflows. These tasks certainly need AI, but not necessarily the most powerful large model.

Often, what enterprises really need is a local model that's stable enough, cheap enough, and close enough to business data. This model doesn't need to know everything about the world, but it needs to deeply understand the company's knowledge base, process rules, and business context. It doesn't have to deliver stunning answers every time, but it must be able to embed into business flows consistently, reliably, and at low cost.

This is the true value of local AI. It's not about directly competing with cloud-based large models. It's about taking on the work that cloud models aren't suited for. The more rational future architecture would have local models handling most high-frequency, repetitive, privacy-sensitive, and process-oriented tasks, with cloud models intervening only when complex reasoning, cross-domain judgment, or high-quality generation is needed.

This way, the AI system is no longer an "every request goes to the cloud" application, but more like a layered intelligence system. The bottom layer has local models and agents responsible for understanding internal enterprise data and processes; the top layer has more powerful cloud models handling a minority of complex problems. What enterprises truly need to build isn't point-solution model capability, but a long-term evolvable agent orchestration system.

## Enterprise AI Transformation Must Start with Data Structuring

From an enterprise perspective, the future competitive differentiator may not be "whether you've adopted AI," but "whether you've structured your business into assets AI can use."

Enterprises need to gradually structure their knowledge bases, customer feedback, product information, business processes, historical projects, expert experience, and internal decision-making logic. Otherwise, even with the most powerful large model, it can only answer questions based on external general knowledge — it can't truly understand why a particular company operates the way it does.

This is the biggest obstacle in many enterprise AI projects. Not that the model isn't powerful enough, but that the enterprise's own data isn't ready, processes haven't been clearly articulated, and business rules still exist only in people's experience. AI can generate content, but it can't magically understand an organization's tacit knowledge.

So when enterprises embrace multi-agent systems, they shouldn't start with "I want to build many agents." They should start with "what knowledge and processes do I have worth structuring?" An agent without data, tools, process interfaces, and a feedback loop is just a more sophisticated chatbot. Only when enterprises structure their digital assets can agents truly participate in business execution.

I believe enterprise AI transformation will increasingly resemble organizational engineering. Not placing AI alongside existing processes, but rethinking which processes can be decomposed, which judgments can be assisted by models, which tools can be exposed to agents, which results need human review, and which feedback can feed back into system updates.

Throughout this process, CEO or top management push is critical. AI transformation isn't a small tool upgrade for the IT department. It touches data, processes, organizational collaboration, and management methods. Without top-down impetus, it's easy to remain in the trial phase, ending up with a few scattered AI plugins rather than a system that truly changes how the enterprise operates.

## Engineers No Longer Just Deliver Code

Another point that resonated with me at the conference was the changing role of engineers.

In the past, an engineer's core deliverable was code. Product managers raised requirements, engineers implemented them, QA verified, and user feedback fed into the next iteration cycle. But in the AI era, this division of labor is blurring. Since AI can participate in code generation, an engineer's value can't remain limited to "writing code." It must move upstream to problem definition, system design, business understanding, and product feedback loops.

Future engineers will need to use engineering thinking to participate in earlier-stage work. Why a market trend matters, what users truly need, which requirements can be systematically expressed, which processes can be decomposed into agent-executable tasks, where human review must be preserved, and which feedback should enter the next iteration.

In other words, engineers no longer just deliver code. They deliver a product system that can run, be verified, and be iterated upon. This system includes not only frontend pages and backend APIs, but also data structures, AI tool invocation, agent orchestration, testing and verification, user feedback, and continuous optimization.

This aligns with what I've been thinking about recently. AI-assisted programming doesn't mean engineers just let agents auto-generate code. What truly matters is that engineers systematize their workflows — organizing requirements analysis, solution design, code implementation, testing verification, and feedback iteration into a stable loop. AI can improve each phase's efficiency, but the prerequisite is that people must first clarify the process.

## Individuals Should Also Structure Their Skills

If enterprises need to structure their data and processes into agents, the same applies to individuals.

I increasingly believe that everyone will need to structure their knowledge, experience, judgment methods, and workflows into a Skill. This Skill isn't just a prompt or an automation script. It's a reusable working methodology.

How an engineer analyzes requirements, breaks down tasks, makes technical choices, does code reviews, designs tests, and handles user feedback — all of these can gradually be abstracted. In the past, these capabilities only existed in people's minds — hard for others to replicate, hard for oneself to scale. But with the help of AI agents, this experience can be encapsulated into an executable, callable, iterable system.

This leads to a fascinating future vision: work relationships may no longer be about hiring someone's time, but about hiring the agent system someone has trained and maintained over the long term.

The person still matters. Direction-setting, critical decisions, quality reviews, and value judgments still need human responsibility. But a large amount of specific execution work can be handed to the local agent they've built. A person might no longer spend eight hours on repetitive work, but instead spend one or two hours checking results, adjusting direction, updating their Skill, and continuing to optimize their agent based on new project experience.

From this perspective, how individual capability is expressed will change. In the past, we used resumes to prove what we've done and interviews to prove what we know. In the future, perhaps a person's truly valuable asset is whether they have a long-refined workflow and whether they can turn their experience into a running agent.

## The Future of Compute May Be More Decentralized

If we look further ahead, AI compute may also become more decentralized.

Today's AI infrastructure is largely concentrated in the cloud, with large model companies and cloud providers supplying compute, models, and APIs. But if local devices become increasingly powerful, local models increasingly capable, and agent orchestration increasingly mature, then not all intelligence needs to be concentrated on a few cloud platforms.

Everyone can have their own local agent. Every company can have its own enterprise agent network. An organization doesn't have to send all tasks to a single centralized model. Instead, it can combine many small, specialized agents with specific experience. What employers may need isn't infinite cloud compute, but the ability to orchestrate agents from different people, different departments, and different business systems.

This isn't to say cloud large models aren't important. On the contrary, they remain very important — handling more complex, general, and higher-level reasoning tasks. But local agents will take on more and more specific, daily, personalized, process-oriented work. The future AI world may not be one super brain doing everything for everyone, but countless local intelligences forming a more distributed work network.

This is why I think AMD's path has value. They're not just talking about hardware performance. They're providing infrastructure for this distributed, localized, hybrid AI paradigm. If the future truly sees a large number of local models, local agents, enterprise private knowledge bases, and on-device inference, then hardware, software stacks, and development ecosystems must reorganize around this change.

## Conclusion

So, after attending this AMD conference, I'm more certain than ever: the next phase of AI isn't just about models getting bigger or API calls getting cheaper. It's about individuals and enterprises beginning to structure their knowledge, processes, and data into running agents.

For enterprises, what truly matters isn't which AI tool they bought, but whether they've turned their business data, industry knowledge, and process rules into digital assets, and built controllable, orchestrateable, feedback-driven multi-agent systems on that foundation.

For individuals, what truly matters isn't whether they know how to use a particular AI tool, but whether they can structure their experience, judgment, and working methods into Skills, and further into their own local agents.

In this sense, AMD's local AI story isn't just about hardware. What it really points to is a structural shift: AI moving from cloud capability to local capability, from general models to enterprise processes, from one-time invocation to long-term structuring. Future competition may not be about the ability to call AI, but about the ability to own, train, and continuously update your own agents.
