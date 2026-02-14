---
layout: post
title: "使用 CLI 编程，你需要一个更酷的 Terminal"
date: 2026-02-14
categories: [Blog]
tags: [CLI, Terminal, WezTerm, AI, Workflow]
---

> 工具的选择来是技术栈与开发流程共同决定的结果。

---

## IDE 时代正在发生结构性变化

过去十几年，主流开发模式是程序员手写代码的模式，IDE 是极其优秀的工具。
一个项目，一个窗口，一条主线。写代码 → 运行 → 调试 → 修复 → 再运行。
当 AI 开始真正参与开发，而不是只做补全工具时，协作结构发生了改变：不再只是依赖个人写代码，而是"人类 + AI 共同推进系统。
在看到 Claude Code 开发者 Boris Cherny的tips之后，他展示的不是一个更快的编辑器，而是一种不同的协作结构：
> AI 可以并行推进多个任务，而人类只在关键决策点介入。

以后的开发都会是人类和AI并行协作，那么工具也必须要适应协作的流程，CLI 反而更适合进行流程和调度的编排。问题不在计划，而在协作结构。工具，只是协作结构的外化。

---

## 02. 当开发开始并行，终端就需要成为更灵活的入口

我现在的工作模式：
- 同时开 3～4 个 worktree，进行不同release版本的开发
- 每个 worktree 跑不同 agent 流程：
    - 一部分在写实现
    - 一部分在补测试（TDD）
    - 一部分在重构
    - 一部分在 review
在多线程环境下，我的需求是：
- 快速创建一个新线程（新 tab）
- 给它命名（语义化）
- 丝滑切换
- 知道哪个线程需要 human-in-the-loop
- 让不同线程在视觉上隔离 

IDE 显然并不适合这样的工作模式。Boris Cherny提到团队里面使用Ghostty， 但是我的系统是 Windows，主要开发环境在 WSL，所以选择了WezTerm。

选择 WezTerm 的原因非常简单：
- Windows 原生支持
- 支持GPU加速
- Lua 可编程
- 可以完全自定义快捷键
- 支持系统通知
- 可以自定义多种主题

---

![WezTerm 配置截图](https://raw.githubusercontent.com/stefanieZhao77/stefanieZhao77.github.io/main/assets/images/wezterm-config.png)

## 03. 具体实现：.wezterm.lua 配置文件的定义

这个Terminal的设定非常简单，在`C:\Users\<user_name>`目录下面新建.wezterm.lua文件即可自定义你想要的模式（可以直接跟AI说你的需求，让它帮你写好就行）。
我现在的具体实现方式是：

1. 打开终端默认进入WSL开发环境。如果最近只有一个project在开发，也可以直接进入该文件夹。

```lua
config.default_prog = { 'wsl.exe', '--cd', '~' }
```

2. 多 worktree 最大的问题不是多，而是容易搞错。我定义的快捷键可以快速给每个 tab 命名：

```lua
{ key = 'R', mods = 'CTRL|SHIFT', action = wezterm.action.PromptInputLine {
  description = 'Tab Name:',
  action = wezterm.action_callback(function(window, pane, line)
    if line then window:active_tab():set_title(line) end
  end),
}}
```

3. 常用快捷键的定义：可以定义自己常用的快捷键，我用的比较多的是新开、关闭和重命名一个 tab 页，并且可以定义快捷键在各个 tab 页中快速切换，可以用 Ctrl+tab 来回切换，并且可以用 Alt+number 跳转到对应的 tab 页。

```lua
{ key = 'T', mods = 'CTRL|SHIFT', action = wezterm.action.SpawnCommandInNewTab { args = { 'wsl.exe', '--cd', '~' } } },
{ key = 'W', mods = 'CTRL|SHIFT', action = wezterm.action.CloseCurrentTab { confirm = false } },

{ key = 'Tab', mods = 'CTRL', action = wezterm.action.ActivateTabRelative(1) },
{ key = 'Tab', mods = 'CTRL|SHIFT', action = wezterm.action.ActivateTabRelative(-1) },

{ key = '1', mods = 'ALT', action = wezterm.action.ActivateTab(0) },
{ key = '2', mods = 'ALT', action = wezterm.action.ActivateTab(1) },
```

4. 随机背景色切换：是的，我就喜欢花里胡哨的东西。但它不只是好看，在多线程环境下，颜色是最简单的区分方式。我定义了一些主题和背景色，并且在每次打开 tab 页的时候随机选择一个：

```lua
local themes = {
  { bg = '#2a0a10', fg = '#ff0055' },
  { bg = '#2a1a0a', fg = '#ffae00' },
  { bg = '#2a2a0a', fg = '#ffe600' },
  { bg = '#0a2a10', fg = '#39ff14' },
  { bg = '#0a2a2a', fg = '#00ffff' },
  { bg = '#0a1a2a', fg = '#0088ff' },
  { bg = '#1a0a2a', fg = '#bd00ff' },
}
wezterm.on('update-status', function(window, pane)
  local current_tab = window:active_tab()
  local index = (current_tab:tab_id() % #themes) + 1
  local theme = themes[index]
  local overrides = window:get_config_overrides() or {}
  overrides.colors = {
    background = theme.bg,
    foreground = '#ffffff',
    cursor_bg = theme.fg,
    cursor_fg = '#000000',
    cursor_border = theme.fg,
    selection_bg = theme.fg,
    selection_fg = '#000000',
    scrollbar_thumb = theme.fg,
    split = theme.fg,
    tab_bar = { background = '#000000' },
  }
  window:set_config_overrides(overrides)
end)
```

5. 系统通知：打开 Windows 的 notification，中间需要我介入的时候就会提示我，完成后也可以提示我。

![系统通知截图](https://raw.githubusercontent.com/stefanieZhao77/stefanieZhao77.github.io/main/assets/images/wezterm-notification.png)

---

## 04. 终端只是第一步

现在所有的程序员应该都转换一下自己的思维模式，从一个"干活"的人转变成一个管理者的思维。要更多地去拆分业务，规划进度，把每一个单独 worktree 工作的 agent 当作你的一个员工来进行管理。多去思考如何给他们安排工作，规划进度，如何去更好地进行工程化，如何把你的经验和习惯进行抽象化让AI理解。

我会慢慢把我最近根据我的思路搭建的工作流分享给大家，terminal 只是第一步。
