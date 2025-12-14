---
trigger: always_on
---

PLAYWRIGHT DOCUMENTATION & BEST PRACTICES REFERENCE REQUIREMENT

MANDATORY DOCUMENTATION CHECK BEFORE RESPONDING:

ALWAYS consult Playwright documentation FIRST before providing any answer related to:

- Playwright API methods and their syntax
- Locator strategies and selectors
- Test structure and capabilities
- Assertions and expect matchers
- Playwright CLI usage and options
- Configuration options (playwright.config.js)
- Browser context and page handling
- Best practices and recommendations

Primary documentation sources to reference:

- Official Playwright documentation at https://playwright.dev
- Playwright GitHub repository and examples
- Playwright API reference docs
- Playwright best practices guides
- Community-recommended patterns

When to check documentation:

- Before suggesting any Playwright API method or syntax
- When asked "how do I..." questions
- When proposing solutions to problems
- When explaining Playwright features or capabilities
- When debugging test issues
- When optimizing existing tests
- When uncertain about method behavior or parameters


DOCUMENTATION-FIRST WORKFLOW:

For every Playwright-related query:

- Step 1: Search/reference Playwright docs for the relevant API, feature, or pattern
- Step 2: Verify the syntax, parameters, and recommended usage
- Step 3: Check for best practices or common pitfalls mentioned in docs
- Step 4: Formulate answer based on official documentation
- Step 5: Apply cached codebase patterns that align with documented best practices

Explicitly mention when referencing docs:

- "According to Playwright documentation..."
- "Playwright best practices recommend..."
- "The official docs show that..."
- "Playwright's documentation suggests..."


WHAT TO VERIFY IN DOCUMENTATION:

API syntax and parameters:

- Exact method signatures and return types
- Required vs. optional parameters
- Parameter types and valid values
- Method availability and deprecations

Best practices:

- Recommended locator strategies (role, testId, text)
- Proper wait and assertion patterns
- Test organization recommendations
- Performance optimization techniques
- Stability and reliability patterns

Browser differences:

- Chromium-specific behaviors documented
- Firefox-specific behaviors documented
- WebKit-specific behaviors documented
- Cross-browser compatibility notes

Advanced features:

- Trace viewer capabilities
- Network interception
- Multiple browser contexts
- Parallel execution patterns
- Custom fixtures and hooks


WHEN DOCUMENTATION IS UNCLEAR OR MISSING:

If documentation doesn't cover the specific scenario:

- Clearly state: "This specific case isn't explicitly documented in Playwright docs"
- Suggest the closest documented pattern
- Base suggestion on general Playwright principles from docs
- Recommend testing the approach in a safe environment
- Suggest checking Playwright GitHub issues or discussions

If documentation conflicts with cached codebase patterns:

- Prioritize documentation best practices
- Explain the conflict: "The docs recommend X, but I see your codebase uses Y"
- Suggest: "Would you like to align with the documented best practice, or maintain consistency with existing patterns?"


STAY UPDATED:

Be aware that Playwright is actively developed:

- Note when suggesting potentially version-specific features
- Recommend checking the latest docs if behavior seems unexpected
- Acknowledge when features might be newer or experimental
- Suggest verifying Playwright version compatibility (check package.json)


DOCUMENTATION INTEGRATION WITH OTHER INSTRUCTIONS:

Combine documentation guidance with:

- Cached codebase patterns (prioritize doc best practices)
- Simplicity principles (use documented simple approaches)
- Context memory (apply documented patterns consistently)
- File modification permissions (suggest doc-aligned changes only when approved)

Quality hierarchy for answers:

- Tier 1: Official Playwright documentation + your cached codebase patterns
- Tier 2: Official docs + general best practices (if no codebase pattern exists)
- Tier 3: Documented principles + logical inference (if exact scenario not documented)
- Never: Pure speculation without documentation basis


PROACTIVE DOCUMENTATION SHARING:

When helpful, include:

- Relevant documentation links
- "For more details, see: [Playwright docs URL]"
- References to specific documentation sections
- Suggestions to bookmark frequently used doc pages


CRITICAL RULE: Never provide Playwright-specific advice, commands, or patterns without first consulting or referencing the official Playwright documentation. Documentation-based answers ensure accuracy, promote best practices, and prevent suggesting unsupported or deprecated features.
