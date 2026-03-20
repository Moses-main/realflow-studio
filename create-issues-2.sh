#!/bin/bash

cd /home/moses/Desktop/Hackathons/realflow-studio

# Issue 51
gh issue create --title "ISSUE-051: Add missing contract-level documentation" --body "## Issue
No @title, @notice, or @dev NatSpec comments at contract level.

## Files
- \`contracts/src/MarketplaceFactory.sol\`

## Action
Add comprehensive contract-level NatSpec.

## Acceptance Criteria
- [ ] Contract documented
- [ ] All events documented" --label "documentation"

# Issue 52
gh issue create --title "ISSUE-052: Add initialization function for clones" --body "## Issue
Clones created by factory may not have proper initialization.

## Files
- \`contracts/src/MarketplaceFactory.sol\`

## Action
Add initializer pattern to clones.

## Acceptance Criteria
- [ ] Clones properly initialized
- [ ] Owner set correctly" --label "bug"

# Issue 53
gh issue create --title "ISSUE-053: Move contract addresses to environment variables" --body "## Issue
Contract addresses hardcoded in frontend hooks.

## Files
- \`src/hooks/useRWATokenizer.ts\`
- \`src/hooks/useMarketplaceFactory.ts\`

## Action
Use VITE_ prefixed env vars.

## Acceptance Criteria
- [ ] Addresses from env vars
- [ ] Fallback to current values" --label "security"

# Issue 54
gh issue create --title "ISSUE-054: Add proper error state to Builder deploy" --body "## Issue
After error in deploy, still sets \`deployed = true\` with hardcoded address.

## Files
- \`src/pages/Builder.tsx\` (lines 143-149)

## Action
Only set deployed=true on success.

## Acceptance Criteria
- [ ] Error state shown on failure
- [ ] Success only on actual deployment" --label "bug"

# Issue 55
gh issue create --title "ISSUE-055: Use React Router Link in NotFound page" --body "## Issue
404 page uses \`<a>\` instead of \`<Link>\` for internal navigation.

## Files
- \`src/pages/NotFound.tsx\` (line 16)

## Action
Replace \`<a>\` with \`<Link>\`.

## Acceptance Criteria
- [ ] Uses Link component
- [ ] SPA navigation works" --label "bug"

# Issue 56
gh issue create --title "ISSUE-056: Add loading state to API calls in Builder" --body "## Issue
No loading state shown during API calls.

## Files
- \`src/pages/Builder.tsx\`

## Action
Add proper loading states.

## Acceptance Criteria
- [ ] Loading shown during fetch
- [ ] Error states handled" --label "enhancement"

# Issue 57
gh issue create --title "ISSUE-057: Extract duplicated NavContent component" --body "## Issue
Nav items duplicated in mobile and desktop sidebar.

## Files
- \`src/pages/Dashboard.tsx\`

## Action
Extract to shared component.

## Acceptance Criteria
- [ ] Single source of truth
- [ ] DRY principle followed" --label "refactoring"

# Issue 58
gh issue create --title "ISSUE-058: Add console.warn for recoverable errors" --body "## Issue
console.error used for recoverable errors.

## Files
- \`src/hooks/useAuth.tsx\`

## Action
Use console.warn for recoverable errors.

## Acceptance Criteria
- [ ] Appropriate log levels
- [ ] Better debugging" --label "enhancement"

# Issue 59
gh issue create --title "ISSUE-059: Remove unused connectWallet in Analytics" --body "## Issue
connectWallet destructured but never used.

## Files
- \`src/pages/Analytics.tsx\` (line 35)

## Action
Remove unused variable.

## Acceptance Criteria
- [ ] No linting errors
- [ ] Code compiles" --label "cleanup"

# Issue 60
gh issue create --title "ISSUE-060: Fix memory leak potential in toast hook" --body "## Issue
Listeners array may grow without cleanup guarantee.

## Files
- \`src/hooks/use-toast.ts\` (lines 170-176)

## Action
Ensure proper cleanup on unmount.

## Acceptance Criteria
- [ ] Memory leaks prevented
- [ ] Tests pass" --label "performance"

# Issue 61
gh issue create --title "ISSUE-061: Use useMemo for filtered marketplaces" --body "## Issue
Filtering and sorting happens on every render.

## Files
- \`src/pages/Explore.tsx\` (lines 108-117)

## Action
Use useMemo for filtered results.

## Acceptance Criteria
- [ ] Computations memoized
- [ ] Performance improved" --label "performance"

# Issue 62
gh issue create --title "ISSUE-062: Add proper keyboard handling to AI chat" --body "## Issue
onKeyDown should check for Enter without Shift.

## Files
- \`src/components/builder/AISidebar.tsx\` (line 166)

## Action
Add proper keyboard handling.

## Acceptance Criteria
- [ ] Enter sends message
- [ ] Shift+Enter adds newline" --label "bug"

# Issue 63
gh issue create --title "ISSUE-063: Add animation class for pulse glow" --body "## Issue
animate-pulse-glow class doesn't exist.

## Files
- \`src/pages/Index.tsx\`

## Action
Add custom animation or use existing class.

## Acceptance Criteria
- [ ] Visual effect works
- [ ] No CSS warnings" --label "bug"

# Issue 64
gh issue create --title "ISSUE-064: Add ARIA label to logo" --body "## Issue
Logo missing aria-label.

## Files
- \`src/pages/Index.tsx\` (lines 64-66)

## Action
Add descriptive aria-label.

## Acceptance Criteria
- [ ] Screen reader accessible
- [ ] Passes a11y audit" --label "accessibility"

# Issue 65
gh issue create --title "ISSUE-065: Add aria-label to React Flow canvas" --body "## Issue
React Flow canvas missing aria-label.

## Files
- \`src/pages/Builder.tsx\` (line 62)

## Action
Add descriptive aria-label.

## Acceptance Criteria
- [ ] Canvas labeled
- [ ] Screen reader support" --label "accessibility"

# Issue 66
gh issue create --title "ISSUE-066: Add aria attributes to draggable components" --body "## Issue
Draggable items lack proper ARIA drag attributes.

## Files
- \`src/components/builder/ComponentPalette.tsx\`

## Action
Add role and ARIA attributes.

## Acceptance Criteria
- [ ] ARIA attributes added
- [ ] Drag works with keyboard" --label "accessibility"

# Issue 67
gh issue create --title "ISSUE-067: Add aria-expanded to AI sidebar toggle" --body "## Issue
Toggle button missing aria-expanded and aria-controls.

## Files
- \`src/pages/Builder.tsx\` (lines 307-312)

## Action
Add proper ARIA attributes.

## Acceptance Criteria
- [ ] Button properly labeled
- [ ] State announced" --label "accessibility"

# Issue 68
gh issue create --title "ISSUE-068: Add environment variable validation on startup" --body "## Issue
Server starts without checking required env vars.

## Files
- \`backend/src/server.js\`

## Action
Add startup validation.

## Acceptance Criteria
- [ ] Fails fast on missing vars
- [ ] Clear error messages" --label "enhancement"

# Issue 69
gh issue create --title "ISSUE-069: Add actual gas estimation via RPC" --body "## Issue
Gas estimation returns static hardcoded values.

## Files
- \`backend/src/services/web3.js\` (lines 126-143)

## Action
Make actual RPC calls for gas estimation.

## Acceptance Criteria
- [ ] Accurate estimates
- [ ] Based on actual bytecode" --label "enhancement"

# Issue 70
gh issue create --title "ISSUE-070: Add CSRF protection to API endpoints" --body "## Issue
No CSRF protection for sensitive endpoints.

## Files
- \`backend/src/server.js\`

## Action
Add CSRF token middleware.

## Acceptance Criteria
- [ ] CSRF protection enabled
- [ ] Tokens validated" --label "security"

# Issue 71
gh issue create --title "ISSUE-071: Remove unused test file example.test.ts" --body "## Issue
Example test file should be removed.

## Files
- \`src/test/example.test.ts\`

## Action
Delete the file.

## Acceptance Criteria
- [ ] File removed
- [ ] No references remain" --label "cleanup"

# Issue 72
gh issue create --title "ISSUE-072: Add wallet type null handling" --body "## Issue
walletType may return undefined instead of null.

## Files
- \`src/hooks/useAuth.tsx\` (lines 32-36)

## Action
Ensure consistent null returns.

## Acceptance Criteria
- [ ] Always returns string or null
- [ ] TypeScript happy" --label "bug"

# Issue 73
gh issue create --title "ISSUE-073: Add loading states for contract reads" --body "## Issue
No loading indicators for contract reads.

## Files
- \`src/hooks/useRWATokenizer.ts\`
- \`src/hooks/useMarketplaceFactory.ts\`

## Action
Add loading state to hooks.

## Acceptance Criteria
- [ ] isLoading available
- [ ] UI shows loading state" --label "enhancement"

# Issue 74
gh issue create --title "ISSUE-074: Add error boundaries to pages" --body "## Issue
No error boundaries to catch and display errors.

## Files
- All pages

## Action
Add React error boundaries.

## Acceptance Criteria
- [ ] Errors caught gracefully
- [ ] Recovery UI shown" --label "enhancement"

# Issue 75
gh issue create --title "ISSUE-075: Add proper type for CustomNode data" --body "## Issue
Unchecked type cast for data.componentType.

## Files
- \`src/components/builder/CustomNode.tsx\` (line 42)

## Action
Add proper TypeScript typing.

## Acceptance Criteria
- [ ] Proper types defined
- [ ] No type errors" --label "enhancement"

# Issue 76
gh issue create --title "ISSUE-076: Make API URL validation stricter" --body "## Issue
Empty API URL fallback allows app to run without proper config.

## Files
- \`src/main.tsx\`

## Action
Fail fast when API URL missing.

## Acceptance Criteria
- [ ] Clear error when missing
- [ ] No silent failures" --label "security"

# Issue 77
gh issue create --title "ISSUE-077: Add query client configuration" --body "## Issue
QueryClient created without configuration options.

## Files
- \`src/App.tsx\`

## Action
Add sensible defaults.

## Acceptance Criteria
- [ ] Configured retry logic
- [ ] Better caching" --label "enhancement"

# Issue 78
gh issue create --title "ISSUE-078: Add missing React import in useAuth" --body "## Issue
Missing React import but using hooks.

## Files
- \`src/hooks/useAuth.tsx\`

## Action
Ensure React is imported (for JSX transform compatibility).

## Acceptance Criteria
- [ ] Compatible with all React versions
- [ ] No build warnings" --label "bug"

# Issue 79
gh issue create --title "ISSUE-079: Standardize error messages in services" --body "## Issue
Different error message formats across services.

## Files
- \`backend/src/services/\`

## Action
Create standardized error response format.

## Acceptance Criteria
- [ ] Consistent format
- [ ] Includes error codes" --label "enhancement"

# Issue 80
gh issue create --title "ISSUE-080: Add input sanitization to AI prompts" --body "## Issue
No sanitization of user input in AI prompts.

## Files
- \`backend/src/services/ai.js\`

## Action
Sanitize user input before sending to AI.

## Acceptance Criteria
- [ ] XSS prevention
- [ ] Injection prevention" --label "security"

# Issue 81
gh issue create --title "ISSUE-081: Add pagination for large result sets" --body "## Issue
No pagination for large IPFS content.

## Files
- \`backend/src/services/ipfs.js\`

## Action
Add pagination or streaming.

## Acceptance Criteria
- [ ] Large files handled
- [ ] Memory efficient" --label "performance"

# Issue 82
gh issue create --title "ISSUE-082: Add rate limit per endpoint" --body "## Issue
Single rate limit for all endpoints may not be optimal.

## Files
- \`backend/src/server.js\`

## Action
Implement per-endpoint rate limits.

## Acceptance Criteria
- [ ] AI endpoints more limited
- [ ] Health endpoint unlimited" --label "security"

# Issue 83
gh issue create --title "ISSUE-083: Add health check for dependencies" --body "## Issue
Health endpoint doesn't check external dependencies.

## Files
- \`backend/src/routes/health.js\`

## Action
Check RPC, IPFS, OpenAI connectivity.

## Acceptance Criteria
- [ ] External services checked
- [ ] Status reflects dependencies" --label "enhancement"

# Issue 84
gh issue create --title "ISSUE-084: Add index parameter to events" --body "## Issue
Events should have indexed parameters for filtering.

## Files
- Multiple contracts

## Action
Add indexed to important event params.

## Acceptance Criteria
- [ ] Important fields indexed
- [ ] Off-chain filtering works" --label "enhancement"

# Issue 85
gh issue create --title "ISSUE-085: Add access control to createMarketplace" --body "## Issue
Anyone can create marketplaces despite owner-only intent.

## Files
- \`contracts/src/MarketplaceFactory.sol\`

## Action
Add onlyOwner or role-based access.

## Acceptance Criteria
- [ ] Only authorized can create
- [ ] Tests pass" --label "security"

# Issue 86
gh issue create --title "ISSUE-086: Add TokenTransferred event" --body "## Issue
No custom events for transfers beyond ERC1155 standards.

## Files
- \`contracts/src/RWATokenizer.sol\`

## Action
Add custom transfer events.

## Acceptance Criteria
- [ ] Events emitted
- [ ] Off-chain tracking easier" --label "enhancement"

# Issue 87
gh issue create --title "ISSUE-087: Add whitelist/blacklist for addresses" --body "## Issue
No way to restrict token transfers.

## Files
- \`contracts/src/RWATokenizer.sol\`

## Action
Add access control registry.

## Acceptance Criteria
- [ ] Can whitelist addresses
- [ ] Transfers checked" --label "enhancement"

# Issue 88
gh issue create --title "ISSUE-088: Add configurable IPFS gateway" --body "## Issue
IPFS gateway hardcoded.

## Files
- \`backend/src/services/ipfs.js\`

## Action
Support multiple gateways via config.

## Acceptance Criteria
- [ ] Configurable gateway
- [ ] Fallback support" --label "enhancement"

# Issue 89
gh issue create --title "ISSUE-089: Make marketplace factory upgradeable" --body "## Issue
Immutable implementation address in factory.

## Files
- \`contracts/src/MarketplaceFactory.sol\`

## Action
Add proxy pattern for upgradability.

## Acceptance Criteria
- [ ] Can upgrade implementation
- [ ] Storage preserved" --label "enhancement"

# Issue 90
gh issue create --title "ISSUE-090: Add user profile persistence" --body "## Issue
User profile settings not persisted.

## Files
- \`src/pages/Settings.tsx\`

## Action
Save to localStorage or backend.

## Acceptance Criteria
- [ ] Settings persist
- [ ] Load on mount" --label "enhancement"

# Issue 91
gh issue create --title "ISSUE-091: Add real-time notifications" --body "## Issue
No real-time notifications for tx status.

## Files
- \`src/pages/Builder.tsx\`

## Action
Implement transaction status polling.

## Acceptance Criteria
- [ ] Tx status shown
- [ ] Success/failure feedback" --label "enhancement"

# Issue 92
gh issue create --title "ISSUE-092: Add dark/light theme toggle" --body "## Issue
No theme switching.

## Files
- \`src/pages/Settings.tsx\`

## Action
Implement theme context and toggle.

## Acceptance Criteria
- [ ] Toggle works
- [ ] Preference persisted" --label "enhancement"

# Issue 93
gh issue create --title "ISSUE-093: Add multi-language support" --body "## Issue
No internationalization.

## Files
- All pages

## Action
Set up i18n with react-i18next.

## Acceptance Criteria
- [ ] Languages added
- [ ] EN/ES supported" --label "enhancement"

# Issue 94
gh issue create --title "ISSUE-094: Add onboarding tutorial" --body "## Issue
No guided tour for new users.

## Files
- \`src/pages/Dashboard.tsx\`

## Action
Add interactive tour using react-joyride.

## Acceptance Criteria
- [ ] Tour implemented
- [ ] Dismissible" --label "enhancement"

# Issue 95
gh issue create --title "ISSUE-095: Add marketplace templates" --body "## Issue
Only 3 hardcoded templates.

## Files
- \`src/pages/Dashboard.tsx\`

## Action
Fetch templates from API.

## Acceptance Criteria
- [ ] Templates from API
- [ ] Loading states" --label "enhancement"

# Issue 96
gh issue create --title "ISSUE-096: Add search functionality to marketplaces" --body "## Issue
Search exists but limited to Explore page.

## Files
- \`src/pages/MarketplaceList.tsx\`

## Action
Add search to all marketplace lists.

## Acceptance Criteria
- [ ] Search works
- [ ] Results filtered" --label "enhancement"

# Issue 97
gh issue create --title "ISSUE-097: Add export functionality" --body "## Issue
Builder has export but limited.

## Files
- \`src/pages/Builder.tsx\`

## Action
Add JSON/Solidity export options.

## Acceptance Criteria
- [ ] Multiple formats
- [ ] Proper formatting" --label "enhancement"

# Issue 98
gh issue create --title "ISSUE-098: Add share marketplace functionality" --body "## Issue
No way to share marketplace links.

## Files
- \`src/pages/MarketplaceList.tsx\`

## Action
Add share button with copy link.

## Acceptance Criteria
- [ ] Share works
- [ ] Copy to clipboard" --label "enhancement"

# Issue 99
gh issue create --title "ISSUE-099: Add analytics tracking" --body "## Issue
No user analytics tracking.

## Files
- \`src/pages/Analytics.tsx\`

## Action
Integrate analytics (Plausible/PostHog).

## Acceptance Criteria
- [ ] Tracking works
- [ ] Dashboard populated" --label "enhancement"

# Issue 100
gh issue create --title "ISSUE-100: Add mobile responsive Builder page" --body "## Issue
Builder page not fully responsive.

## Files
- \`src/pages/Builder.tsx\`

## Action
Improve mobile experience.

## Acceptance Criteria
- [ ] Usable on mobile
- [ ] Components fit screen" --label "enhancement"

# Issue 101
gh issue create --title "ISSUE-101: Add gas estimation to Builder deploy" --body "## Issue
No gas estimation shown before deploy.

## Files
- \`src/pages/Builder.tsx\`

## Action
Show gas estimate before confirm.

## Acceptance Criteria
- [ ] Estimate shown
- [ ] User can cancel" --label "enhancement"

# Issue 102
gh issue create --title "ISSUE-102: Add transaction history view" --body "## Issue
No view for past transactions.

## Files
- \`src/pages/Settings.tsx\`

## Action
Add transaction history component.

## Acceptance Criteria
- [ ] Shows past txs
- [ ] Links to explorer" --label "enhancement"

# Issue 103
gh issue create --title "ISSUE-103: Add network switcher" --body "## Issue
No easy network switching.

## Files
- \`src/main.tsx\`
- \`src/components/layout/Sidebar.tsx\`

## Action
Add network selector.

## Acceptance Criteria
- [ ] Switch between networks
- [ ] Proper validation" --label "enhancement"

# Issue 104
gh issue create --title "ISSUE-104: Add contract ABI encoder/decoder" --body "## Issue
No way to encode/decode ABI calls.

## Files
- \`src/services/\`

## Action
Add utility functions.

## Acceptance Criteria
- [ ] Can encode calls
- [ ] Can decode results" --label "enhancement"

# Issue 105
gh issue create --title "ISSUE-105: Add contract verification status" --body "## Issue
No indication if contracts are verified.

## Files
- \`src/pages/Settings.tsx\`

## Action
Check verification status via API.

## Acceptance Criteria
- [ ] Verified status shown
- [ ] Link to explorer" --label "enhancement"

# Issue 106
gh issue create --title "ISSUE-106: Add ERC-721 support for unique assets" --body "## Issue
Only ERC-1155 supported.

## Files
- \`contracts/src/\`

## Action
Add ERC-721 token contract.

## Acceptance Criteria
- [ ] ERC-721 implemented
- [ ] Tests pass" --label "enhancement"

# Issue 107
gh issue create --title "ISSUE-107: Add royalty support (ERC-2981)" --body "## Issue
No royalty support for creators.

## Files
- \`contracts/src/RWATokenizer.sol\`

## Action
Implement ERC-2981.

## Acceptance Criteria
- [ ] Royalty settable
- [ ] Queryable" --label "enhancement"

# Issue 108
gh issue create --title "ISSUE-108: Add payment splitting" --body "## Issue
No way to split payments between parties.

## Files
- \`contracts/src/\`

## Action
Implement payment splitter.

## Acceptance Criteria
- [ ] Multiple recipients
- [ ] Configurable splits" --label "enhancement"

# Issue 109
gh issue create --title "ISSUE-109: Add auction functionality" --body "## Issue
No auction support.

## Files
- \`contracts/src/\`

## Action
Implement English/Dutch auction.

## Acceptance Criteria
- [ ] Auction contract
- [ ] Time-bounded" --label "enhancement"

# Issue 110
gh issue create --title "ISSUE-110: Add permit (EIP-2612) support" --body "## Issue
No gasless approvals.

## Files
- \`contracts/src/\`

## Action
Implement ERC-20 Permit.

## Acceptance Criteria
- [ ] Permit function
- [ ] Signature verification" --label "enhancement"

# Issue 111
gh issue create --title "ISSUE-111: Add IPFS pinning reminder" --body "## Issue
Users may lose data if not pinning.

## Files
- \`src/pages/Builder.tsx\`

## Action
Add reminder to pin data.

## Acceptance Criteria
- [ ] Reminder shown
- [ ] Links to Pinata" --label "enhancement"

# Issue 112
gh issue create --title "ISSUE-112: Add mock data mode for testing" --body "## Issue
No easy way to use mock data.

## Files
- All pages

## Action
Add development mock mode.

## Acceptance Criteria
- [ ] Toggle in settings
- [ ] Mock responses" --label "enhancement"

# Issue 113
gh issue create --title "ISSUE-113: Add keyboard shortcuts" --body "## Issue
No keyboard shortcuts.

## Files
- \`src/App.tsx\`

## Action
Add common shortcuts.

## Acceptance Criteria
- [ ] Cmd+K for search
- [ ] Cmd+S for save" --label "enhancement"

# Issue 114
gh issue create --title "ISSUE-114: Add undo/redo to Builder" --body "## Issue
No undo/redo in builder.

## Files
- \`src/pages/Builder.tsx\`

## Action
Implement history stack.

## Acceptance Criteria
- [ ] Undo works
- [ ] Redo works" --label "enhancement"

# Issue 115
gh issue create --title "ISSUE-115: Add component preview" --body "## Issue
No preview of components before adding.

## Files
- \`src/components/builder/ComponentPalette.tsx\`

## Action
Add hover preview.

## Acceptance Criteria
- [ ] Preview shown
- [ ] Helpful description" --label "enhancement"

# Issue 116
gh issue create --title "ISSUE-116: Add auto-save to Builder" --body "## Issue
No auto-save feature.

## Files
- \`src/pages/Builder.tsx\`

## Action
Add periodic auto-save.

## Acceptance Criteria
- [ ] Saves periodically
- [ ] Status indicator" --label "enhancement"

# Issue 117
gh issue create --title "ISSUE-117: Add component validation" --body "## Issue
Can add invalid component combinations.

## Files
- \`src/pages/Builder.tsx\`

## Action
Validate connections and combinations.

## Acceptance Criteria
- [ ] Invalid shown as error
- [ ] Suggestions" --label "enhancement"

# Issue 118
gh issue create --title "ISSUE-118: Add template marketplace preview" --body "## Issue
No preview when selecting templates.

## Files
- \`src/pages/Dashboard.tsx\`

## Action
Add modal preview.

## Acceptance Criteria
- [ ] Preview modal
- [ ] Shows structure" --label "enhancement"

# Issue 119
gh issue create --title "ISSUE-119: Add deep linking to marketplaces" --body "## Issue
No shareable links to specific marketplace.

## Files
- \`src/pages/MarketplaceList.tsx\`

## Action
Add URL routing for marketplaces.

## Acceptance Criteria
- [ ] Shareable links
- [ ] Direct navigation" --label "enhancement"

# Issue 120
gh issue create --title "ISSUE-120: Add marketplace categories" --body "## Issue
No categorization system.

## Files
- Multiple pages

## Action
Implement category taxonomy.

## Acceptance Criteria
- [ ] Categories defined
- [ ] Filtering works" --label "enhancement"

echo "Created issues 51-120"
