---
layout: post
title: "AI Chat Exporter - 把AI chat对话导入Obsidian"
date: 2026-02-26
categories: [Blog]
tags: [Obsidian, Chrome Extension, AI, 开源]
---

我个人有点不太喜欢把chat history留在这些AI的界面上，一是老觉得有隐私的问题，二是我现在所有的核心工作流，都围绕 Obsidian 展开，而且我更喜欢把筛选过的内容进行归档。

去Chrome商店搜了一下，把chat内容导出的这个插件还收费，其实这个功能也不复杂，结合AI一个小时就做了一个extension出来，[开源地址](https://github.com/stefanieZhao77/ai-chat-exporter)，也可以直接在[Chrome web store](https://chromewebstore.google.com/detail/ai-chat-exporter/hgolbmfcneobjdgmoejglalnpfokphig)下载。

使用也非常简单，插件安装后，会跳转到设置界面，如图所示：

![设置界面](https://raw.githubusercontent.com/stefanieZhao77/stefanieZhao77.github.io/main/assets/images/ai-chat-exporter-settings.png)

需要选择本地Obsidian的文件夹，选择子目录模板和文件名格式（建议使用默认的）。platform现在暂时只支持ChatGPT和Gemini，后续还会再扩展。所有下载的图片会归纳到选择的相对路径中，以便笔记进行引用。所有的chat数据都支持导出Metadata，包括模型、URL地址，对话数量等等。导出的对话会显示角色和时间戳，如果不需要都可以在设置中进行选择。

下载方式支持点击图标，悬浮按钮点击，以及右键。

这个插件适合那些希望保留聊天记录、整理 AI 思考过程、或者将对话作为写作素材的人。如果你经常和 AI 深度讨论，并希望建立自己的知识系统，这种结构化导出会节省大量时间。

而且我认为Obsidian是AI时代最好的笔记，它可以非常容易结合AI建立自己的本地知识库。而且通过建立一些skill，你可以用它来进行个人管理，项目管理，blog内容管理等等，譬如我现在就是通过skill一键分发blog到多个平台，这些后续我还会再详细分享。
