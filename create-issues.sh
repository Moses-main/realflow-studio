#!/bin/bash

# Batch create GitHub issues

cd /home/moses/Desktop/Hackathons/realflow-studio

# Issue 2
gh issue create --title "ISSUE-002: Remove duplicate type declarations in main.tsx" --body "## Issue
Duplicate type declarations for \`ImportMetaEnv\` and \`ImportMeta\` exist in \`main.tsx\` (lines 40-48) but are already defined in \`vite-env.d.ts\`.

## Files
- \`src/main.tsx\` (lines 40-48)

## Action
Remove the redundant type declarations from main.tsx.

## Acceptance Criteria
- [ ] Remove duplicate type declarations
- [ ] Ensure no type errors after removal" --label "good first issue"

# Issue 3
gh issue create --title "ISSUE-003: Remove unused imports across all pages" --body "## Issue
Multiple unused imports exist across the codebase:

| File | Unused Import |
|------|--------------|
| \`src/pages/Index.tsx\` | \`usePrivy\` |
| \`src/pages/Builder.tsx\` | \`Sparkles\` |
| \`src/pages/Analytics.tsx\` | \`TrendingDown\` |
| \`src/pages/Settings.tsx\` | \`SettingsIcon, Shield, HelpCircle\` |
| \`src/pages/Explore.tsx\` | \`Heart\` |
| \`src/components/layout/Sidebar.tsx\` | \`User\` |
| \`src/components/builder/AISidebar.tsx\` | \`ChevronDown, ChevronUp\` |

## Action
Remove all unused imports from these files.

## Acceptance Criteria
- [ ] All unused imports removed
- [ ] No build errors" --label "good first issue"

# Issue 4
gh issue create --title "ISSUE-004: Replace hardcoded mock data with dynamic data sources" --body "## Issue
The application contains extensive hardcoded mock data that should be replaced with dynamic data:

### Hardcoded Arrays
1. \`src/pages/Dashboard.tsx\` - templates and recentMarketplaces arrays
2. \`src/pages/MarketplaceList.tsx\` - mockMarketplaces array
3. \`src/pages/Analytics.tsx\` - stats, volumeData, assetBreakdown arrays
4. \`src/pages/Explore.tsx\` - featuredMarketplaces array
5. \`src/pages/Index.tsx\` - hero stats
6. \`src/pages/Builder.tsx\` - initialNodes and initialEdges
7. \`src/components/builder/AISidebar.tsx\` - suggestions array

### Action
Create proper state management or API integration to fetch dynamic data instead of using mock arrays.

## Acceptance Criteria
- [ ] Mock data replaced with dynamic sources
- [ ] Loading states added for async data
- [ ] Error states handled gracefully" --label "enhancement"

# Issue 5
gh issue create --title "ISSUE-005: Add null checks for wallet address operations" --body "## Issue
Multiple places call methods on \`address\` without null checks, which could cause crashes:

| File | Line | Issue |
|------|------|-------|
| \`src/pages/Dashboard.tsx\` | 110 | \`user.address.slice(2,4)\` |
| \`src/pages/Index.tsx\` | 78 | \`address.slice(0, 6)\` |
| \`src/pages/Builder.tsx\` | 129 | \`user.address\` sent to API |

## Action
Add proper null checks and optional chaining where addresses are used.

## Acceptance Criteria
- [ ] All address operations have null checks
- [ ] No runtime errors when wallet not connected" --label "bug"

# Issue 6
gh issue create --title "ISSUE-006: Add proper error handling to Settings form" --body "## Issue
The Settings page profile form has no validation or save functionality. The 'Save Changes' button does nothing.

## Files
- \`src/pages/Settings.tsx\` (lines 98-118)

## Action
Implement form validation and save functionality that persists settings to localStorage or an API.

## Acceptance Criteria
- [ ] Form validation for all fields
- [ ] Save button actually persists data
- [ ] Success/error feedback shown to user" --label "enhancement"

# Issue 7
gh issue create --title "ISSUE-007: Implement Settings wallet buttons functionality" --body "## Issue
The Settings page has 'View on Explorer' and 'Disconnect' buttons that are non-functional.

## Files
- \`src/pages/Settings.tsx\` (lines 149-151)

## Action
Wire up these buttons to their respective functions.

## Acceptance Criteria
- [ ] 'View on Explorer' opens Polygonscan
- [ ] 'Disconnect' properly disconnects wallet" --label "bug"

# Issue 8
gh issue create --title "ISSUE-008: Fix random user count in Explore page" --body "## Issue
The Explore page uses \`Math.floor(Math.random() * 500) + 100\` for user count on every render, causing the number to change constantly.

## Files
- \`src/pages/Explore.tsx\` (line 243)

## Action
Use a stable value or fetch from API instead of random.

## Acceptance Criteria
- [ ] User count remains stable
- [ ] Values come from proper data source" --label "bug"

# Issue 9
gh issue create --title "ISSUE-009: Add accessibility attributes to interactive elements" --body "## Issue
Missing accessibility attributes across the codebase:

1. \`src/pages/Index.tsx\` - Logo missing aria-label
2. \`src/pages/Builder.tsx\` - React Flow canvas missing aria-label
3. \`src/components/builder/ComponentPalette.tsx\` - Draggable items missing ARIA attributes
4. \`src/pages/Builder.tsx\` - Toggle button missing aria-expanded/aria-controls
5. \`src/pages/NotFound.tsx\` - Uses \`<a>\` instead of \`<Link>\` for internal navigation

## Action
Add proper ARIA attributes and use React Router's Link component.

## Acceptance Criteria
- [ ] All interactive elements have proper ARIA labels
- [ ] Internal navigation uses Link component
- [ ] Passes accessibility audit" --label "accessibility"

# Issue 10
gh issue create --title "ISSUE-010: Memoize expensive computations in Analytics and Explore" --body "## Issue
Performance concerns due to unoptimized computations:

1. \`src/pages/Explore.tsx\` - Sorting/filtering on every render
2. \`src/pages/Analytics.tsx\` - \`Math.max(...)\` computed every render

## Action
Use React.useMemo for expensive computations.

## Acceptance Criteria
- [ ] Computations memoized
- [ ] No unnecessary re-renders" --label "performance"

# Issue 11
gh issue create --title "ISSUE-011: Add loading states to MarketplaceList delete action" --body "## Issue
The delete menu item in MarketplaceList has no handler.

## Files
- \`src/pages/MarketplaceList.tsx\` (lines 116-119)

## Action
Implement delete functionality with confirmation dialog.

## Acceptance Criteria
- [ ] Delete button shows confirmation
- [ ] Marketplace removed after confirmation
- [ ] Loading state during deletion" --label "enhancement"

# Issue 12
gh issue create --title "ISSUE-012: Add request timeout to AI service" --body "## Issue
No timeout specified for fetch requests in AI service, which could hang indefinitely.

## Files
- \`src/services/ai.ts\` (lines 47-62)

## Action
Add AbortController with timeout for fetch requests.

## Acceptance Criteria
- [ ] Requests timeout after reasonable period
- [ ] User sees timeout error message" --label "bug"

# Issue 13
gh issue create --title "ISSUE-013: Add request timeout to IPFS service" --body "## Issue
No timeout specified for Pinata API fetch requests.

## Files
- \`src/services/ipfs.js\` (lines 85-98)

## Action
Add timeout for Pinata API calls.

## Acceptance Criteria
- [ ] Requests timeout appropriately
- [ ] Error handling for timeouts" --label "bug"

# Issue 14
gh issue create --title "ISSUE-014: Fix CORS fallback to wildcard" --body "## Issue
Backend CORS falls back to \`*\` (allow all origins) if CORS_ORIGIN is not set.

## Files
- \`backend/src/server.js\` (lines 15-18)

## Action
Fail fast if CORS_ORIGIN is not set in production.

## Acceptance Criteria
- [ ] Server fails to start without CORS_ORIGIN in production
- [ ] Clear error message about missing config" --label "security"

# Issue 15
gh issue create --title "ISSUE-015: Add validation for estimate-deployment route" --body "## Issue
The \`estimate-deployment\` route accepts any string as \`contractType\` without validation.

## Files
- \`backend/src/routes/web3.js\` (lines 65-73)

## Action
Add Zod schema validation for contractType.

## Acceptance Criteria
- [ ] Only valid contract types accepted
- [ ] Clear error for invalid types" --label "security"

# Issue 16
gh issue create --title "ISSUE-016: Add validation for IPFS CID parameters" --body "## Issue
No validation that CID is a valid IPFS CID format in metadata and pin routes.

## Files
- \`backend/src/routes/ipfs.js\` (lines 28-36, 38-46)

## Action
Add CID format validation using regex or library.

## Acceptance Criteria
- [ ] Valid CID format required
- [ ] Rejection of invalid CIDs" --label "security"

# Issue 17
gh issue create --title "ISSUE-017: Fix schema key mismatch in balance route" --body "## Issue
The schema expects \`tokenAddress\` but query param is \`token\`, and validated values are discarded.

## Files
- \`backend/src/routes/web3.js\` (lines 39-53)

## Action
Fix the mapping and use validated values.

## Acceptance Criteria
- [ ] Schema and params match
- [ ] Validated values used throughout" --label "bug"

# Issue 18
gh issue create --title "ISSUE-018: Add connection retry for IPFS client" --body "## Issue
If IPFS client creation fails, it keeps returning the failed/null client with no retry mechanism.

## Files
- \`backend/src/services/ipfs.js\` (lines 3-29)

## Action
Implement retry logic for client creation.

## Acceptance Criteria
- [ ] Retry on failure
- [ ] Clear error after max retries" --label "bug"

# Issue 19
gh issue create --title "ISSUE-019: Add graceful shutdown to backend server" --body "## Issue
No SIGTERM/SIGINT handlers for graceful shutdown.

## Files
- \`backend/src/server.js\` (lines 44-47)

## Action
Add process signal handlers for graceful shutdown.

## Acceptance Criteria
- [ ] Handles SIGTERM/SIGINT
- [ ] Completes in-flight requests
- [ ] Closes connections properly" --label "enhancement"

# Issue 20
gh issue create --title "ISSUE-020: Add request logging middleware" --body "## Issue
No request logging middleware (morgan, pino, etc.).

## Files
- \`backend/src/server.js\`

## Action
Add request logging for debugging and monitoring.

## Acceptance Criteria
- [ ] All requests logged
- [ ] Logs include method, path, status, duration" --label "enhancement"

# Issue 21
gh issue create --title "ISSUE-021: Add 404 handler for unknown routes" --body "## Issue
No route for handling 404 (endpoint not found) errors.

## Files
- \`backend/src/server.js\`

## Action
Add catch-all route for 404 responses.

## Acceptance Criteria
- [ ] Unknown routes return 404
- [ ] Proper JSON error response" --label "enhancement"

# Issue 22
gh issue create --title "ISSUE-022: Lower JSON body size limit" --body "## Issue
10MB JSON body limit could allow DoS attacks.

## Files
- \`backend/src/server.js\` (line 29)

## Action
Lower limit to 1MB or similar reasonable value.

## Acceptance Criteria
- [ ] Limit reduced
- [ ] Large payloads rejected" --label "security"

# Issue 23
gh issue create --title "ISSUE-023: Add response compression middleware" --body "## Issue
No compression middleware. Large AI-generated code responses could be slow.

## Files
- \`backend/src/server.js\`

## Action
Add compression middleware (e.g., express-compression).

## Acceptance Criteria
- [ ] Responses compressed
- [ ] Works with all content types" --label "performance"

# Issue 24
gh issue create --title "ISSUE-024: Fix non-indexed name parameter in MarketplaceCreated event" --body "## Issue
The \`name\` parameter should be indexed in \`MarketplaceCreated\` event for better off-chain filtering.

## Files
- \`contracts/src/MarketplaceFactory.sol\` (line 10)

## Action
Add \`indexed\` keyword to \`name\` parameter.

## Acceptance Criteria
- [ ] \`name\` indexed in event
- [ ] Tests pass" --label "enhancement"

# Issue 25
gh issue create --title "ISSUE-025: Add pausable functionality to contracts" --body "## Issue
No emergency stop mechanism for contracts.

## Files
- \`contracts/src/RWATokenizer.sol\`
- \`contracts/src/MarketplaceFactory.sol\`

## Action
Implement pausable functionality using OpenZeppelin.

## Acceptance Criteria
- [ ] Contracts can be paused
- [ ] Owner can pause/unpause
- [ ] All state-changing functions respect pause" --label "security"

# Issue 26
gh issue create --title "ISSUE-026: Add zero address validation to mintRWA" --body "## Issue
No validation that \`to != address(0)\` in mintRWA.

## Files
- \`contracts/src/RWATokenizer.sol\` (line 39-44)

## Action
Add zero address check.

## Acceptance Criteria
- [ ] Reverts for zero address
- [ ] Test coverage" --label "security"

# Issue 27
gh issue create --title "ISSUE-027: Add amount validation to mintRWA" --body "## Issue
No check for \`amount > 0\` in mintRWA.

## Files
- \`contracts/src/RWATokenizer.sol\` (line 42)

## Action
Add amount > 0 validation.

## Acceptance Criteria
- [ ] Reverts for zero amount
- [ ] Test coverage" --label "bug"

# Issue 28
gh issue create --title "ISSUE-028: Remove duplicate owner check in mintRWA" --body "## Issue
Owner check is performed twice redundantly in mintRWA function.

## Files
- \`contracts/src/RWATokenizer.sol\` (lines 45-47 and 50-52)

## Action
Remove the duplicate check.

## Acceptance Criteria
- [ ] Single owner check remains
- [ ] Functionality unchanged" --label "cleanup"

# Issue 29
gh issue create --title "ISSUE-029: Add comprehensive NatSpec documentation" --body "## Issue
Incomplete NatSpec comments throughout contracts.

## Files
- \`contracts/src/RWATokenizer.sol\`
- \`contracts/src/MarketplaceFactory.sol\`

## Action
Add complete NatSpec for all functions.

## Acceptance Criteria
- [ ] All functions documented
- [ ] Events documented
- [ ] Matches code accurately" --label "documentation"

# Issue 30
gh issue create --title "ISSUE-030: Add zero amount test case" --body "## Issue
Missing test for minting with \`amount = 0\`.

## Files
- \`contracts/test/RWATokenizer.t.sol\`

## Action
Add test case for zero amount minting.

## Acceptance Criteria
- [ ] Test exists
- [ ] Test passes" --label "testing"

# Issue 31
gh issue create --title "ISSUE-031: Add zero address test case" --body "## Issue
Missing test for minting to \`address(0)\`.

## Files
- \`contracts/test/RWATokenizer.t.sol\`

## Action
Add test case for zero address minting.

## Acceptance Criteria
- [ ] Test exists
- [ ] Test passes" --label "testing"

# Issue 32
gh issue create --title "ISSUE-032: Add MarketplaceFactory tests" --body "## Issue
No tests exist for MarketplaceFactory.sol.

## Files
- \`contracts/test/RWATokenizer.t.sol\`

## Action
Create comprehensive tests for MarketplaceFactory.

## Acceptance Criteria
- [ ] Create marketplace tested
- [ ] Owner functions tested
- [ ] Event emissions tested" --label "testing"

# Issue 33
gh issue create --title "ISSUE-033: Add batch minting function" --body "## Issue
No batch mint function for efficiency.

## Files
- \`contracts/src/RWATokenizer.sol\`

## Action
Add \`mintRWA_Batch()\` function for multiple tokens.

## Acceptance Criteria
- [ ] Function added
- [ ] Tests pass
- [ ] Gas optimized" --label "enhancement"

# Issue 34
gh issue create --title "ISSUE-034: Add input length limits to contracts" --body "## Issue
No max length validation for \`name\` and \`metadataURI\`.

## Files
- \`contracts/src/MarketplaceFactory.sol\` (line 16)
- \`contracts/src/RWATokenizer.sol\` (line 43)

## Action
Add reasonable length limits.

## Acceptance Criteria
- [ ] Reverts for oversized inputs
- [ ] Tests pass" --label "security"

# Issue 35
gh issue create --title "ISSUE-035: Add marketplace registry to factory" --body "## Issue
No registry of created marketplaces - cannot enumerate all created marketplaces.

## Files
- \`contracts/src/MarketplaceFactory.sol\`

## Action
Add array to track created marketplaces.

## Acceptance Criteria
- [ ] Track all created marketplaces
- [ ] Getter function added" --label "enhancement"

# Issue 36
gh issue create --title "ISSUE-036: Add KYC/verification mechanism" --body "## Issue
No KYC/AML verification mechanism for regulatory compliance.

## Files
- \`contracts/src/RWATokenizer.sol\`

## Action
Design and implement verification registry.

## Acceptance Criteria
- [ ] Can verify addresses
- [ ] Transfers restricted to verified addresses" --label "enhancement"

# Issue 37
gh issue create --title "ISSUE-037: Add reentrancy guards to contracts" --body "## Issue
No ReentrancyGuard despite external calls.

## Files
- All contracts

## Action
Add OpenZeppelin ReentrancyGuard.

## Acceptance Criteria
- [ ] Guards added
- [ ] Tests pass" --label "security"

# Issue 38
gh issue create --title "ISSUE-038: Fix non-functional Settings save button" --body "## Issue
Profile form save button does nothing.

## Files
- \`src/pages/Settings.tsx\`

## Action
Implement form submission handler.

## Acceptance Criteria
- [ ] Saves to localStorage/API
- [ ] Shows success feedback" --label "bug"

# Issue 39
gh issue create --title "ISSUE-039: Add proper wallet connection state on deploy" --body "## Issue
Wallet connection prompts but doesn't ensure actual connection before deploying.

## Files
- \`src/pages/Builder.tsx\` (lines 108-117)

## Action
Wait for confirmed connection before proceeding.

## Acceptance Criteria
- [ ] Confirms wallet is connected
- [ ] Shows appropriate loading state" --label "bug"

# Issue 40
gh issue create --title "ISSUE-040: Fix malformed CSS class reference" --body "## Issue
\`animate-pulse-glow\` class doesn't exist in Index.tsx.

## Files
- \`src/pages/Index.tsx\` (lines 90-95)

## Action
Use valid animation class.

## Acceptance Criteria
- [ ] Valid animation class used
- [ ] Visual effect works" --label "bug"

# Issue 41
gh issue create --title "ISSUE-041: Add validation to AI generate-code endpoint" --body "## Issue
Missing validation for empty/whitespace description.

## Files
- \`backend/src/routes/ai.js\` (lines 7-11)

## Action
Add whitespace trimming and validation.

## Acceptance Criteria
- [ ] Empty strings rejected
- [ ] Whitespace-only rejected" --label "security"

# Issue 42
gh issue create --title "ISSUE-042: Fix inconsistent network enum in schema" --body "## Issue
Schema restricts network to 3 options but code supports more.

## Files
- \`backend/src/routes/web3.js\`

## Action
Update schema to match supported networks.

## Acceptance Criteria
- [ ] Schema includes all supported networks
- [ ] Consistent across codebase" --label "bug"

# Issue 43
gh issue create --title "ISSUE-043: Add proper error context in services" --body "## Issue
Original errors are logged but then generic errors thrown, losing context.

## Files
- \`backend/src/services/web3.js\`
- \`backend/src/services/ipfs.js\`
- \`backend/src/services/ai.js\`

## Action
Include original error in thrown errors.

## Acceptance Criteria
- [ ] Error context preserved
- [ ] Better debugging" --label "enhancement"

# Issue 44
gh issue create --title "ISSUE-044: Check response.ok in Pinata API calls" --body "## Issue
No check if \`response.ok\` is true before parsing JSON.

## Files
- \`backend/src/services/ipfs.js\` (lines 100-101)

## Action
Check response status before parsing.

## Acceptance Criteria
- [ ] Error responses handled
- [ ] Success only returned for OK responses" --label "bug"

# Issue 45
gh issue create --title "ISSUE-045: Add supply cap per token" --body "## Issue
No maximum supply limit per token ID.

## Files
- \`contracts/src/RWATokenizer.sol\`

## Action
Add configurable max supply per token.

## Acceptance Criteria
- [ ] Supply cap enforced
- [ ] Owner can set cap" --label "enhancement"

# Issue 46
gh issue create --title "ISSUE-046: Add fuzz/property-based tests" --body "## Issue
No property-based/fuzz testing.

## Files
- \`contracts/test/RWATokenizer.t.sol\`

## Action
Add fuzz tests for key functions.

## Acceptance Criteria
- [ ] Fuzz tests added
- [ ] Properties verified" --label "testing"

# Issue 47
gh issue create --title "ISSUE-047: Remove misleading error handler in factory route" --body "## Issue
Factory route has error handler that will never catch anything.

## Files
- \`backend/src/routes/web3.js\` (lines 56-63)

## Action
Remove unnecessary try-catch.

## Acceptance Criteria
- [ ] Code simplified
- [ ] No behavior change" --label "cleanup"

# Issue 48
gh issue create --title "ISSUE-048: Add integration tests for cross-contract calls" --body "## Issue
No tests for cross-contract interactions.

## Files
- \`contracts/test/\`

## Action
Add integration tests for factory -> tokenizer interaction.

## Acceptance Criteria
- [ ] Cross-contract tests added
- [ ] Tests pass" --label "testing"

# Issue 49
gh issue create --title "ISSUE-049: Use custom errors throughout contracts" --body "## Issue
Mix of custom errors and require statements.

## Files
- \`contracts/src/RWATokenizer.sol\`

## Action
Standardize to custom errors throughout.

## Acceptance Criteria
- [ ] All errors are custom
- [ ] Gas optimized" --label "enhancement"

# Issue 50
gh issue create --title "ISSUE-050: Add missing SPDX license identifier" --body "## Issue
Missing \`// SPDX-License-Identifier: MIT\` in file.

## Files
- \`contracts/src/RWATokenizer.sol\` (line 1)

## Action
Add license identifier.

## Acceptance Criteria
- [ ] License added
- [ ] Compiles without warnings" --label "documentation"

echo "Created issues 1-50"
