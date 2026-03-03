---
layout: post
title: "使用 Obsidian 进行开发项目管理"
date: 2026-03-03
categories: [Blog]
tags: [Obsidian, 项目管理, GitHub, AI, 开发流程]
---

![工作流程图](https://raw.githubusercontent.com/stefanieZhao77/stefanieZhao77.github.io/main/assets/images/obsidian-project-management-2026-03-03.png)
我现有的开发流程如图所示（该图由 AI + Excalidraw MCP 自动生成，我做了少量格式调整）。这个流程完全基于我个人的工作习惯设计。
根据这个流程，我可以同时同步多个 worktree 进行开发，每一个 worktree 对应不同的 release 内容。这也是我之前文章里提到为什么需要一个好用的 terminal —— 我必须非常清晰地看到每一个 tab 在处理什么任务，并且能够在不同版本之间快速切换，查看完成情况。
我习惯把个人计划和项目开发统一在 Obsidian 中管理，同时结合 AI 做复盘。这篇文章主要讲第一部分：如何在 Obsidian 中统一管理 Release、Feature 与 Bug，并将它们结构化后提交到 GitHub Issue，同时支持多个项目

---
## 多项目支持

我同时维护多个项目，因此在 Obsidian 中建立了一个 `Projects` 文件夹，用来管理所有项目。
每一个项目都是一个独立文件夹，里面包含完整知识库：从 idea 到架构设计，从技术选型到每个版本的演进逻辑。我希望一个项目的所有思考都沉淀在本地。
在每一个模板中，我会维护对应的 repository 和 branch 信息，例如：
```yaml
name: my_project  
github_url: https://github.com/xxx/my_project  
default_branch: main
```

## 三个对象模板

我维护了这三个对象的模板：Bug 是技术问题，强调复现路径与环境信息；Feature 是功能设计，强调目标与约束；Release 是聚合，定义一个阶段的范围与目标。它们之间通过双向链接形成结构关系。
### Bug模板：

Metadata设计如下：
```yaml
type: bug  
id: 20260303114225  
title:  
created: 2026-03-03 11:42  
updated: 2026-03-03 11:42   
status: Backlog  
priority: P2  
severity: medium # low | medium | high | critical  
release:  
components: []  
github_issue: 
github_url: 
default_branch:
tags: [bug]
```
`type` 用于类型识别； 
`id` 作为唯一标识，避免重名问题；  
`status` 一般默认是Backlog，其余状态在issue中管理和更改；  
`priority` 和 `severity` 分别代表业务优先级与技术严重程度；  
`release` 用来绑定版本；  
`components` 用来标记涉及模块，控制AI修改的范围；  
`github_issue` 是创建后回填issue的编号；
`github_url` && `default_branch` 是用来控制项目；
`tags` 是为了obsidian中的统计和管理。

正文内容主要有五个方面：
1. Description：问题的简要描述
2. Steps to Reproduce：复现问题的步骤和方法
3. Expected Behavior：预期的正常结果和表现应该是什么
4. Environment：开发，测试，生产，哪个环境的问题
5. Logs：报错日志信息

### Feature模板

Metadata设计如下：
```yaml
type: feature  
id: 20260303114225  
title:  
created: 2026-03-03 11:42  
updated: 2026-03-03 11:42   
status: Backlog  
priority: P2  
severity: medium # low | medium | high | critical  
release:  
components: []  
github_issue: 
github_url: 
default_branch:
tags: [feature]  
related_bug:
```
和bug的设计基本一致，唯一增加的是`related_bug` ，因为有一些feature是从bug上延伸出来的（譬如需要增加验证或者边界条件等等），所以需要追踪是关联的哪个bug。

正文内容主要有六个方面：
1. Summary：总结这个feature需要做的功能
2. Description：需要详细描述这个feature的context，包括可能涉及到的改动，原因等等
3. Proposed Solution：实现路径描述，可能需要修改的部分和功能
4. Constraints: 约束这个看具体的feature内容，譬如多并发的场景，数据访问的约束，以及兼容性，是否需要回退或者托底机制等等
5. Test: 需要增加的测试内容
6. Example: 这块我一般就是按照测试用例的思路写

### Release模板

Metadata设计如下：
```yaml
type: release  
version: v0.3.0  
created: 2026-03-03 11:42   
updated: 2026-03-03 11:42  
status: Backlog  
github_release:  
github_url:
default_branch:  
```
Release这个主要就是管理版本和阶段目标，以及feature和bug的集合。通过双向链接把这一个版本中需要完成feature和bug进行关联。

正文内容主要有六个部分：
1. Goal：定义这个版本真正想解决什么问题。我个人的习惯是会把某一个模块或者某一类的问题归类放到release版本中。因为这样可以更好地控制AI的修改范围，譬如这一个release只修改前端的问题，或者只修改譬如登录模块的问题和功能
2. Scope：定义修改的边界。这个就是归类的好处，可以给AI更清晰地划分它的修改范围
3. Included Features && Fixed Bugs：通过双链链接到定义的bug或者feature
4. Test Plan：这个要考虑的是一个整体的回归测试，在提交PR的时候需要测试通过
5. Release Notes：这个是留给我自己的备忘录

## 设计思路

我还是希望可以对我整个项目进行总体把控的，所以每次写这些内容的时候，其实都是要求我个人对项目的改动复盘，了解每部分的代码具体的实现逻辑和方式，这样才能更好地规范改动的方式。
在与 AI 协作的时代，开发人员更多地担任的就是一个任务编排的工作，怎么样合理的拆分和规划每一个版本需要开发的任务是一个很重要的课题。通过本地的笔记，可以记录我整体的思考流程，后续也可以使用AI对整个流程的规划进行复盘，以便我可以在这个过程中思考更优化的编排思路。Obsidian也支持很多的插件，可以很容易地对这些内容进行统计和可视化。
其实也可以通过直接读取本地Obsidian的方式进行开发，但因为我有在使用Codex的code review功能，所以目前仍然需要走 GitHub 流程。因此现在issue的template需要和笔记定义的template的格式一致，PR的时候codex会把review的内容写到issue里面。
当然这只是我自己的开发流程，仅供参考，只是提供大家一个思路，就如我之前的文章里面说的，要去思考怎么把自己的工作流程封装好，跟AI更好地结合。
自动化不是整个流程的关键，而是认知方式。认知永远先于工具存在。
