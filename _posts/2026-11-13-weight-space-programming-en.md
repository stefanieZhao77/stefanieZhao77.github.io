---
layout: "post"
title: "Letting AI Directly Modify Model Weights: A Guide to Weight Space Programming"
date: "2026-11-13"
categories: ["Blog"]
tags: ["AI", "MachineLearning", "ModelWeights", "Agents"]
lang: "en"
description: "RSI stands for Recursive Self-Improvement. The key is that an improvement not only makes an AI better at a particular task, but also makes it better at carrying out the next round of improvement. The result of one round re-enters the research and development process, creating feedback."
summary: "RSI stands for Recursive Self-Improvement. The key is that an improvement not only makes an AI better at a particular task, but also makes it better at carrying out the next round of improvement. The result of one round re-enters the research and development process, creating feedback."
cover: "/assets/images/posts/2026/11/weight-space-programming-en.png"
thumbnail: "/assets/images/posts/2026/11/weight-space-programming-en.png"
translation_url: "https://stefaniezhao77.github.io/blog/2026/weight-space-programming/"
linkedin: false
x: false
---

RSI stands for Recursive Self-Improvement. The key is that an improvement not only makes an AI better at a particular task, but also makes it better at carrying out the next round of improvement. The result of one round re-enters the research and development process, creating feedback.

For example, an AI finds a more effective training method and uses it to train a stronger successor model. The successor becomes better at designing experiments and judging results, and finds the next effective improvement. Put simply, the AI iteratively improves itself. The object of improvement can be weights, algorithms, the training process, or research tools; it does not require a single model to directly modify itself. Whether the feedback can continue, and how much it can accelerate, still depends on bottlenecks in computing power, experimentation, and validation. It cannot simply be equated with unlimited growth.

Weight editing is one candidate path in this direction. We are already used to having agents modify code: describe the problem, give one a repository, and let it inspect the implementation, propose changes, and run tests. Now, if we replace the repository with a neural network's weight file, can that way of working still hold? The MIT CSAIL team's [Weight Space Programming research blog](https://rikiyat.github.io/blog/weight-space-programming/), published on November 2, 2026, attempts exactly this. They had GPT-6 Astra analyze, write, and modify the weights of other networks. One experiment patched Qwen3.5-0.8B's mathematical performance without using gradient updates during the modification process.

## What Are Weights?

We can write a language model in abbreviated form as a function:

`output = f(input context, θ)`

Here, θ represents the weights: large numbers of floating-point values organized into matrices and vectors in different layers. The input passes through these computations and ultimately becomes a probability distribution over the next token.

When we write a prompt, we change the input context. Giving a model a role, providing a few examples, and asking it to reason step by step all belong on this side. A typical RAG application retrieves material first and then gives it to the model, likewise changing mainly what it can see in that round. These methods can significantly affect the output, but they need not modify the generative model's weights at inference time.

Training and fine-tuning change θ. We define a loss function, use samples to calculate error, and then have an optimizer update parameters along the gradient. LoRA freezes the original weights and trains only a low-rank increment, but it still belongs to this approach.

Weight Space Programming tries to let an agent directly decide how to change θ based on a task objective and feedback. Some of the work of producing updates, where gradient descent would normally operate, is now handed to a model that can analyze problems and write programs. Optimization can still happen without gradients: try a modification, measure its effect, and try another if it does not work. Not using backpropagation does not mean there are no costs in computation, data, or trial and error. Nor are weights a table of knowledge. Changing weights is more like adjusting a computational process; which inputs the modification affects must be checked in practice.

## Where Is the Model Getting Stuck?

To understand the Qwen experiment, we can start without formulas. The researchers found that many of the small model's failures did not come from calculating a wrong answer. Instead, it kept repeating its earlier reasoning until it used up its allowed generation length without delivering an answer.

What the agent needed to find, therefore, was not “where to write the correct answer,” but whether some internal computations kept reinforcing this tendency to repeat. Once found, could those computations be adjusted so the model could more easily continue its reasoning?

In the end, it modified a small subset of connections in two layers. It did not switch off an entire module. Instead, it adjusted the effects of these connections associated with repetitive reasoning while trying to preserve the other computations. Specifically, the modification involved about 130,000 weights, only about 0.016% of the entire model. But although few locations were touched, the magnitude of the local adjustment was not small.

The 0.016% describes the number of weights changed, not the scope of their effects. Each piece of content a language model generates is fed back into its subsequent context. Once it keeps producing similar checks and restatements, later generation may continue down that same path. A local patch can therefore change the generation of much of what follows.

## How the Agent Actually Makes the Changes

In this experiment, the agent could read weights, write Python, have external tools execute modifications, and then observe the model's results on problems. You can think of it as repairing something while test-running it: first see where the model gets stuck, propose a cause, try a patch, and then have the versions before and after the modification solve the same problems to compare whether there was an improvement.

The most valuable part here is handing the question of “where to try next” to a searcher capable of programming and reasoning. Conventional automated tuning often searches among a few knobs specified in advance by a person, such as learning rate, number of layers, or temperature. An agent that can write programs and analyze weights has the opportunity to propose changes that were not originally listed in a configuration table.

The researchers did, however, provide a clear diagnostic starting point: they suggested treating “repetitive thinking and taking too long to finish” as the repair target, asked the agent to test different modification strengths, and required it to hold back problems that had not been used to select the patch for final validation. The agent searched for the precise locations and modification method itself, while people designed the overall troubleshooting framework. It could also give a compelling explanation for an operation that happened to work by chance, so the explanation and the effect still need to be validated separately.

This round of editing had 50 opportunities to use the forward-evaluation tool. That does not mean it solved only 50 problems: one generation evaluation could include up to 512 samples. Nor does it mean the agent was invoked only 50 times in the entire process. It first used practice problems to explore and validate patches; the researchers then calculated the final scores using a separate set of evaluation problems.

## How Much Stronger Was the Model After the Fix?

Under the researchers' evaluation configuration, with thinking enabled and a maximum generation length of 32,768 tokens, accuracy on MATH-500 rose from 7.9% to 48.1%, and on GSM8K from 13.8% to 67.1%. On MATH-500, the proportion of answers that exhausted the length budget fell from 93.0% to 33.1%.

Even on a problem it could otherwise continue solving, if the model keeps repeating itself and exhausts its output budget, it still cannot produce a valid answer. Making that path reach a proper end is enough to improve accuracy; there is no need to assume an entire body of mathematical knowledge was written in from nowhere.

This is the point I care about most in the experiment. A model may lack the ability to solve a problem, or it may already have some of that ability but often fail to complete the process. The way weights should be modified may differ between these two problems.

The researchers also tried Gemma 3 270M, which falls into repetitive loops less often, but did not obtain a clear improvement in mathematical ability. This comparison reminds us that removing an obstacle that prevents an ability from being expressed and adding an ability that was absent are two different things. These experiments demonstrate a possibility for the former; they have not solved the latter.

## What Is Still Missing Between a Model Patch and Recursive Improvement?

Directly modifying weights is not new. What interests me about Weight Space Programming is that more general models are beginning to participate in finding and writing these modifications, rather than only executing editing algorithms already designed by people.

To move forward, I think the most crucial evidence would be that after the first round of improvement, the system actually becomes better in the next round at doing research, proposing modifications, and judging results. Having the same strong model repeatedly patch smaller models can be very useful automated research and development, but it has not demonstrated feedback in which the ability to improve itself gets better.

Moreover, that feedback needs to hold over multiple rounds. Rising scores cannot come from evaluations becoming easier, and abilities retained in earlier rounds cannot gradually be lost in later ones. These conditions are harder to validate than “being able to change a few of its own floating-point values,” and they deserve more time.

For engineering practice, I am more excited about another use: bringing model failures into a relatively concrete diagnostic process. There are failure examples, hypotheses about internal mechanisms, weight patches that can be saved and rolled back, and independent tests to confirm which behaviors have improved and which have regressed.

Weight files are of course still far less readable than source code. We also cannot yet review a patch and know whether it is correct the way we can when reviewing an ordinary function. But if more and more model problems can be narrowed down to a computational path, a set of directions, or a reproducibly validated modification, then “this model just isn't good enough” need not always be the end of the discussion. Rather than immediately interpreting this as unlimited self-evolution, though, I would rather see the next result: with a different model and a different set of tasks that did not participate in the search, can an agent find another useful patch and clearly demonstrate what it fixed?

## Technical Supplement: What Exactly Did the Patch Change?

For a closer look at the weight-level operation, we can use a simplified MLP formula:

`h_new = h + W_down × a(h)`

`h` is the current representation, `a(h)` is the MLP's intermediate activation, and `W_down` maps those activations back into the representation space used by the model. The formula omits details such as normalization. Breaking down the matrix multiplication, each column of `W_down` corresponds to a direction; the more strongly an intermediate unit is activated, the greater that column vector's contribution to the result. Therefore, instead of deleting an entire unit, one can change only a particular directional component that it passes on to subsequent computations.

The final modification focused on the MLP down projections in layers 15 and 19, involving 64 columns in each, for a total of 131,072 weight elements, about 0.016%. The agent constructed a unit direction `u` for each layer from paired contexts of smooth and repetitive reasoning, selected the columns that wrote the strongest signals in the corresponding direction, and then applied directional compensation:

`W = W0 − 6 × outer(u, mask64 × (u @ W0))`

`W0` is the original matrix, `mask64` retains only the selected 64 columns, and `outer` denotes the outer product. The coefficient is 6, so this is stronger than simply zeroing out a projection in a given direction; it includes compensation in the opposite direction. Measured by the ratio of the patch's Frobenius norm to that of the original matrix, the two changes were about 10.6% and 8.1%. A sparse change across the whole model does not mean the modified locations were only touched lightly.

The practice material included training problems from GSM8K and MATH and AIME problems from previous years. A forward-tool call could also be used to read internal states as the model processed text without generating an answer. The final evaluation set was not made available to the agent.
