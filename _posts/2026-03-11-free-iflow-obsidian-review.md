---
layout: post
title: "免费！用iFlow结合Obsidian记录和复盘"
date: 2026-03-11
categories: [Blog]
tags: [iFlow, Obsidian, AI, 生产力, 日记, 复盘]
---

之前我分享过两个内容：一是怎么用 AI 来辅助写日记，另一类是怎么在 Obsidian 里借助 Templater、CustomJS 这些能力，把日报、周报、月报串起来，做成一套自己的复盘流程。它们各自都很好用，但过去在我的实际使用里，这两部分始终是分开的：前者更像一个即时反馈工具，后者更像一个结构化整理框架。你可以记录，也可以复盘，但这两件事之间还是缺了一条真正顺滑的连接通道。

我把这两部分重新整理了一下，发现现在其实已经有一种更简单的组合方式，可以把"日常记录"和"阶段复盘"自然串成一个闭环。核心思路并不复杂，就是把 iflow CLI、Obsidian 的 MCP、以及我自己创建的 skill 结合起来使用。每天想到什么就先随手写进日报，就像之前在网页中通过chat的方式写日记一样，不需要一开始就写得特别完整，也不需要刻意整理结构；当记录积累到一定程度之后，再通过 skill 去做总结，思考与感悟，并且让AI提出一些改进的建议。这样一来，日记不再只是"写过就算了"的东西，而是会持续积累，进入周复盘、月复盘、季度复盘，甚至年复盘。下面就详细介绍一下我整体的实现思路。

## 核心组件

| 组件 | 作用 |
| ---- | ---- |
| **iFlow CLI** | 调用 AI skill 进行内容生成和分析 |
| **Templater** | Obsidian 插件，支持 User Scripts 执行 Node.js 代码 |
| **QuickAdd** | 创建命令按钮，触发复盘脚本 |
| **Dataview** | 在笔记中渲染交互按钮 |
| **note-reviewer skill** | 自定义 skill，负责分析笔记并生成复盘 |

## 创建Skill

首先是利用skill-creator根据自己的需求来创建一个复盘的流程。我的就是叫`note-reviewer`，要求AI每天给我生成三个部分，一个是今日要点，就是今天主要做的事情的梳理和总结，一个是思考与感悟，就是帮助我复盘今天的问题，最后是导师建议，就是给我提出一些新的建议。

其他的复盘内容都是在生成笔记的时候自动触发的，譬如周复盘的会生成本周成就，本周思考，这周的习惯追踪分析，导师的寄语，以及下周的计划（这个部分一般还是我自己写）。同样的格式也应用到月复盘、季度复盘和年复盘上，只是月复盘是从周复盘中再总结。这个颗粒度可以自己把控，以前我自己是不会复盘这么勤快的，但是现在用AI来复盘了，就弄得比较细了。这个部分大家可以根据自己的需要来创建不同的复盘维度。

## 将iflow cli嵌入到Template

### 日报的template设置

我的日报里面主要分为三个部分，一个是Todo， 一个是Memo，还有就是一个Trackers用来记录我一些习惯，以及我用dataview构建的代办task的列表。我每天会把一堆碎碎念的日记内容写到Memo下面。然后在AI review下面用创建了两个按钮（需要用CustomJS插件），一个是复盘今天，一个是复盘昨天（因为有时候晚上看书或者健身了，就没回填tracker的信息，所以可能会在第二天复盘，这个就完全是个人习惯了），日报的格式如下图所示：

![日报界面](https://raw.githubusercontent.com/stefanieZhao77/stefanieZhao77.github.io/main/assets/images/daily-report-interface-2026-03-11.png)

这两个按钮的调用方式是使用本地的js文件打开powershell的窗口运行iflow以及对应的prompt。这个按钮以及运行脚本可以让AI帮忙写一下，也可以改成自己喜欢的方式。

**定义按钮以及触发脚本**

我是在笔记templates的文件夹里面定义了一个js文件，用于调用iflow cli并且指定特定的model使用定义的skill来进行复盘。在QuickAdd的配置里面增加两个choice，一个是总结今日日报，一个是总结昨日日报（昨日日报只需要更改date的算法即可，可以根据自己的要求写不同的JS脚本）。

```javascript
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

function runToday() {
    // 获取当前日期
    const date = moment().format('YYYY-MM-DD');
    const year = moment().format('YYYY');
    const vaultPath = app.vault.adapter.basePath;
    const filePath = `Plans/${year}/${date}.md`;
    const fullPath = path.join(vaultPath, filePath);
    const model = 'kimi-k2.5';
    
    // 构建iflow命令
    const cmd = `npx iflow --model ${model} "使用note-reviewer skill总结${date}的日报"`;
    
    new Notice(`正在生成 AI 总结: ${date}，请稍候...`, 5000);
    
    try {
        exec(cmd, {
            cwd: vaultPath,
            windowsHide: true,
            maxBuffer: 1024 * 1024 // 1MB buffer for large output
        }, (error, stdout, stderr) => {
            if (error) {
                console.error('执行错误:', error);
                new Notice(`生成失败: ${error.message}`, 5000);
                exec(`start powershell -NoExit -Command "${cmd}"`);
                return;
            }
            
            // 提取 AI 总结内容（去掉 Execution Info 部分）
            let summary = stdout;
            const executionInfoIndex = summary.indexOf('<Execution Info>');
            if (executionInfoIndex !== -1) {
                summary = summary.substring(0, executionInfoIndex).trim();
            }
            
            // 读取原文件
            let content = '';
            try {
                content = fs.readFileSync(fullPath, 'utf8');
            } catch (e) {
                new Notice(`无法读取文件: ${filePath}`, 5000);
                return;
            }
            
            // 在 AI Summary 部分后插入总结
            const aiSummaryMarker = '## AI Summary';
            const aiSummaryIndex = content.indexOf(aiSummaryMarker);
            
            if (aiSummaryIndex !== -1) {
                // 找到下一个 ## 标题的位置
                const nextSectionIndex = content.indexOf('\n## ', aiSummaryIndex + aiSummaryMarker.length);
                
                // 构建新的内容
                const summarySection = `\n\n${summary}\n`;
                
                if (nextSectionIndex !== -1) {
                    // 在 AI Summary 和下一个部分之间插入
                    content = content.substring(0, nextSectionIndex) +
                              summarySection +
                              content.substring(nextSectionIndex);
                } else {
                    // 在文件末尾插入
                    content = content + summarySection;
                }
                
                // 写回文件
                fs.writeFileSync(fullPath, content);
                new Notice(`AI 总结已写入: ${filePath}`, 5000);
            } else {
                // 如果没有 AI Summary 部分，添加到文件末尾
                content = content + '\n\n## AI Summary\n\n' + summary;
                fs.writeFileSync(fullPath, content);
                new Notice(`AI 总结已写入: ${filePath}`, 5000);
            }
        });
    } catch (error) {
        console.error('捕获错误:', error);
        new Notice(`启动失败: ${error.message}`, 5000);
    }
}

module.exports = runToday;
```

定义button的时候就可以直接调用QuickAdd，或者可以ctrl+p直接选择这两个命令。

```js
const container = dv.el('div', '', { attr: { style: 'margin: 10px 0;' } });

const executeQuickAdd = (choiceId) => {
  const commandId = `quickadd:choice:${choiceId}`;
  if (app.commands.commands[commandId]) {
    app.commands.executeCommandById(commandId);
  }
};

const todayBtn = dv.el('button', '总结今天', {
  attr: {
    style: 'padding:10px 20px;background:#4CAF50;color:white;border:none;border-radius:6px;cursor:pointer;margin-right:10px;font-size:14px;'
  }
});
todayBtn.onclick = () => executeQuickAdd('summarize-today');

const yesterdayBtn = dv.el('button', '总结昨天', {
  attr: {
    style: 'padding:10px 20px;background:#2196F3;color:white;border:none;border-radius:6px;cursor:pointer;font-size:14px;'
  }
});
yesterdayBtn.onclick = () => executeQuickAdd('summarize-yesterday');

container.appendChild(todayBtn);
container.appendChild(yesterdayBtn);
dv.container.appendChild(container);
```

### 周期性复盘触发

我自己手动填写的部分只有每天的日报，以及周报中下周的任务。所以周期性复盘的内容都是在创建复盘文件的时候通过templator自动触发的。

在创建的Weekly Note Template里面增加如下代码，并通过定义的weekly_review.js脚本来触发（就是tp.user.weekly_review这行代码）。

```markdown
<%*
const currentWeek = tp.date.now('YYYY-[W]WW');
const year = tp.date.now('YYYY');
const weekFile = `Plans/${year}/${currentWeek}.md`;

// 自动触发周复盘
const result = tp.user.weekly_review(weekFile);
tR += result;
%>
```

**weekly_review.js**

```javascript
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

function generateWeeklyReview(weekFile) {
    const vaultPath = app.vault.adapter.basePath;
    const fullPath = path.join(vaultPath, weekFile);
    
    // 创建基础框架...
    
    // 调用 AI skill
    const iflowPath = 'C:\\Users\\<user_name>\\AppData\\Roaming\\npm\\iflow.ps1';
    const command = `start powershell -ExecutionPolicy Bypass -Command "& '${iflowPath}' '用note-reviewer 生成周复盘，文件路径是${weekFile}'"`;
    
    exec(command, { cwd: vaultPath, windowsHide: false });
    
    return `周复盘文件已创建，AI 生成中...`;
}

module.exports = generateWeeklyReview;
```

其它的周期性复盘同理。

除了AI的复盘内容，我还用dataview来统计每周的tracker的完成情况，以及时长。

**tracker dataview**

```js
TABLE WITHOUT ID
	file.link AS "Day",
	hours AS "工作",
	workout AS "运动",
	reading AS "阅读",
	meditation AS "冥想"
FROM "Plans/<% tp.date.now('YYYY') %>"
WHERE file.day >= date("<% tp.date.now('YYYY-MM-DD', - (tp.date.now('d') - 1)) %>") 
  AND file.day <= date("<% tp.date.now('YYYY-MM-DD', 6 - (tp.date.now('d') - 1)) %>")
FLATTEN row["Hours Worked"] AS hours
FLATTEN row["Workout"] AS workout
FLATTEN row["Reading"] AS reading  
FLATTEN row["Meditation"] AS meditation
SORT file.day ASC
```

```js
const year = "<% tp.date.now('YYYY') %>";

// 计算本周一和周日
const today = moment();
const dayOfWeek = today.day(); // 0=周日, 1=周一...
const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
const startOfWeek = today.clone().subtract(daysToMonday, 'days').startOf('day');
const endOfWeek = startOfWeek.clone().add(6, 'days').endOf('day');

// 生成本周7天的日期
const weekDates = [];
for (let i = 0; i < 7; i++) {
  weekDates.push(startOfWeek.clone().add(i, 'days').format('YYYY-MM-DD'));
}

let totalWork = 0;
let totalWorkout = 0;
let totalReading = 0;
let meditationCount = 0;
let dayCount = 0;

weekDates.forEach(dateStr => {
  const page = dv.page(`Plans/${year}/${dateStr}`);
  if (page) {
    dayCount++;
    
    const hw = page["Hours Worked"];
    const wo = page["Workout"];
    const rd = page["Reading"];
    const md = page["Meditation"];
    
    if (hw) {
      const workStr = String(hw);
      const match = workStr.match(/([0-9.]+)/);
      if (match) totalWork += parseFloat(match[1]);
    }
    
    if (wo) {
      const str = String(wo);
      const match = str.match(/([0-9.]+)/);
      if (match) {
        let val = parseFloat(match[1]);
        if (str.includes('h')) val *= 60;
        totalWorkout += val;
      }
    }
    
    if (rd) {
      const str = String(rd);
      const match = str.match(/([0-9.]+)/);
      if (match) {
        let val = parseFloat(match[1]);
        if (str.includes('h')) val *= 60;
        totalReading += val;
      }
    }
    
    if (md && String(md).trim() !== '' && String(md) !== '0') {
      meditationCount++;
    }
  }
});

dv.paragraph(`**工作时长**: ${totalWork.toFixed(1)} 小时 (共 ${dayCount} 天)`);
dv.paragraph(`**运动**: ${Math.floor(totalWorkout/60)}小时 ${totalWorkout%60}分钟`);
dv.paragraph(`**阅读**: ${Math.floor(totalReading/60)}小时 ${totalReading%60}分钟`);
dv.paragraph(`**冥想**: ${meditationCount} 天`);
```

## AI不是珍妮纺织机

我很喜欢这套方案，一个很重要的原因是，它不是单独解决"写"或者"总结"的问题，而是在管理个人的行为过程。以前会把复盘对我来说是一种额外任务，还需要占用我自己的休息时间总结。之前在chat中结合AI写日记，真的让我养成了良好的记录习惯，留下了很多自然、真实的行为和思考痕迹，但是chat的记忆又是有限的。用笔记来做持久化的存储，对我来说就是最好的选择了。

而且我觉得这套组合最有价值的地方，在于它的可自定义贯穿了整个链路。记录入口可以自定义，你可以决定日报长什么样、按钮放在哪里、触发方式是什么；AI 的反馈逻辑可以自定义，你可以把自己的日记反馈、周报复盘、月度总结分别做成不同的 skill；数据组织方式也可以自定义，你可以决定日报如何汇总到周报，周报如何进一步进入月报，以及不同层级的复盘重点分别是什么。它不是让你去适应一个现成工具的固定结构，而是允许你按自己的行为管理逻辑反过来设计系统。

我看总有人把AI类比成工业革命时期的珍妮纺织机，但是真的不一样。机械是有一套标准流程的，所有人按照那个流程操作，得出来的结果都是一样的。但是AI不是的，AI是一个更灵活的工具，就像我之前说过的，在使用之前，至少要把自己日常的工作流程捋清楚，然后才能找到更适合的使用方式。不管是单一的agent还是养个龙虾，最重要的是知道要做什么，而不是用哪个工具。
