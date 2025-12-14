---
trigger: always_on
---

PERIODIC COMPLETE CODEBASE SCAN & KNOWLEDGE BASE REFRESH FOR PLAYWRIGHT LOAD TESTING

INITIAL COMPLETE SCAN (PERFORM IMMEDIATELY UPON FIRST INTERACTION):

Scan EVERY file in the project repository:

- All Playwright spec files (*.spec.js in tests/)
- All helper/utility scripts (scripts/)
- All reporter files (reporters/)
- All configuration files (playwright.config.js, package.json)
- All documentation files (README.md, docs/)
- All CI/CD configuration (.github/workflows/, .gitlab-ci.yml)
- All test data files (JSON, CSV, fixtures)
- All output directories structure (report/, test-results/)
- All directories and their structure

Build complete dependency graph:

- Map all test files and their relationships
- Identify shared utilities and helpers
- Track custom reporter dependencies
- Note external script dependencies
- Map environment variable usage across tests
- Track baseURL and target site configurations

Catalog all code entities:

- All test definitions with their names and purposes
- All test.step definitions and their atomic actions
- All locator strategies used (CSS, role, text, testId)
- All custom reporter functions and their outputs
- All utility scripts and their purposes
- All dashboard generation logic
- All configuration options and their values

Analyze code patterns and conventions:

- Naming conventions for tests, steps, and variables
- Common test patterns and idioms used
- Testing strategies (load testing, parallel execution)
- Error handling approaches in tests
- Wait and retry strategies
- Locator selection strategies
- Navigation and interaction patterns

Document project structure:

- Directory hierarchy and organization logic
- How tests are organized (by feature, by site, by funnel)
- Shared vs. feature-specific locations
- Output and artifact locations (report/, test-results/)

Index content for fast retrieval:

- Create searchable index of all tests and steps
- Map all locators to their tests
- Catalog all custom reporter functionality
- Track all configuration options
- Index all utility functions and their purposes


WHAT TO MEMORIZE FROM COMPLETE SCAN:

Core knowledge to retain:

- Complete file tree structure
- All test dependencies and relationships
- All available utility scripts (name, location, purpose)
- All test.step patterns (name, location, actions)
- All locator strategies and their contexts
- All environment variables and configuration
- All output locations and structures
- Common patterns: how tests are structured, how steps are named

Interconnection mapping:

- Which tests use which utilities
- Which tests share similar patterns
- Which scripts depend on specific environment variables
- Which are "entry points" (main npm scripts)
- Which are "utilities" (helper scripts used by many)
- Dependency chains: if I change script X, what's affected
- Which tests target which sites/funnels


INCREMENTAL SCANS (PERFORM AUTOMATICALLY):

Trigger incremental scans when:

- New spec files are created
- Files are renamed or moved
- Significant refactoring is mentioned by me
- I explicitly say "rescan the codebase" or "refresh your knowledge"
- After major merge/pull from Git
- Every 50-100 messages in a long session
- When I reference a test that's not in your cached knowledge
- When I mention adding new funnels or target sites

Incremental scan process:

- Identify changed/new/deleted files since last scan
- Re-scan only affected tests and their direct dependencies
- Update the dependency graph for changed relationships
- Maintain unchanged cached knowledge
- Much faster than full scan, but keeps knowledge fresh


SCHEDULED DEEP SCANS:

Perform full re-scan periodically:

- Every 24 hours of active usage
- At the start of each new day/session
- When I explicitly request: "do a full codebase refresh"
- When error rate increases (might indicate stale knowledge)
- After adding new target sites or funnels

Deep scan includes:

- Re-verify all file locations and structures
- Re-analyze all test dependencies
- Update all cached patterns and conventions
- Identify new test patterns that have emerged
- Remove knowledge about deleted tests
- Update knowledge about refactored locators


SCAN OPTIMIZATION:

Make scans efficient:

- Cache parsed JS structures for unchanged files
- Use file modification timestamps to skip unchanged files
- Parallelize scanning when possible
- Prioritize frequently-used tests in incremental scans
- Index strategically for fast lookup

Balance thoroughness vs. speed:

- Initial scan: thorough, no shortcuts
- Incremental scans: fast, targeted
- Deep scans: thorough but leverage cached data where valid


KNOWLEDGE BASE STRUCTURE:

Organize scanned knowledge for easy retrieval:

- Test index: path → contents, steps used, dependencies
- Step index: step name → tests that use it
- Locator index: selector → tests that reference it
- Script index: script → [scripts it depends on, scripts that depend on it]
- Pattern library: recognized patterns → where they're used
- Config catalog: option → current value, where it's used

Cross-reference everything:

- From a test, instantly know which utilities and steps it uses
- From a utility script, instantly know which tests use it
- From a locator, instantly know which tests interact with it
- From a config option, instantly know which tests depend on it


USING SCANNED KNOWLEDGE:

Leverage complete knowledge for better assistance:

- Answer "where is X defined?" instantly
- Suggest existing utilities before creating new ones
- Identify all tests affected by a locator change
- Find similar implementations across the codebase
- Detect inconsistencies or pattern violations
- Provide accurate autocomplete based on actual available tests and commands

Proactive insights from scan data:

- "I notice we have 3 similar step patterns, should we consolidate?"
- "This locator exists in 2 places with different strategies"
- "This utility script is unused - consider removing?"
- "This test has no dependencies - isolated test case"
- "This funnel step has no test coverage yet"
- "These tests all target the same site - consider organizing into a suite"


SCAN PROGRESS & TRANSPARENCY:

Communicate scan status:

- Initial scan: "Performing initial complete codebase scan..."
- Show progress for long scans: "Scanned X/Y spec files..."
- Completion: "Scan complete. Indexed X tests, Y steps, Z locators"
- Incremental: "Detected 3 new tests, updating knowledge base..."

Allow scan control:

- Respect if I say "skip the scan for now"
- Let me trigger manual scans: "scan the codebase now"
- Let me request specific scans: "rescan just the tests folder"


GIT INTEGRATION AWARENESS:

Consider Git workflow:

- After I mention pulling/merging branches, offer to rescan
- If I mention working on a different branch, note that context may differ
- Be aware that other team members may have added/changed tests
- Don't assume your cached knowledge is 100% current if significant time has passed


HANDLING LARGE REPOSITORIES:

Scale gracefully:

- If repository is very large (100+ spec files), prioritize main test flows
- For huge repos, focus deep scans on directories I actively work in
- Warn if scan will take >2 minutes
- Allow backgrounding of scans while still being responsive


KNOWLEDGE VALIDATION:

Verify knowledge accuracy:

- If suggesting a test/command that might not exist, verify first
- If unsure whether knowledge is stale, do a quick targeted scan
- If I correct you about codebase structure, trigger rescan of that area
- Track "knowledge misses" (when cached knowledge was wrong) and trigger scans accordingly


FIRST SCAN CHECKLIST (COMPLETE BEFORE FIRST CODE SUGGESTION):

Ensure initial scan captures:

✓ Every *.spec.js test file in the repository
✓ playwright.config.js with all settings
✓ package.json scripts and dependencies
✓ All path configurations and file structures
✓ All test.step definitions and their purposes
✓ All locator strategies used
✓ All custom reporter functions
✓ All utility scripts in scripts/
✓ README.md project structure
✓ CI/CD configuration (if present)
✓ Output directories (report/, test-results/)
✓ Common test patterns and conventions
✓ Wait and timeout strategies used
✓ Navigation and interaction patterns


The goal: Maintain a comprehensive, fresh, and accurate mental model of the entire Playwright load testing setup at all times. Know the project as well as (or better than) a senior QA automation engineer who's worked on it for months.
