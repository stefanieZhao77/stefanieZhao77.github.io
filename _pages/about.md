---
layout: about
title: about
permalink: /

profile:
  align: right
  image: prof_pic.jpg
  image_circular: false # crops the image to make it circular
  more_info: >

selected_papers: false # includes a list of papers marked as "selected={true}"
social: true # includes social icons at the bottom of the page

announcements:
  enabled: false # includes a list of news items
  scrollable: true # adds a vertical scroll bar if there are more than 3 news items
  limit: 5 # leave blank to include all the news in the `_news` folder

latest_posts:
  enabled: true
  scrollable: true # adds a vertical scroll bar if there are more than 3 new posts items
  limit: 3 # leave blank to include all the blog posts
---


<div class="home-container">
  <!-- Hero Section -->
  <section class="hero-section">
    <h1 class="greeting">Hello, World! 👋</h1>
    <div class="intro">
      <p>
        I'm Wanqi Zhao, a PhD candidate at TU Dresden working at the
        intersection of software engineering and robotics. I'm passionate about
        bringing modern technologies like ML and LLMs to traditional
        manufacturing, making industries smarter and more efficient. I'm also a
        full-stack software engineer with 5 years of experience in the industry
        before I started my PhD.
      </p>
    </div>
  </section>

  <!-- Current Research Section -->
  <section class="research-section">
    <h2>What I'm Up To 🚀</h2>
    <p>
      My primary research focuses on grammar-driven robotic assembly, where I'm
      developing new ways for robots to understand and execute complex assembly
      tasks more intelligently. Beyond this, I explore how modern technologies
      can transform various traditional industries.
    </p>

    <div class="research-focus">
      <h3>Research Areas</h3>
      <ul>
        <li>
          Developing grammar-based frameworks for robotic assembly systems -
          making robots more adaptable and easier to program in manufacturing
        </li>
        <li>
          Automation in textile manufacturing - bringing smart technologies to
          one of the world's oldest industries
        </li>
        <li>
          Construction robotics - exploring how my current grammar-based
          framework can be applied to construction tasks, such as bridge
          assembly
        </li>
        <li>
          ML applications in medical industry - leveraging artificial
          intelligence for multiple sclerosis diagnosis
        </li>
        <li>
          Integration of LLMs with robotic planning - investigating how language
          models can enhance robot decision-making and task execution
        </li>
      </ul>
    </div>
  </section>

  <!-- Journey Section -->
  <section class="journey-section">
    <h2>Journey So Far 💻</h2>
    <p>
      Before diving into robotics research, I spent 5 years as a full-stack
      software engineer and project manager, working on enterprise-level systems
      and medical imaging applications. This diverse experience gave me both
      technical expertise and valuable domain knowledge that I now apply to my
      research.
    </p>

    <div class="experience-highlights">
      <h3>Industry Experience Highlights</h3>
      <ul>
        <li>
          Led development of enterprise software systems for major Chinese
          companies including China Unicom and Shaanxi Yanchang Petroleum,
          gaining deep insights into industrial operations and requirements
        </li>
        <li>
          Developed 3D medical image reconstruction systems and implemented deep
          learning solutions for lung tumor detection, combining software
          engineering with medical applications
        </li>
        <li>
          Managed cross-functional teams and collaborated with stakeholders to
          deliver large-scale software solutions, developing both technical and
          project management skills
        </li>
      </ul>
    </div>
  </section>

  <!-- Tech Explorer Section -->
  <section class="tech-section">
    <h2>Tech Explorer 🔍</h2>
    <p>
      I'm passionate about exploring cutting-edge technologies and their
      practical applications. My current interests include:
    </p>
    <ul class="index">
      <li>
        LLM agents in robotics - exploring how large language models can enable
        more intelligent and autonomous robotic systems
      </li>
      <li>
        Multi-agent collaboration - investigating ways to improve robot-robot
        and human-robot collaboration in industrial settings
      </li>
      <li>
        Industrial automation - bridging the gap between traditional
        manufacturing and modern AI/robotics technologies
      </li>
      <li>
        Software engineering for AI systems - developing robust and scalable
        architectures for LLM-based applications
      </li>
      <li>
        Open source LLMs and their applications - experimenting with various
        language models and their potential in robotics and automation
      </li>
    </ul>
  </section>

  <!-- Life Beyond Code Section -->
  <section class="life-section">
    <h2>Beyond Work 🌟</h2>
    <p>When I'm not working with robots and code, you might find me:</p>
    <ul class="index">
      <li>
        Bookworm - diving into speculative and science fiction, exploring social
        science, history, and psychology
      </li>
      <li>
        Fitness enthusiast - Deadlift: 110kg, Squat: 90kg, Bench Press: 40kg
      </li>
      <li>Photography enthusiast - capturing moments through my camera lens</li>
      <li>
        Tech gadget lover - exploring the latest developments in consumer
        electronics
      </li>
    </ul>
  </section>

  <!-- Connect Section -->
  <section class="connect-section">
    <h2>Let's Connect! 🤝</h2>
    <p>I'm always excited to chat about:</p>
    <ul class="index">
      <li>Robotics and automation in manufacturing</li>
      <li>AI and LLMs applications</li>
      <li>Software engineering best practices</li>
      <li>Photography tips and tricks</li>
      <li>Book recommendations</li>
      <li>Workout routines</li>
      <li>Or just grab a coffee and talk tech!</li>
    </ul>
  </section>
</div>

<style>
  .home-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
  }

  section {
    margin-bottom: 40px;
  }

  .greeting {
    font-size: 2.5em;
    margin-bottom: 20px;
  }

  .intro {
    font-size: 1.2em;
    line-height: 1.6;
    margin-bottom: 30px;
  }

  h2 {
    font-size: 1.8em;
    margin-bottom: 20px;
  }

  h3 {
    font-size: 1.4em;
    margin: 15px 0;
  }

  .index {
    list-style-type: none;
    padding-left: 0;
  }

  .index li {
    margin-bottom: 10px;
    padding-left: 20px;
    position: relative;
  }

  .index li:before {
    content: "•";
    position: absolute;
    left: 0;
    color: var(--link-color);
  }

  .quote {
    text-align: center;
    font-size: 1.2em;
    margin: 40px 0;
    padding: 20px;
    border-top: 1px solid var(--border-color);
    border-bottom: 1px solid var(--border-color);
  }

  /* The styles will work with Chirpy's dark/light mode automatically */
  @media (prefers-color-scheme: dark) {
    .research-focus,
    .experience-highlights {
      background-color: var(--sidebar-bg);
      padding: 20px;
      border-radius: 8px;
    }
  }

  @media (prefers-color-scheme: light) {
    .research-focus,
    .experience-highlights {
      background-color: var(--sidebar-bg);
      padding: 20px;
      border-radius: 8px;
    }
  }
</style>
