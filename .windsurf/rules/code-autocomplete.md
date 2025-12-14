---
trigger: always_on
---

AUTOCOMPLETE & IN-CODE SUGGESTIONS BEHAVIOR FOR PLAYWRIGHT LOAD TESTING

LEARNING FROM FEEDBACK:

MEMORIZE and track autocomplete outcomes:

- ACCEPTED suggestions (when I press Tab/Enter to accept)
- REJECTED suggestions (when I press ESC or continue typing without accepting)
- IGNORED suggestions (when I dismiss and type something different)

Build a feedback loop:

- If I accept a suggestion pattern multiple times → increase confidence in similar suggestions
- If I reject a suggestion pattern multiple times → stop suggesting similar patterns
- If I reject suggestions in a specific context → avoid suggesting in that context

Learn my personal preferences:

- Track which types of suggestions I consistently accept vs. reject
- Identify contexts where I prefer manual typing over suggestions
- Remember specific commands/patterns I always accept or always reject
- Note file types or testing scenarios where I want fewer suggestions


WHEN TO PROVIDE AUTOCOMPLETE SUGGESTIONS:

ONLY suggest autocompletions when they are highly relevant and contextually appropriate

Provide suggestions when:

- Completing a clearly established Playwright test pattern (e.g., test.step, page.locator, expect sequences)
- Referencing locators you've analyzed and know exist in the test
- Using Playwright API methods that definitely exist (@playwright/test)
- Following conventions you've cached from the codebase (e.g., step naming patterns, locator strategies)
- Completing test structure (test, test.step, expect) matching existing test patterns
- Adding standard Playwright commands (click, fill, locator, expect, waitFor) in appropriate contexts
- The suggestion matches patterns I've PREVIOUSLY ACCEPTED in similar contexts


WHEN NOT TO SUGGEST:

DO NOT suggest autocompletions when:

- I'm in the middle of thinking/typing and the context is unclear
- Multiple valid approaches exist - wait for more context
- You're not certain the locator selector or method exists
- I'm writing comments or documentation
- I'm editing test names or variable names
- The suggestion would be speculative or guessing my intent
- I'm in an exploratory/experimental testing phase
- Similar suggestions were PREVIOUSLY REJECTED (ESC) in this context
- I've rejected this type of suggestion 2+ times recently
- The pattern matches something I've consistently ignored


QUALITY OVER QUANTITY:

Prioritize accuracy and relevance:

- One highly relevant suggestion > multiple mediocre ones
- If uncertain, provide NO suggestion rather than a wrong one
- Base suggestions on cached codebase knowledge AND my acceptance history
- Ensure the suggestion matches valid Playwright JavaScript syntax
- Weight suggestions by: (codebase pattern match + my historical acceptance rate)


CONTEXT AWARENESS:

Consider the coding context:

- What file type am I in (spec file, config, reporter, helper script)?
- What are the immediate surrounding test steps doing?
- What locators or page objects are already defined?
- What selectors are in scope and available?
- Am I following an established pattern from the codebase?
- Have I accepted or rejected similar suggestions in this file before?
- What's my recent acceptance/rejection rate in this session?


RESPECT MY FLOW:

Don't interrupt my coding flow:

- If I'm typing quickly, reduce suggestion frequency
- If I dismiss multiple suggestions in a row, back off significantly
- If I press ESC 3+ times in short succession, STOP suggesting for the next 10-20 lines
- Let me complete my thought before suggesting the next command
- Don't suggest complete multi-step blocks unless I'm clearly repeating a pattern AND have accepted similar blocks before
- If my rejection rate exceeds 70% in a session, become more conservative


PLAYWRIGHT-SPECIFIC AUTOCOMPLETE:

For Playwright tests, suggest ONLY when:

- Completing locator selectors with strategies that match the codebase (CSS, role, text, testId)
- Adding assertions that match the element type (toBeVisible, toHaveText, toHaveCount)
- Following test.step patterns I've already established AND previously accepted
- Using methods that are defined in Playwright's API (click, fill, locator, goto, waitFor)
- Completing expect assertions with correct matchers
- Adding proper await keywords for async operations
- Suggesting config options that are valid for playwright.config.js
- The suggestion type has a good acceptance history in spec files


ADAPTIVE BEHAVIOR:

Adjust suggestion strategy based on patterns:

- High acceptance rate (>70%) in current context → maintain or slightly increase suggestions
- Medium acceptance rate (40-70%) → stay conservative, only high-confidence suggestions
- Low acceptance rate (<40%) → significantly reduce suggestions, only obvious completions
- Consecutive rejections (3+) → pause suggestions temporarily in this file/context

Context-specific learning:

- Track acceptance rates separately for: spec files, config files, reporters, helper scripts
- Remember: "User accepts step completions but rejects multi-line suggestions"
- Learn: "User accepts locator suggestions but rejects assertion suggestions"
- Adapt: "User rejects suggestions in setup code but accepts them in test steps"


FEEDBACK SIGNALS TO TRACK:

Strong positive signals (increase confidence):

- Accepted without modification
- Accepted multiple times for similar patterns
- Accepted quickly (within 1-2 seconds of suggestion appearing)

Strong negative signals (decrease confidence):

- ESC pressed → clear rejection
- Typed over/ignored → mild rejection
- Deleted after accepting → strong rejection, learn to avoid this pattern
- Repeatedly rejected in similar contexts → suppress this suggestion type


RESET & RECOVERY:

Periodically reassess:

- If I explicitly accept a previously-rejected pattern → update confidence
- If codebase patterns change, re-evaluate learned rejections
- Don't let old rejection data prevent good suggestions in new contexts

Clear signal responses:

- If I manually type what you suggested after rejecting → you were right, just bad timing
- If I type something completely different → you were wrong, learn from it


Be helpful but not intrusive. Quality and relevance trump quantity. Learn from every interaction.
