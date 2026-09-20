---
layout: post
title: "What Is Jev? What It Does and How to Use It"
date: 2026-09-20 21:00:00 +0800
categories: [Blog]
tags: [Jev, AI Agents, LLM Infrastructure, AI Engineering, Decision Systems]
summary: "Jev is TypeSafe AI’s constrained “System One” model: it turns program state into choices, scores, and calibrated probabilities instead of prose. Here’s where it can replace an LLM decision call, how to integrate it, and where it will fail."
cover: /assets/images/posts/2026/09/jev-cover-v1.png
lang: en
translation_url: /blog/2026/jev-yu-yi-if/
linkedin: false
x: false
---

Have you ever run into a situation like this? To decide whether a news item belongs in today’s daily brief, you call a model with hundreds of billions of parameters. It thinks for two seconds, produces a paragraph such as “Overall, this news item appears to have some relevance,” and then you still have to write a pile of regexes and `try-except` blocks to pry a single “yes” out of that filler.

One yes-or-no question has gone through an entire generation pipeline.

Jev, which has been all over people’s feeds these past few days, is built to cut that pipeline out. Less than a week after launch, more than 700 posts about it had accumulated on X. Within 24 hours of arriving on Vercel AI Gateway, nearly 13% of paid teams there were calling it—an adoption rate higher than any model Vercel had previously listed.

ChatGPT writes answers for people; Jev makes decisions for programs. It does not write code, it does not chat, and it does not even expose a free-form text interface. It handles only three kinds of questions, returning a probability with a confidence level in a few hundred milliseconds.

## Why Large Models Are So Awkward at Yes-or-No Questions

The reason is autoregression.

Large models produce output one token at a time. Even if all you want is JSON, the model has to “write” that string of characters first, and your program then has to parse it. To produce one word, it pauses to consider the next; everything that came before must be recomputed in attention along the way.

It is like asking someone who writes essays to look back over everything they have written before placing every single character, then decide what comes next. That mechanism gives large models tremendous creative power: they can write fiction, code, and analytical reports. But when you ask them a true-or-false question, it becomes much more cumbersome. It is not that they cannot do it; it is more like using a crane to drive a nail.

If you use an API, cost is also a major concern. Adding one decision point is easy. The problem is that an agent may need to make dozens or hundreds of decisions in a single task: call once to determine whether an email is a complaint, call again to decide which tool to use next, call again to check whether the task is done, and call a second model once more when it is uncertain. The user sees one task completed; behind the scenes, dozens of calls have already been burned.

## How Jev Gets Around This

Jev comes from San Francisco–based TypeSafe AI. It launched on September 15, 2026, and has just raised a $40 million seed round led by DCVC. Its founder, Diogo Almeida, came from OpenAI and is one of the authors of the InstructGPT paper.

Its name comes from economist William Stanley Jevons, the person behind the “Jevons paradox”: when technology makes something cheaper, total consumption can rise instead. Naming a model whose pitch is “cheap enough to call freely” after him makes the intention fairly obvious.

Its approach is to tightly constrain the output.

The input is a piece of `state`: your program’s current state. The output has only three forms:

| Task type | What it answers | What it returns |
|---|---|---|
| Choice | Select one option from a fixed set | `choice`, a probability for each option, and `confidence` |
| Score | Assign a score on an ordered set of levels | `score`, a probability for each level, and `confidence` |
| Noul | The probability that a judgment holds | A floating-point number from 0 to 1 |

Suppose a customer says, “The shoe size is wrong, and my refund still has not arrived.” You can ask Jev, at the same time, which department should handle the case, whether the customer is requesting a refund, and how intense the customer’s emotion is. It does not write an explanation; it returns the options, scores, and probabilities directly.

Choice supports up to 255 options, so it cannot invent a 256th one out of thin air. The official description calls this “zero hallucination,” though that wording is not really precise. It is enough to understand the mechanism.

Because the answer is confined to the range you give it, Jev does not need to decode output word by word. Instead, it calculates the probability distribution across all options in the output layer at once. Its official end-to-end figure is 70 to 500 milliseconds.

Another very effective mechanism is that it reads the same material only once and answers multiple questions in parallel. TypeSafe says that adding questions has almost no effect on response time, so do not split them into multiple calls—that only means paying repeatedly for the same long input.

TypeSafe calls this category a System One Model, borrowing Kahneman’s distinction between fast and slow thinking. Large models have been imitating slow thinking: writing long analyses and doing complex reasoning. Jev fills in the fast, lightweight kind of thinking that makes intuitive judgments. The official documentation has an analogy that I think is even more accurate: a “function call that understands semantics.”

**What is truly valuable is not speed, but probability calibration.**

Earlier small classification models were fast too. But because of the way they were trained, even without a correct match they would still rank the options and return whichever one fit best—even if the “best” option was completely wrong. That kind of confidence is unusable; you would not dare base routing policy on it. Jev’s training objective is called RLCD (Reinforcement Learning for Calibrated Decisions). The idea is to make confidence behave like a trustworthy weather forecast: when it says it is 80% sure, it should be right roughly 80 times out of 100 in statistical terms.

Only once that works does it become meaningful in engineering practice. You can safely write `if confidence > 0.9`: let high-confidence cases pass automatically, and send low-confidence ones to a human or a large model.

## Quantifiable Real-World Results

TypeSafe’s website displays two figures: up to 193.6× faster and 444.6× cheaper. It is important to look carefully at where those numbers come from.

They come from TypeSafe’s own workflow evaluation. The comparison baseline is the average of GPT-6 Astra and Fable 5.1, and the workflows being tested were written by TypeSafe’s own team. The company itself acknowledges that the gain is at the **upper end** of real-world use. One further detail: it has not published proof that the price is not subsidized.

Then there is the claim that it is “238× cheaper than Claude Fable 5.1.” That number comes from dividing input pricing by input pricing: $10 divided by $0.042. But that is not the price tier teams are actually using in practice.

| Model | Input (per million tokens) | Output (per million tokens) | Relative to Jev |
|---|---:|---:|---:|
| TypeSafe Jev | $0.042 | Free | Baseline |
| GPT-5.6 Luna | $0.20 | $1.20 | About 4.8× |
| GPT-5.6 Terra | $2 | $12 | About 48× |
| Claude Fable 5.1 | $10 | $50 | About 238× |

Across four business workflows, Jev averaged about 68% accuracy at a cost of $0.0004; GPT-5.6 Luna averaged about 67% at $0.0035; GPT-5.6 Sol reached 74% at $0.085; and Claude Opus 5 reached 73% at $0.17.

## What It Cannot Do

“Zero hallucination” does not mean it never makes mistakes. It only guarantees that the answer falls within the options you provide. It can still choose the wrong option among valid ones; TypeSafe’s CEO has acknowledged this himself. The 0% claim refers to formatting errors, not an observed answer-error rate.

Then there is the list of uneven weaknesses exposed in testing. Counting, exact arithmetic, and reasoning about the order of dates are not very reliable. Accuracy drops noticeably on long-chain, multi-hop reasoning. It is trained primarily in English; Chinese works, but is materially weaker. Before using it for nuanced Chinese semantic judgments, be sure to test it on your own samples first.

Prompt injection still works. If users hide steering instructions in the input, Jev can still be led astray. So for high-risk actions involving refunds, funds, or deleting a database, hard-coded permission checks at the lower layer still need to stay in place.

There is also a structural limit: the input cap is about 32,000 tokens. Someone tried to put it into their everyday tools to improve productivity and ran into a wall all four times. The problem was not the model: the API returned normally each time, and its Chinese judgments were accurate. The blockers were threefold. First, it could not see enough content; to fit under the limit, material had to be cut, and after that there was not enough left for it to judge. Second, when you already have a subscription to a large model, the marginal cost of one more judgment is effectively zero; inserting another layer only adds a second of latency and another point of failure. Third, it can judge but cannot do work. Moving data and changing files still rely on a third-party wrapper, and all the pitfalls end up in that wrapper layer.

## How to Get Started

The official route is to join the waitlist at typesafe.ai, then create an API key in the console after you are approved. If you do not want to wait, there are three shortcuts: call `typesafe/jev-1.13` directly after registering with OpenRouter; use `typesafe-ai/jev` on Vercel AI Gateway; or use Cloudflare Workers AI, which has it too. Pricing is the same as the official service. The official API model name is `jev-latest`.

One pitfall: the official SDK reads `TYPESAFE_API_KEY`, while the code-review plugin for Claude Code and Codex reads `JEV_API_KEY`. They are two different environment-variable names.

Installing the SDK takes one line. Python needs to be version 3.10 or higher.

```bash
pip install typesafe-sdk
npm install @typesafe-ai/sdk
```

The most basic usage is to send a `state` and a set of questions to one endpoint. All questions share the same state and are answered in parallel.

```bash
curl -X POST https://api.typesafe.ai/v1/systemone \
  -H "Authorization: Bearer $TYPESAFE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "jev-latest",
    "state": "Hi, I have been trying to connect my Stripe account for 3 days and it keeps failing. I am losing sales. Please help ASAP.",
    "questions": {
      "is_urgent": {
        "type": "noul",
        "instructions": "Does this message express urgency or time-sensitivity?"
      },
      "department": {
        "type": "choice",
        "instructions": "Which team should handle this?",
        "criteria": {
          "billing": "Payments, invoicing, refunds",
          "technical": "Bugs, outages, integrations",
          "sales": "Pricing, upgrades, new accounts"
        }
      },
      "frustration": {
        "type": "score",
        "instructions": "How frustrated is the customer?",
        "criteria": ["Calm, just stating facts", "Frustrated but civil", "Very angry, strong language"]
      }
    }
  }'
```

The Python SDK is smoother to read. The same call sends all three questions together.

```python
from typesafe_sdk import Choice, Noul, Score, TypeSafeClient

client = TypeSafeClient()  # reads TYPESAFE_API_KEY; defaults to jev-latest

resp = client.system_one(
    state="I requested a refund three days ago and it still has not arrived; the shoes have not shipped either.",
    questions={
        "is_refund_request": Noul(
            instructions="Is the customer explicitly asking for a refund?"
        ),
        "department": Choice(
            instructions="Which team should this order be routed to?",
            criteria={
                "billing": "Billing, invoices, refund amounts",
                "logistics": "Shipping, tracking, addresses",
                "aftersale": "Returns, exchanges, quality issues",
            },
        ),
        "frustration": Score(
            instructions="How intense is the customer's emotion?",
            criteria=["Stating facts", "Dissatisfied but restrained", "Very angry"],
        ),
    },
)

print(resp.answers["department"].choice,
      resp.answers["department"].confidence,
      resp.answers["department"].probabilities)
print(resp.answers["is_refund_request"].noul)
print(resp.model)  # Suggested for logging, e.g. jev-1.13.0
```

There is one detail here that is especially worth thinking about: `confidence` and the probability of the highest-ranked option are not the same thing.

In the official documentation’s example, `billing` wins with a probability of 0.84, but `confidence` is only 0.596 because `technical`, the runner-up, still holds 0.159. It wins, but not decisively enough. If you look only at probability and not confidence, it is easy to let this kind of ambiguous judgment slip through.

After testing, here are a few practical takeaways:

Keep the division of labor strict. Let Jev handle only the extraction of the original judgment. Leave date calculations, counting, sorting, and threshold comparisons to your own code. Keep permissions and policy in your own code as well; do not expect it to serve as your guardrail.

Set thresholds according to the cost of an error; do not copy someone else’s numbers. The loss from a misclassification differs from task to task, and stricter requirements still need your own oversight.

For every call, log the model version, probabilities, and usage. Once thresholds are tuned, pin a versioned model ID instead of continually pointing to `latest`.

Calibrate confidence bands and thresholds on labeled examples from your own business.

For retrieval pipelines, first use a relevance judgment to filter the material, so each decision sees only the passages it needs. That is both more accurate and more economical.

## When Should You Use It?

The right place for Jev is very clear: **the small decision points that already exist inside a system.**

Who should receive this ticket? Is this content compliant? Which tool should be called next? Does this extraction result need another review? Should this order be escalated to a human? These are the places where systems often used to stuff in a large-model call—slow, expensive, and followed by regexes to extract an answer from its response.

The unsuitable places are equally clear. If you need writing, free-form creation, or long-chain reasoning, it cannot do the job and it will not do it well. When the problem itself has not been thought through and you cannot even list the options yet, you are in the exploration stage, and a large model is the right tool.

The cases already appearing online all follow the same pattern: replace a decision point in an existing system, rather than asking Jev to do the work itself.

Browser Use’s open-source `jev-ultrafast` turns a webpage into a numbered list of elements and lets Jev choose “which one to click.” Its Zurich-to-London flight search fell from 9.5 seconds to 7.1 seconds. TypeSafe used it to play Doom: the input becomes parsed, structured state rather than pixels; it makes about ten decisions per second, and an hour of play costs about $7. LangChain shipped TypeSafeClassifier on the day after launch, moving control-flow decisions such as “which tool to call next” out of the hands of a large model. Vercel integrated it into AI Gateway and the `evaluate` capability of AI SDK 7 for compliance review and factual-consistency scoring.

If you happen to have a small decision point that is blocking a main path and must run hundreds of thousands of times a day, it is genuinely worth trying now. As for putting it directly into production, my view is: wait a little longer.
