---
layout: post
title: "Free! Using iFlow with Obsidian for Recording and Reviewing"
date: 2026-03-11
categories: [Blog]
tags: [iFlow, Obsidian, AI, Productivity, Journaling, Review]
linkedin: true
---

I previously shared two topics: one on how to use AI to assist with journaling, and another on how to use Templater, CustomJS, and other capabilities in Obsidian to connect daily, weekly, and monthly reports into a personal review workflow. Both work well individually, but in my actual usage, these two parts remained separate: the former felt more like an instant feedback tool, while the latter felt more like a structured organization framework. You could record, and you could review, but there was still a missing smooth connection channel between these two activities.

After reorganizing these two parts, I've discovered a simpler combination that naturally connects "daily recording" and "periodic reviewing" into a closed loop. The core idea isn't complicated: it combines the iFlow CLI, Obsidian's MCP, and custom skills I've created. Write whatever comes to mind into the daily report, just like chatting to write a diary on a webpage before—no need to write perfectly complete entries from the start, nor deliberately organize the structure; when enough records have accumulated, use skills to generate summaries, reflections, and let AI suggest improvements. This way, journaling becomes more than just "write it and forget it"—it continuously accumulates and flows into weekly reviews, monthly reviews, quarterly reviews, and even annual reviews. Below is a detailed introduction to my overall implementation approach.

## Core Components

| Component | Function |
| --------- | -------- |
| **iFlow CLI** | Invoke AI skills for content generation and analysis |
| **Templater** | Obsidian plugin supporting User Scripts to execute Node.js code |
| **QuickAdd** | Create command buttons to trigger review scripts |
| **Dataview** | Render interactive buttons in notes |
| **note-reviewer skill** | Custom skill responsible for analyzing notes and generating reviews |

## Creating the Skill

First, use skill-creator to create a review workflow based on your needs. Mine is called `note-reviewer`, which asks AI to generate three parts daily: first, key points of the day—a summary of what was mainly done today; second, thoughts and reflections—helping me review today's problems; and finally, mentor suggestions—providing new recommendations.

Other review content is automatically triggered when generating notes. For example, weekly reviews generate this week's achievements, this week's reflections, habit tracking analysis for the week, mentor's message, and next week's plan (this part is usually still written by me). The same format applies to monthly, quarterly, and annual reviews—monthly reviews just summarize from weekly reviews. You can control this granularity yourself. I didn't used to review this frequently before, but now that I use AI for reviewing, I make it more detailed. You can create different review dimensions according to your own needs.

## Embedding iFlow CLI into Templates

### Daily Report Template Settings

My daily report is mainly divided into three parts: Todo, Memo, and Trackers for recording some habits, plus a task list built with dataview. I write a bunch of fragmented diary content under Memo every day. Then under AI review, I created two buttons (requires CustomJS plugin), one to review today and one to review yesterday (because sometimes I read books or work out at night and haven't filled in tracker information, so I might review the next day—this is entirely personal habit). The daily report format is shown below:

![Daily Report Interface](https://i.imgur.com/H4Ga8cW.png)

These two buttons call a local JS file to open a PowerShell window and run iFlow with the corresponding prompt. This button and running script can be written by AI, or you can change it to your preferred method.

**Defining Buttons and Trigger Scripts**

I defined a JS file in the templates folder to call the iFlow CLI and specify a particular model to use the defined skill for reviewing. In QuickAdd's configuration, I added two choices: one to summarize today's daily report and one to summarize yesterday's daily report (yesterday's report just needs to change the date algorithm—you can write different JS scripts according to your requirements).

```javascript
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

function runToday() {
    // Get today's date
    const date = moment().format('YYYY-MM-DD');
    const year = moment().format('YYYY');
    const vaultPath = app.vault.adapter.basePath;
    const filePath = `Plans/${year}/${date}.md`;
    const fullPath = path.join(vaultPath, filePath);
    const model = 'kimi-k2.5';
    
    // Build the iFlow command
    const cmd = `npx iflow --model ${model} "Use note-reviewer skill to summarize daily report for ${date}"`;
    
    new Notice(`🚀 Generating AI summary for: ${date}, please wait...`, 5000);
    
    try {
        exec(cmd, {
            cwd: vaultPath,
            windowsHide: true,
            maxBuffer: 1024 * 1024 // 1MB buffer for large output
        }, (error, stdout, stderr) => {
            if (error) {
                console.error('Execution error:', error);
                new Notice(`❌ Generation failed: ${error.message}`, 5000);
                exec(`start powershell -NoExit -Command "${cmd}"`);
                return;
            }
            
            // Extract AI summary content (remove Execution Info section)
            let summary = stdout;
            const executionInfoIndex = summary.indexOf('<Execution Info>');
            if (executionInfoIndex !== -1) {
                summary = summary.substring(0, executionInfoIndex).trim();
            }
            
            // Read original file
            let content = '';
            try {
                content = fs.readFileSync(fullPath, 'utf8');
            } catch (e) {
                new Notice(`❌ Cannot read file: ${filePath}`, 5000);
                return;
            }
            
            // Insert summary after AI Summary section
            const aiSummaryMarker = '## AI Summary';
            const aiSummaryIndex = content.indexOf(aiSummaryMarker);
            
            if (aiSummaryIndex !== -1) {
                // Find the position of the next ## heading
                const nextSectionIndex = content.indexOf('\n## ', aiSummaryIndex + aiSummaryMarker.length);
                
                // Build new content
                const summarySection = `\n\n${summary}\n`;
                
                if (nextSectionIndex !== -1) {
                    // Insert between AI Summary and next section
                    content = content.substring(0, nextSectionIndex) +
                              summarySection +
                              content.substring(nextSectionIndex);
                } else {
                    // Insert at end of file
                    content = content + summarySection;
                }
                
                // Write back to file
                fs.writeFileSync(fullPath, content);
                new Notice(`✅ AI summary written to: ${filePath}`, 5000);
            } else {
                // If no AI Summary section exists, add to end of file
                content = content + '\n\n## AI Summary\n\n' + summary;
                fs.writeFileSync(fullPath, content);
                new Notice(`✅ AI summary written to: ${filePath}`, 5000);
            }
        });
    } catch (error) {
        console.error('Caught error:', error);
        new Notice(`❌ Launch failed: ${error.message}`, 5000);
    }
}

module.exports = runToday;
```

When defining buttons, you can directly call QuickAdd, or press ctrl+p to directly select these two commands.

```js
const container = dv.el('div', '', { attr: { style: 'margin: 10px 0;' } });

const executeQuickAdd = (choiceId) => {
  const commandId = `quickadd:choice:${choiceId}`;
  if (app.commands.commands[commandId]) {
    app.commands.executeCommandById(commandId);
  }
};

const todayBtn = dv.el('button', '📝 Summarize Today', {
  attr: {
    style: 'padding:10px 20px;background:#4CAF50;color:white;border:none;border-radius:6px;cursor:pointer;margin-right:10px;font-size:14px;'
  }
});
todayBtn.onclick = () => executeQuickAdd('summarize-today');

const yesterdayBtn = dv.el('button', '📅 Summarize Yesterday', {
  attr: {
    style: 'padding:10px 20px;background:#2196F3;color:white;border:none;border-radius:6px;cursor:pointer;font-size:14px;'
  }
});
yesterdayBtn.onclick = () => executeQuickAdd('summarize-yesterday');

container.appendChild(todayBtn);
container.appendChild(yesterdayBtn);
dv.container.appendChild(container);
```

### Periodic Review Triggers

The only parts I manually fill in are the daily reports and next week's tasks in the weekly review. So periodic review content is automatically triggered when creating the review file through Templater.

Add the following code in the Weekly Note Template and trigger it through the defined weekly_review.js script (the line `tp.user.weekly_review`).

```markdown
<%*
const currentWeek = tp.date.now('YYYY-[W]WW');
const year = tp.date.now('YYYY');
const weekFile = `Plans/${year}/${currentWeek}.md`;

// Automatically trigger weekly review
const result = tp.user.weekly_review(weekFile);
tR += result;
%>
```

**`weekly_review.js`**

```javascript
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

function generateWeeklyReview(weekFile) {
    const vaultPath = app.vault.adapter.basePath;
    const fullPath = path.join(vaultPath, weekFile);
    
    // Create basic framework...
    
    // Call AI skill
    const iflowPath = 'C:\\Users\\<user_name>\\AppData\\Roaming\\npm\\iflow.ps1';
    const command = `start powershell -ExecutionPolicy Bypass -Command "& '${iflowPath}' 'Use note-reviewer to generate weekly review, file path is ${weekFile}'"`;
    
    exec(command, { cwd: vaultPath, windowsHide: false });
    
    return `✅ Weekly review file created, AI generating...`;
}

module.exports = generateWeeklyReview;
```

Other periodic reviews follow the same pattern.

In addition to AI review content, I also use dataview to count tracker completion and duration for each week.

**`tracker dataview`**

```js
TABLE WITHOUT ID
	file.link AS "Day",
	hours AS "💻 Work",
	workout AS "💪 Workout",
	reading AS "📚 Reading",
	meditation AS "💭 Meditation"
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

// Calculate this Monday and Sunday
const today = moment();
const dayOfWeek = today.day(); // 0=Sunday, 1=Monday...
const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
const startOfWeek = today.clone().subtract(daysToMonday, 'days').startOf('day');
const endOfWeek = startOfWeek.clone().add(6, 'days').endOf('day');

// Generate dates for this week (7 days)
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

dv.paragraph(`**Work Hours**: ${totalWork.toFixed(1)} hours (over ${dayCount} days)`);
dv.paragraph(`**Workout**: ${Math.floor(totalWorkout/60)} hours ${totalWorkout%60} minutes`);
dv.paragraph(`**Reading**: ${Math.floor(totalReading/60)} hours ${totalReading%60} minutes`);
dv.paragraph(`**Meditation**: ${meditationCount} days`);
```

## AI is Not the Spinning Jenny

I really like this solution, and an important reason is that it doesn't just solve the problem of "writing" or "summarizing"—it manages the personal behavior process. Before, reviewing felt like an additional task that took up my own rest time. Previously, combining AI with chat to write a diary really helped me develop good recording habits, leaving many natural and authentic behavior and thought traces, but chat memory is limited. Using notes for persistent storage is the best choice for me.

Moreover, I think the most valuable aspect of this combination is that its customizability runs through the entire chain. The recording entry point can be customized—you can decide what the daily report looks like, where buttons are placed, and what the trigger method is; AI's feedback logic can be customized—you can make diary feedback, weekly review, and monthly summary into different skills; data organization can also be customized—you can decide how daily reports aggregate into weekly reports, how weekly reports further enter monthly reports, and what the review priorities are at different levels. It doesn't make you adapt to a ready-made tool's fixed structure—it allows you to design the system according to your own behavior management logic.

I always see people comparing AI to the spinning jenny from the Industrial Revolution, but it's really different. Machinery has a standard process—everyone operates according to that process, and the results are the same. But AI isn't like that. AI is a more flexible tool. As I've said before, before using it, you should at least clarify your own daily workflow, and then you can find a more suitable way to use it. Whether it's a single agent or raising a "lobster" (complex AI system), the most important thing is knowing what to do, not which tool to use.
