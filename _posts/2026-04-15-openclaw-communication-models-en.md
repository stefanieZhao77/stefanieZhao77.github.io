---
layout: post
title: "Understanding Communication Model Choices Through OpenClaw's Integration Approaches"
date: 2026-04-15
categories: [Blog]
tags: [Agent, AI, Software Design, Communication Model]
linkedin: true
---

When connecting OpenClaw to different devices and channels, I started systematically organizing these communication approaches. Initially, I just wanted to understand how each channel connects, but later I discovered that different platforms choosing different integration methods is actually about solving completely different premises and scenarios.

## Three Basic Bot Communication Patterns

Before diving deeper, we need to understand a few fundamental communication concepts.

### Webhook: The Starting Point of Push Model

The platform actively "pushes" messages to your server. It's like ordering takeout—the delivery person comes to your door and rings the bell (push), rather than you checking downstairs every 5 minutes (polling).

**Technical characteristics:**

- High real-time: Messages delivered immediately upon arrival
- Requires public IP or domain: Platform must be able to find your server
- Low server pressure: Only processes when messages arrive

### Long Polling: The Misunderstood "Pseudo-Real-Time"

Your server initiates a request to the platform, and the platform keeps this connection open without responding until there's a message, then the client initiates the next request.

More accurately, it's not "continuous polling," but:

> A "serial long connection request" model

It's like calling your friend and asking "Are you here yet?" and they say "Wait, I'll tell you when I arrive"—you stay on the call.

**Technical characteristics:**

- Good real-time: Near real-time, but with slight latency
- No public IP required: Suitable for local deployment
- Medium server pressure: Requires maintaining long-duration requests

### WebSocket: The True Two-Way Channel

A persistent two-way channel is established, where both parties can send messages at any time. Like two people on a voice call, whoever speaks, the other hears immediately.

**Technical characteristics:**

- Bidirectional real-time: Both client and server can initiate
- Suitable for high-frequency interactions: Chat, games, real-time data
- Complex implementation: Requires handling connection state, heartbeat, reconnection, etc.

### SSE: The Streaming Solution in HTTP World

SSE (Server-Sent Events) is an HTTP-based communication method where the server can continuously push data to the client after the connection is established. It's like opening a continuously open "information broadcast channel"—whenever the server has new content, it sends it in, you just receive. Unlike traditional requests, once established, the connection stays open, with data continuously sent as a "stream."

**Technical characteristics:**

- Unidirectional communication (server → client)
- Automatic reconnection (native browser support)
- HTTP-based, strong compatibility

## OpenClaw's Communication Channels

OpenClaw supports multiple communication platforms, but the differences between these platforms aren't just about different integration methods—they also differ in how they abstract "events" and "interactions." Here are two concepts:

- Communication method: How the message is delivered
- Event model: What this message represents

Communication methods are like "courier services," while events are more like "the letter's content." Even through webhook integration, some platforms only tell you "received a text segment," while others explicitly tell you—the user sent a message, clicked a button, or a process status changed.

### Official Bot API: Complete Communication and Event Models

These platforms not only provide stable integration methods but also define clear event models, making them the most suitable infrastructure for building Agents.

| Platform | Communication | Event Model | Interaction | Features |
|---|---|---|---|---|
| Telegram | Webhook / Long Polling | Update (message-driven) | ⭐⭐⭐ | Simple and direct |
| Slack | Webhook / Socket Mode | Event (complete event system) | ⭐⭐⭐⭐ | Strong interaction |
| Discord | WebSocket | Gateway Event | ⭐⭐⭐⭐ | Strong real-time |
| Feishu | Webhook | Event (message / card / approval) | ⭐⭐⭐⭐ | Strong business integration |
| Google Chat | Webhook | Message Event | ⭐⭐⭐ | Lightweight |
| Microsoft Teams | HTTPS | Activity Event | ⭐⭐⭐⭐ | Enterprise integration |

The benefit of this category is that the platforms have already defined "events" for you.

### Unofficial Integration: Communication Exists, But Stable Event Abstraction Lacking

These platforms typically don't have complete Bot APIs and require protocol simulation or wrapping to achieve integration.

| Platform | Communication | Data You Receive | Interaction |
| -------- | ------------- | -------- | ---- |
| WhatsApp | Long connection (simulating Web client) | Raw message content | ⭐⭐⭐ |
| Signal | Local tool forwarding | Raw message content | ⭐⭐ |
| iMessage | System notification forwarding | System messages | ⭐⭐ |
| WeChat (Personal) | Client simulation or automation | Scraped message content | ⭐⭐⭐ |

The core problem of this category: communication can be achieved, but the event model is "inferred"—users must determine themselves whether it's a regular message or command, input or state change.

### Open Protocols: Neither Communication Nor Events Bound to Platform

There's another category of solutions that don't depend on specific products, but on open protocols:

|Platform|Communication|Event Model|Features|
|---|---|---|---|
|Matrix|HTTP / WebSocket|Standardized event structure|Self-hosted|
|IRC|TCP Socket|Simple message model|Minimalist|
|Mattermost|HTTP / WebSocket|Slack-like event model|Open source|

The characteristic of this category is that both communication capability and event definition don't depend on a specific platform, but are determined by the protocol itself.

## Design Trade-offs of Different Communication Models

The same is "doing communication," but different platforms choose very different models. These differences are often not about technical capabilities, but about the core scenarios they aim to solve.

Take Telegram as an example—its design focus isn't on "how strong real-time is," but on making it easier for developers to integrate with the platform.

Webhook is technically a cleaner solution. When the platform has an event, it directly pushes the data over—no additional requests, no wasted traffic. But it implies a prerequisite: your service must be "externally accessible." In other words, Telegram must be able to actively connect to you. This usually means you need a public address, a stably running service, and the ability to handle external requests.

But in reality, many developers don't work in such environments. Many bots run directly on local machines, or on internal network machines, or are just temporarily running scripts. In this case, the platform simply cannot "find you."

Long Polling solves exactly this problem. It turns the platform's active push into the client continuously waiting for results. The request is initiated by you, the connection is always outward—this bypasses the "must be publicly accessible" restriction. From an implementation perspective, it just keeps the HTTP request held, waits for data to return, then immediately makes the next request.

This is a very typical engineering trade-off: it sacrifices some efficiency (there will be repeated requests and connection overhead), but gains strong adaptability to the running environment. Telegram providing both Webhook and Long Polling is essentially to provide a more convenient integration environment.

Understanding this, looking at Discord's choice is based on its platform characteristic: assuming clients are long-online and continuously participating in interactions. So it directly uses WebSocket—in this model, communication is no longer "request and response," but a continuously existing event stream. Messages, state changes, user behaviors are all pushed in real-time through the same connection. This design is suitable for high-frequency interactions, multi-user synchronization scenarios like chat rooms, communities, or collaboration tools. In contrast, using Long Polling would not only be inefficient but also difficult to express this "continuously online" state.

And SSE represents another trade-off—this is the integration approach for Rokid glasses. The AI output you see on glasses is essentially not "interaction" (glasses have very limited interaction modes), but "content continuously generating." In this scenario, users don't need a two-way channel or complex state synchronization—they just need a stable "output pipeline." SSE retains HTTP's simplicity while allowing data to be continuously sent as a stream. It's essentially extending the "response" into a continuous data stream.

| Model | Typical Platform | Core Problem Solved | Prerequisite | Cost |
| ------------ | -------------------- | --------- | --------- | ------ |
| Webhook | Telegram (production) | How to efficiently receive events | Service publicly accessible | Complex deployment |
| Long Polling | Telegram (development) | How to integrate in any environment | Client can initiate requests | Lower resource efficiency |
| WebSocket | Discord | How to maintain real-time interaction | Client long-online | Complex implementation |
| SSE | Browser / Rokid / AI streaming | How to continuously output data | One-way output sufficient | No bidirectional support |

In the AI era, there will be more tools and frameworks, and the surface-level choices will become more complex. As technical people, on one hand, we need a clear enough understanding of the underlying principles—not to remember every technical detail, but to see what problem it solves, what its prerequisite is; on the other hand, more importantly, we need to get used to analyzing the logic behind these technical choices.

Often, the technology itself isn't complex—what's complex is whether we've seen through the scenarios it corresponds to.

And this might be a capability every engineer should deliberately train now.
