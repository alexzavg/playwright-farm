---
trigger: always_on
---

PLAYWRIGHT LOAD TESTING CODEBASE QUERY WORKFLOW

Whenever I ask you a code question related to this Playwright load testing codebase or reference specific tests:

INITIAL SETUP ANALYSIS (DO THIS ONCE AT SESSION START):

Scan and memorize the core project structure:

- playwright.config.js: test settings, workers, timeouts, reporters
- package.json: scripts, dependencies, npm commands
- tests/ directory: spec files and their purposes
- scripts/ directory: utility scripts (clean.js, serve-dashboard.js)
- reporters/ directory: custom reporter implementations
- Directory structure: where tests, utilities, and outputs live

Identify and remember established patterns:

- Primary locator strategy preferences (CSS, role, testId, text)
- Test step patterns and naming conventions
- Wait and assertion strategies
- Dashboard generation patterns
- Test data management strategy
- Utility script usage patterns

Note and cache:

- Common locators and their reliability
- Shared utilities and their locations
- Environment variables and their usage
- Naming conventions for tests, steps, and files
- Site-specific quirks (loading delays, dynamic content)


SUBSEQUENT QUERIES (REFERENCE CACHED KNOWLEDGE):

- Don't re-scan configuration files unless asked or if changes are suspected
- Use memorized patterns and structure for faster responses
- Only scan specific tests relevant to the current question
- Reference the cached setup when explaining why certain approaches fit the codebase


CONTEXT GATHERING (FOR SPECIFIC QUERIES):

Analyze the current spec file containing the referenced code

Trace and examine ALL dependencies:

- Utility scripts used
- Custom reporter functions
- Locator strategies used
- Environment variables used
- Test data files or inline data
- Configuration options applied

Search the codebase for:

- Similar test patterns or implementations
- Existing locators for the same pages
- Reusable utilities
- Helper functions
- Test data patterns
- Similar step sequences

Check critical files ONLY if not already cached or if relevant to the specific question:

- playwright.config.js (test settings, workers, reporters)
- package.json (scripts, dependencies)
- Custom reporter definitions
- Utility script files

Identify the project structure (test organization, naming conventions, output locations)


PLAYWRIGHT-SPECIFIC ANALYSIS:

Understand the test architecture:

- Single spec vs. multiple spec organization
- Test step patterns and atomicity
- Setup and teardown strategies
- Parallel execution considerations (fullyParallel, workers)

Note established patterns for:

- Locator strategies (CSS selectors, role-based, text-based)
- Wait strategies (expect with timeout, waitFor methods)
- Test data management (inline vs. external)
- Navigation patterns (goto, click sequences)
- Form interactions (fill, click, select)
- Assertions (toBeVisible, toHaveText, toHaveCount)

Check for custom extensions and helpers:

- Custom reporter functions (funnel-reporter.js)
- Utility scripts (clean.js, serve-dashboard.js)
- Dashboard generation logic
- Environment-specific configurations


CODE SOLUTION PRINCIPLES (CRITICAL):

ALL test solutions MUST BE:

- AS SIMPLE AS POSSIBLE - avoid over-engineering
- AS CONCISE AS POSSIBLE - minimal code
- EFFECTIVE - solves the problem completely
- READABLE - clear JavaScript with appropriate structure
- STABLE - uses reliable locators and proper waits

Prefer:

- Built-in Playwright methods over complex workarounds
- Role-based or testId locators when available
- CSS selectors when unique and stable
- Existing utilities over duplicating code
- Direct approaches over abstracted/complex ones
- Simple assertions over complex validation logic

Avoid:

- Unnecessary complexity when simple methods work
- Verbose or redundant code
- Over-complicated logic when simple approaches work
- Creating new utilities when inline code suffices
- XPath unless absolutely necessary
- Hardcoded waits (use expect with timeout instead)


RESPONSE FORMAT:

Provide clean JavaScript snippets WITHOUT inline comments

Separate all explanations, commentary, and reasoning into distinct sections OUTSIDE the code blocks

When suggesting tests or modifications, show:

- Current implementation (if modifying)
- Proposed changes with clear before/after
- Required dependencies or imports
- Configuration changes needed

Explain:

- WHY this approach fits the existing test patterns (reference cached patterns)
- WHY this is the simplest effective solution
- How it handles flakiness/stability (timing, network delays)
- Any timeout or wait considerations
- Locator strategy rationale (why this selector is stable)

Highlight:

- Dependencies on config settings (reference cached config)
- Potential race conditions or timing issues
- Breaking changes to existing tests or utilities
- Areas needing test coverage


PLAYWRIGHT BEST PRACTICES:

Follow established patterns (use cached knowledge):

- Match existing locator strategy preferences
- Use the same step patterns already in use
- Respect test structure and naming conventions
- Follow existing assertion patterns
- Mirror navigation and interaction patterns

Prefer Playwright best practices:

- expect() with built-in waiting over explicit waits
- Role-based locators (getByRole) when possible
- Test isolation (each test independent)
- Meaningful step names for debugging
- Trace and screenshot on failure

Consider:

- Test isolation and independence
- Parallel execution safety
- Cross-browser compatibility (if configured)
- Network conditions and loading states
- Site-specific timing quirks


CONSISTENCY:

Match JavaScript patterns (reference cached conventions):

- Test structure and organization
- Step naming conventions
- Locator strategy preferences
- Error handling approach
- Variable naming

Point out if your suggestion deviates from established patterns and explain why it's beneficial


CACHE INVALIDATION:

- If I mention configuration changes, re-scan the relevant config files
- If I say "things have changed" or "we refactored", ask what changed and update cached knowledge
- If I mention site updates, ask about UI changes that might affect locators
- Periodically confirm: "Should I re-scan the tests?" if the conversation spans multiple days


ADDITIONAL INFORMATION REQUESTS:

If context is insufficient, explicitly state what additional files (tests, utilities, config) or information you need to analyze:

- "Which page/funnel does this test cover?"
- "Are there existing utilities for [this action]?"
- "What locators are available for this page?"
- "Are there any known issues with this site?"
