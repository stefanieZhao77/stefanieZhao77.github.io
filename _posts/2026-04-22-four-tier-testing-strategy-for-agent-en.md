---
layout: post
title: "Testing, Testing, and More Testing: A Four-Tier Strategy for Agent Workflows"
date: 2026-04-22
categories: [Blog]
tags: [Agent, Testing, Workflow, Engineering]
linkedin: true
---

> 💡 In the Agent era, errors are produced and spread faster than ever. Traditional testing processes can't keep up with development speed anymore. This article proposes a four-tier testing strategy—Unit, API, Smoke, and E2E—with detailed timing for each tier within Agent workflows, helping developers balance efficiency and quality.

Agent has made code generation incredibly fast, but it's also amplified something else exponentially: errors are produced faster and spread faster too. Previously I could make three logic changes in a day; now an Agent does it in minutes. A bug used to be a single function gone wrong, but now the Agent might produce:

• The function itself is fine, but the interface contract changed
• It runs locally, but breaks after merging to branch
• Individual features work, but break other chains when released

So testing can no longer be defined as a post-development process—it needs to be part of the Agent development orchestration. This article shares how I approach this now.

## Four Types of Testing

My primary definitions are: unit tests, API tests, smoke tests, and E2E tests. These different test levels need to run at different times, otherwise they'll slow down development. Unit tests catch low-level errors; API tests catch collaboration errors; smoke tests catch integration incidents; E2E tests catch user experience failures.

| Test Layer | The Real Question It Answers | What Happens If Missing |
|---|---|---|
| Unit Test | Did this local change break the most basic logic? | Bugs slip through at the cheapest stage |
| API Test | Can modules still collaborate per contract? | Individual features work, but integration fails |
| Smoke Test | After merging, are core paths still alive? | Looks mergeable, but explodes on release |
| E2E Test | Does the full user journey still work? | Engineering works, but user paths break |

### When Each Test Should Run

| Test Type | Best Timing | Primary Goal | Worst Misuse |
|---|---|---|---|
| Unit Test | Run immediately after Agent completes a local function/module change | Catch local logic errors fast | Using it to verify entire business flows |
| API Test | Before submitting feature branch | Verify module contracts, I/O, dependencies | Over-relying on mocks, testing fake APIs |
| Smoke Test | Before PR merge or before merging to release | Confirm core paths survive | Cramming too many scenarios |
| E2E Test | Release candidate, before critical launch | Verify real user journeys | Making it the daily dev inner loop |

Earlier tests should be faster, narrower, and cheaper; later tests should be fewer, heavier, and closer to production.

### When Should Unit Tests Run?

Unit tests aren't for pre-release—they're part of the Agent development inner loop.

For these types of local, deterministic, cheap-feedback tasks, unit tests should run immediately:

• Pure function changes
• Rule logic changes
• State transition changes
• Schema mapping changes
• Data cleaning logic changes
• Tool parameter assembly
• Import/export field handling

In my Agent workflow, unit tests are attached to two points: run automatically after each local implementation, and run again before Agent finishes this round of modifications. These tests need to be fast, so they're best added by the Agent automatically, triggered after local logic changes, with commits for each small feature point and pre-commit hooks to run related test files.

| Change Type | When to Run Unit Tests |
| --------- | ---------------------- |
| New pure function | Run immediately after writing |
| Modify existing rule | Run related cases immediately |
| Fix bug | Add regression test first, then code changes, then run |
| Refactor implementation (no behavior change) | Run immediately after change |

### When Should API Tests Run?

With limited context leading to memory inaccuracy, or multiple agents modifying simultaneously, these issues frequently occur:

• Parameter name changed, caller still uses old field
• Return structure changed, downstream parser not updated
• Tool call order looks fine, but state semantics changed completely
• DB write succeeded, but API response contract changed
• One module added default value, another module falsely judges success

So before submitting a feature branch or opening a PR, a complete API test is needed.

My API tests cover:

• Frontend-backend API contracts
• Tool call input/output contracts
• DB read/write boundaries
• Webhook/event payloads
• File import/export structures
• Prompt output schemas
• Agent step state transfer formats

API tests are usually slower than unit tests, but not requiring CI yet. So I prioritize: after Agent finishes feature self-test, let it complete all API test code and verify. Trigger via hook before pre-push, and ideally run again before PR creation.

### When Should Smoke Tests Run?

Smoke tests verify whether the core flow breaks after changes enter integration state. Since I manage worktree tests myself, smoke tests run at only two points: before PR merges to worktree, and before merging to the test release version.

Smoke tests basically only check:

• Application can start
• Core pages can open and return data
• Key APIs return normally
• 1~2 main paths can run through
• Key dependencies (DB/cache/queue/model service) not broken

One note: don't write it as a mini E2E. This layer doesn't need comprehensiveness—it needs key paths alive. I define it in CI to run on every PR/merge, and on every release.

### When Should E2E Tests Run?

E2E tests are expensive but also an important guard. However, they shouldn't be the Agent daily development inner loop. Best timing is usually after merging to release, recording frequently-missed high-risk main paths, especially for core feature modules that might have frequent changes.

E2E should verify user paths are established, ensuring business flows are smooth from start to end. My approach is adding nightly scheduled tasks in CI for more complete E2E suites. Only add local runs for high-risk changes.

## My Current Flow: From Feature Issue to Release, Which Tests Should Run?

Based on my development rhythm, here's how I designed it:

| Stage | Goal | Required Tests |
|---|---|---|
| Create feature issue | Define acceptance criteria | Write test strategy first, don't run yet |
| Agent develops local logic | Catch low-level errors fast | Unit tests |
| Feature complete | Verify module collaboration | API/contract tests |
| Open PR / prepare merge | Prevent pollution to main | Smoke tests + necessary regression |
| Merge to release candidate | Verify integration stability | Release smoke test |
| Before production | Verify key user paths | Key E2E |

### Test Section That Should Be in an Issue Template

```md
## Feature
Support importing new vendor CSV format

## Risks
- Field mapping changes
- Null value handling
- List page display after import
- Old format compatibility

## Required tests
- [ ] Unit tests: field mapping / null handling / schema validation
- [ ] API tests: import API response / DB write result
- [ ] Smoke tests: list page viewable after import
- [ ] E2E: only on release candidate - "upload CSV → import success → list visible" main path

## Merge gate
- Unit tests pass
- API tests pass
- smoke passes
```

This isn't the complete template—it's an addition to my previous issue template. Check previous articles for the full template.

All test files need to be written by the Agent during development. This article focuses on timing for each test type. These logics can all be defined via hooks or Agent skills. I feel I'm already the slowest part of the development process, so I write more tests to reduce my workload.