---
layout: "post"
title: "Codex Sandbox Explained: What Can AI Do, and Who Decides Its Permissions?"
date: "2026-11-24"
categories: ["Blog"]
tags: ["Codex", "AI", "Sandbox", "Security"]
lang: "en"
description: "Having AI tell you how to change code in a chat window and having it make those changes directly on your computer are two different things. In the latter case, it can run tests, read logs, and modify files. When you give it a project, how do you ensure it works only within the boundaries you have set?"
summary: "Having AI tell you how to change code in a chat window and having it make those changes directly on your computer are two different things. In the latter case, it can run tests, read logs, and modify files. When you give it a project, how do you ensure it works only within the boundaries you have set?"
cover: "/assets/images/posts/2026/11/codex-sandbox-en.png"
thumbnail: "/assets/images/posts/2026/11/codex-sandbox-en.png"
translation_url: "https://stefaniezhao77.github.io/blog/2026/codex-sandbox-permissions/"
linkedin: false
x: false
---

Having AI tell you how to change code in a chat window and having it make those changes directly on your computer are two different things. In the latter case, it can run tests, read logs, and modify files. When you give it a project, how do you ensure it works only within the boundaries you have set?

OpenAI recently published an article about how the Codex sandbox is designed. I want to use a few concrete examples to explain why simply telling the model “don't touch other files” is not enough, why Codex does not put all local development in containers, and what “only allow writes to the workspace” actually restricts.

## Why isn't it enough to say “don't touch other files” in a prompt?

For example, you ask Codex to fix the tests for a website and add: “Only change this project; don't touch my other files.”

After making the changes, Codex runs the tests. The project's tests require the code to be compiled first. During compilation, the compiler writes a cache to a directory outside the project so it does not have to compile everything from scratch next time. Codex may not know about this extra step. If that directory is outside the allowed write scope, the compiler cannot write to it, and the tests may not finish.

In this example, three things are handled separately:

1. **The model decides to run the tests.** It chooses a command based on your task.
2. **The harness starts the command.** This is the layer of software that connects the model and its tools. It runs the command under the current permission settings and, if more permissions are needed, follows the applicable approval rules.
3. **The sandbox limits what the command can actually do.** When the compiler tries to write its cache, the system checks whether the target directory is writable. Even if the command starts other programs, those programs do not automatically gain more permissions as a result.

So allowing Codex to run tests is not the same as allowing the test programs to write to any directory. If it really needs that cache directory, you could consider granting access only to that directory. Running the entire command outside the sandbox is a different matter: it removes one layer of restrictions, leaving only the system permissions the current account already has.

## Why not just use Docker?

Containers and virtual machines can both provide isolation. The difficulty is that local development often needs things already installed on your computer.

For example, an iOS project needs the Xcode toolchain and simulator on a Mac. Putting the whole project in a Linux container cannot bring those tools into it. If that step ultimately has to be handed back to the Mac, the restrictions inside the container cannot govern it, and permissions must be configured separately on the Mac.

The OpenAI article says Codex first establishes the permissions, then uses tools on each operating system to put those rules into effect. Returning to the example of writing a cache:

- **macOS uses Seatbelt.** This is the sandbox built into macOS. Codex tells macOS which directories cannot be written to. When the compiler actually tries to write, macOS rejects the operation.
- **Linux uses bubblewrap and seccomp.** Bubblewrap first arranges which directories a program can see, which are writable, and which are read-only. The files stay where they are; there is no need to copy them elsewhere. Seccomp handles a different matter: a program must ask the operating system for help to do certain things, such as creating certain kinds of network connections. These low-level requests are called “system calls,” and seccomp can block some of them.
- **Windows uses MXC.** This is an isolation tool provided by Microsoft. Codex uses it to start programs, which can still use the development tools already installed on your computer, while which files they can read or write and whether they can access the network remain subject to the configuration. The original article says Codex is migrating to this approach and currently uses it only on compatible devices.

This lets you keep using an existing development environment without reinstalling the tools just to run tests. For a task involving sensitive material, though, I would rather open a separate environment containing only the data needed for that task than keep adding permission exceptions on my everyday computer.

## Reading files, modifying files, and accessing the network are three different things

Take the same project. The compiler may need to read runtime libraries already installed outside the project, but it has no reason to modify those libraries. You can allow it to read the runtime libraries while allowing it to write only inside the project directory. **“It can only modify files in the project” does not mean “it cannot see any files outside the project.”** What it can read depends on the permission settings for that session.

Network access is controlled separately too. For example, if you turn off network access for the terminal, programs in that terminal cannot go online to download new dependencies, but they can still read locally installed libraries if they already have permission. When reviewing code, I give it permission only to read the source; when changing a feature, I then give it write access to the project directory. I put keys and business files the task does not need somewhere it cannot read.

Connected tools need separate attention. For example, the terminal may be unable to access GitHub, but if you connect Codex to a tool that can read GitHub issues, it may still see those issues through that tool. The original article discusses local MCP servers: by default, Codex does not start them in the same sandbox that restricts terminal commands. So when connecting a tool, you need to check separately which account it uses, what it can read or change, and whether it can send things on your behalf.

## When do I need to confirm personally?

If Codex is only changing code and running tests within the boundaries already set, there is no need to click confirm at every step. If it suddenly needs access to a new directory, needs to change an external system, or wants to send content out, that is when I need to stop and ask: Why is this step necessary? What exactly will it touch? Can it be completed with fewer permissions?

I find this article very helpful for designing agent workflows, so when designing locally, we also need to think through three things first: what this task needs to deliver, the minimum permissions needed to complete it normally, and which step requires a person to reassess. Think those through, then choose models and connect tools. That way, even if the model misunderstands the task, the set of things it can affect does not grow as a result.
