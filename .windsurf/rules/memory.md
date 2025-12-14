---
trigger: always_on
---

CONVERSATION & CODEBASE CONTEXT MEMORY FOR PLAYWRIGHT LOAD TESTING

WHAT TO REMEMBER ACROSS CONVERSATIONS:

Decisions and rationale we've discussed:

- Why we chose specific test patterns or locator strategies
- Trade-offs we considered and rejected
- Problem areas we identified and how we solved them (flaky locators, timing issues, site-specific quirks)
- Performance or reliability issues we addressed in tests

Recurring tasks and workflows:

- Test patterns I frequently ask you to implement
- Types of tests I commonly create (funnel tests, checkout flows, load tests)
- Refactoring patterns I prefer
- Common debugging scenarios we encounter
- Locator strategies I favor (CSS vs. role vs. testId)

Codebase areas we've worked on:

- Test specs we've created or modified
- Utility scripts we've built or refactored
- Custom reporters we've added
- Dashboard components we've customized
- Problem pages or components we've debugged
- Flaky locators we've stabilized

My preferences and style:

- Test structure choices I've explicitly stated or consistently applied
- Patterns I've rejected or criticized
- Level of verbosity I prefer in explanations
- Testing strategies I favor (load testing, parallel execution)
- Preferred locator methods (CSS selectors vs. role-based)
- Wait/timeout strategies I prefer


HOW TO USE REMEMBERED CONTEXT:

Reference past decisions:

- "Similar to how we handled [checkout flow] in [demoblaze.spec.js], we can..."
- "Based on our previous discussion about [step patterns], I'm using..."
- "Remember we decided to avoid [fixed waits] because..."
- "Following the pattern we established for [atomic steps]..."

Anticipate needs:

- If I'm working on a similar feature, proactively suggest the established pattern
- When I mention a test we've worked on before, recall the context without re-scanning
- If I ask about something we've discussed, reference that conversation
- When I mention a page, recall the locators and patterns we've used there

Build on previous work:

- When extending tests we built together, maintain consistency
- If improving something we created, acknowledge what's already there
- Suggest improvements based on patterns that worked well previously
- Reuse utilities and helpers we've already created


WHAT TO EXPLICITLY REMEMBER:

Mark these as important context:

- Custom utility scripts we create together
- Complex locator strategies for tricky UI components
- Workarounds for known site bugs or limitations
- Test data strategies specific to certain funnels
- Dashboard generation patterns we've established
- Reporter customizations we've made
- Timing/wait strategies for slow-loading pages

Test-specific context:

- Which tests are problematic or require special handling
- Which utilities are complete vs. work-in-progress
- Which tests are flaky and why (timing, network, animations)
- Which target sites are stable vs. under active development
- Which pages have locator challenges
- Which tests require specific configurations


CONTEXT REFRESH TRIGGERS:

Ask for context refresh when:

- I mention working on a feature we discussed days/weeks ago
- I reference a test or page we've worked on before
- I say "remember when we..." or "like last time..."
- I'm continuing work on an incomplete test
- I mention a specific site version or state we've tested

Confirm understanding:

- "Based on our previous work on [checkout funnel], I'm assuming [same flow]. Correct?"
- "I remember we used [atomic steps] for this test. Still the approach?"
- "Last time we handled [this element] with [CSS selector]. Same strategy?"


AVOID OVER-REMEMBERING:

Don't remember:

- Temporary experiments or tests I explicitly rejected
- One-off solutions that don't represent patterns
- Debugging steps that led nowhere
- Context from conversations marked as "just exploring" or "testing an idea"
- Failed locator attempts that we abandoned


SESSION CONTINUITY:

At the start of new sessions:

- If I reference previous work, acknowledge it: "Continuing from [funnel test work]..."
- If working in tests we've modified before, note: "I see we last worked on this when [adding atomic steps]..."
- If I'm doing a similar task, offer: "Should I follow the same pattern we used for [demoblaze test]?"
- If site has updated, ask: "Has the site UI changed since we last worked on [this page]?"


PROACTIVE CONTEXT USAGE:

Use remembered context WITHOUT being asked when:

- It's directly relevant to the current task
- It would save significant time or prevent repeating work
- It helps maintain consistency across tests
- It prevents me from going down a path we already explored and rejected
- It helps avoid known flaky patterns or problematic locators
- It leverages utilities or helpers we've already built


PLAYWRIGHT-SPECIFIC CONTEXT TO REMEMBER:

Site-specific knowledge:

- Which pages have loading delays requiring waitFor
- Which elements consistently need retry logic
- Which interactions work reliably vs. require alternatives
- Browser differences we've encountered
- Site-specific timing quirks

Test execution context:

- Which tests are safe to run in parallel
- Which tests must run sequentially
- Which tests require specific setup or teardown
- Which tests are suitable for CI/CD vs. local only
- Environment-specific configurations (workers, retries)


The goal: Make our collaboration feel continuous and contextual, not starting from scratch each time. Remember what matters, forget what doesn't. Build institutional knowledge about the sites, their quirks, and our testing strategies.
