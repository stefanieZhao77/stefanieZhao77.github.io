// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-blog",
          title: "blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-publications",
          title: "publications",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-projects",
          title: "projects",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "nav-gallery",
          title: "gallery",
          description: "Some of the photos I took during my travels.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/gallery/";
          },
        },{id: "nav-repositories",
          title: "repositories",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/repositories/";
          },
        },{id: "post-测试-测试-还是测试",
      
        title: "测试，测试，还是测试",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/testing-testing-more/";
        
      },
    },{id: "post-testing-testing-and-more-testing-a-four-tier-strategy-for-agent-workflows",
      
        title: "Testing, Testing, and More Testing: A Four-Tier Strategy for Agent Workflows",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/four-tier-testing-strategy-for-agent-en/";
        
      },
    },{id: "post-four-tier-testing-en",
      
        title: "Four Tier Testing En",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/four-tier-testing-en/";
        
      },
    },{id: "post-从notebook-navigator-聊聊ai时代设计的重要性",
      
        title: "从Notebook Navigator 聊聊AI时代设计的重要性",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/notebook-navigator-ai/";
        
      },
    },{id: "post-beyond-notebook-navigator-why-tool-design-matters-more-than-ever-in-the-ai-era",
      
        title: "Beyond Notebook Navigator: Why Tool Design Matters More Than Ever in the AI...",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/notebook-navigator-ai-era-en/";
        
      },
    },{id: "post-从-openclaw-的接入方式-看通信模型的选择逻辑",
      
        title: "从 OpenClaw 的接入方式，看通信模型的选择逻辑",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/openclaw-communication-models/";
        
      },
    },{id: "post-understanding-communication-model-choices-through-openclaw-39-s-integration-approaches",
      
        title: "Understanding Communication Model Choices Through OpenClaw&#39;s Integration Approaches",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/openclaw-communication-models-en/";
        
      },
    },{id: "post-ai-时代-如何保护你的大脑",
      
        title: "AI 时代，如何保护你的大脑",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/protecting-your-brain-ai-era/";
        
      },
    },{id: "post-protecting-your-brain-in-the-ai-era",
      
        title: "Protecting Your Brain in the AI Era",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/protecting-your-brain-ai-era-en/";
        
      },
    },{id: "post-how-i-achieved-parallel-multi-task-development-with-git-worktree-skills",
      
        title: "How I Achieved Parallel Multi-Task Development with Git Worktree + Skills",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/parallel-multi-task-development-git-worktree-skills-en/";
        
      },
    },{id: "post-managing-development-projects-with-obsidian",
      
        title: "Managing Development Projects with Obsidian",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/managing-development-projects-with-obsidian-en/";
        
      },
    },{id: "post-harness-当-ai-agent-进入工程体系之后",
      
        title: "Harness：当 AI Agent 进入工程体系之后",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/harness-ai-agent-engineering/";
        
      },
    },{id: "post-harness-when-ai-agents-enter-the-engineering-system",
      
        title: "Harness: When AI Agents Enter the Engineering System",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/harness-ai-agent-engineering-en/";
        
      },
    },{id: "post-创造力不是人类的护城河",
      
        title: "创造力不是人类的护城河",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/creativity-is-not-humanitys-moat/";
        
      },
    },{id: "post-creativity-is-not-humanity-39-s-moat",
      
        title: "Creativity Is Not Humanity&#39;s Moat",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/creativity-is-not-humanitys-moat-en/";
        
      },
    },{id: "post-我是如何用-git-worktree-skill-实现多任务并行开发的",
      
        title: "我是如何用 Git Worktree + Skill 实现多任务并行开发的",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/%E6%88%91%E6%98%AF%E5%A6%82%E4%BD%95%E7%94%A8-git-worktree-skill-%E5%AE%9E%E7%8E%B0%E5%A4%9A%E4%BB%BB%E5%8A%A1%E5%B9%B6%E8%A1%8C%E5%BC%80%E5%8F%91%E7%9A%84/";
        
      },
    },{id: "post-when-ai-becomes-the-entry-point-geo-and-control",
      
        title: "When AI Becomes the Entry Point: GEO and Control",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/ai-geo-control-en/";
        
      },
    },{id: "post-当-ai-成为入口-geo与控制权",
      
        title: "当 AI 成为入口：GEO与控制权",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/ai-geo-control-cn/";
        
      },
    },{id: "post-真正面向agent的软件应该怎么设计",
      
        title: "真正面向Agent的软件应该怎么设计？",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/agent-native-software-design/";
        
      },
    },{id: "post-how-should-agent-native-software-be-designed",
      
        title: "How Should Agent-Native Software Be Designed?",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/agent-native-software-design-en/";
        
      },
    },{id: "post-免费-用iflow结合obsidian记录和复盘",
      
        title: "免费！用iFlow结合Obsidian记录和复盘",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/free-iflow-obsidian-review/";
        
      },
    },{id: "post-free-using-iflow-with-obsidian-for-recording-and-reviewing",
      
        title: "Free! Using iFlow with Obsidian for Recording and Reviewing",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/free-iflow-obsidian-review-en/";
        
      },
    },{id: "post-使用-obsidian-进行开发项目管理",
      
        title: "使用 Obsidian 进行开发项目管理",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/obsidian-project-management/";
        
      },
    },{id: "post-ai-在-c-端落地-与互联网时代相比-还缺什么条件",
      
        title: "AI 在 C 端落地：与互联网时代相比，还缺什么条件？",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/ai-consumer-landing/";
        
      },
    },{id: "post-ai-in-consumer-market-what-39-s-missing-compared-to-the-internet-era",
      
        title: "AI in Consumer Market: What&#39;s Missing Compared to the Internet Era?",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/ai-consumer-landing-en/";
        
      },
    },{id: "post-ai-chat-exporter-把ai-chat对话导入obsidian",
      
        title: "AI Chat Exporter - 把AI chat对话导入Obsidian",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/ai-chat-exporter-obsidian/";
        
      },
    },{id: "post-ai-chat-exporter-import-ai-chat-conversations-to-obsidian",
      
        title: "AI Chat Exporter - Import AI Chat Conversations to Obsidian",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/ai-chat-exporter-obsidian-en/";
        
      },
    },{id: "post-转ai-agent开发之前-先尝试把自己的工作流程理顺",
      
        title: "转AI agent开发之前，先尝试把自己的工作流程理顺",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/before-ai-agent-development-streamline-your-workflow/";
        
      },
    },{id: "post-before-diving-into-ai-agent-development-start-by-streamlining-your-workflow",
      
        title: "Before Diving into AI Agent Development: Start by Streamlining Your Workflow",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/before-ai-agent-development-streamline-your-workflow-en/";
        
      },
    },{id: "post-使用-cli-编程-你需要一个更酷的-terminal",
      
        title: "使用 CLI 编程，你需要一个更酷的 Terminal",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/cli-terminal-wezterm/";
        
      },
    },{id: "post-programming-with-cli-you-need-a-cooler-terminal",
      
        title: "Programming with CLI: You Need a Cooler Terminal",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2026/cli-terminal-wezterm-en/";
        
      },
    },{id: "post-legal-mock-exam-generation-by-thinking-with-llm",
      
        title: 'Legal Mock Exam Generation by Thinking with LLM <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.open("https://medium.com/@stefaniezhao414/legal-mock-exam-generation-by-thinking-with-llm-2360829feb9b?source=rss-138ac7d61c06------2", "_blank");
        
      },
    },{id: "post-overcome-modern-distractions-with-a-smarter-productivity-tool",
      
        title: 'Overcome Modern Distractions with a Smarter Productivity Tool <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.open("https://medium.com/@stefaniezhao414/overcome-modern-distractions-with-a-smarter-productivity-tool-c71759de462f?source=rss-138ac7d61c06------2", "_blank");
        
      },
    },{id: "post-converting-a-step-file-to-mujoco-xml-for-physics-simulation-a-practical-guide",
      
        title: 'Converting a STEP File to MuJoCo XML for Physics Simulation: A Practical Guide... <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.open("https://medium.com/@stefaniezhao414/converting-a-step-file-to-mujoco-xml-for-physics-simulation-a-practical-guide-e034ce617c55?source=rss-138ac7d61c06------2", "_blank");
        
      },
    },{id: "post-no-planning-no-execution-how-to-plan-a-perfect-week",
      
        title: 'No planning, no execution — How to plan a perfect week <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.open("https://medium.com/@stefaniezhao414/no-planning-no-execution-how-to-plan-a-perfect-week-041e9b1698b2?source=rss-138ac7d61c06------2", "_blank");
        
      },
    },{id: "post-beyond-the-code-the-design-of-the-id-anonymization-tool",
      
        title: "Beyond the Code: The Design of the ID Anonymization Tool",
      
      description: "",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/id-anonymization-tool/";
        
      },
    },{id: "books-the-godfather",
          title: 'The Godfather',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the_godfather/";
            },},{id: "news-a-simple-inline-announcement",
          title: 'A simple inline announcement.',
          description: "",
          section: "News",},{id: "news-a-long-announcement-with-details",
          title: 'A long announcement with details',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/announcement_2/";
            },},{id: "news-a-simple-inline-announcement-with-markdown-emoji-sparkles-smile",
          title: 'A simple inline announcement with Markdown emoji! :sparkles: :smile:',
          description: "",
          section: "News",},{id: "projects-digiphenoms",
          title: 'DigiPhenoms',
          description: "",
          section: "Projects",handler: () => {
              window.location.href = "/projects/DigiPhenoms/";
            },},{id: "projects-an-ai-assistant-for-task-management",
          title: 'An AI Assistant for Task Management',
          description: "",
          section: "Projects",handler: () => {
              window.location.href = "/projects/IntelliTask/";
            },},{id: "projects-software-defined-mobile-supply-chain",
          title: 'Software-defined mobile supply chain',
          description: "",
          section: "Projects",handler: () => {
              window.location.href = "/projects/Software-defined%20mobile%20supply%20chain%20copy/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%73%74%65%66%61%6E%69%65%7A%68%61%6F%34%31%34@%67%6D%61%69%6C.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/stefanieZhao77", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/stefaniezhao", "_blank");
        },
      },{
        id: 'social-orcid',
        title: 'ORCID',
        section: 'Socials',
        handler: () => {
          window.open("https://orcid.org/0000-0001-5357-2748", "_blank");
        },
      },{
        id: 'social-rss',
        title: 'RSS Feed',
        section: 'Socials',
        handler: () => {
          window.open("/feed.xml", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=opQrorkAAAAJ", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
