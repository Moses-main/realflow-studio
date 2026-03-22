# Contributing to RealFlow Studio

Thank you for your interest in contributing to RealFlow Studio! This guide will help you get started with contributing to our AI-driven RWA marketplace builder.

## 🤝 How to Contribute

### Ways to Contribute
- 🐛 **Bug Reports**: Help us find and fix issues
- 💡 **Feature Requests**: Suggest new features and improvements
- 📝 **Documentation**: Improve our documentation and guides
- 🔧 **Code Contributions**: Fix bugs or implement new features
- 🧪 **Testing**: Write and improve tests
- 🎨 **Design**: Improve UI/UX and design assets

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Git installed and configured
- Basic knowledge of React, TypeScript, and Solidity
- Familiarity with Web3 concepts

### Development Setup

1. **Fork the Repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/realflow-studio.git
   cd realflow-studio
   ```

2. **Add Upstream Remote**
   ```bash
   git remote add upstream https://github.com/original-org/realflow-studio.git
   ```

3. **Install Dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd backend && npm install && cd ..
   
   # Install contract dependencies
   cd contracts && forge install && cd ..
   ```

4. **Environment Setup**
   ```bash
   # Frontend environment
   cp .env.example .env.local
   
   # Backend environment
   cp backend/.env.example backend/.env
   ```

5. **Start Development Servers**
   ```bash
   # Terminal 1: Start frontend
   npm run dev
   
   # Terminal 2: Start backend
   cd backend && npm run dev
   ```

## 📋 Development Workflow

### 1. Create a Branch
```bash
# Sync with main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Make Changes
- Follow our coding standards (see below)
- Write tests for new features
- Update documentation as needed
- Commit frequently with clear messages

### 3. Test Your Changes
```bash
# Frontend tests
npm run test

# Backend tests
cd backend && npm test

# Smart contract tests
cd contracts && forge test

# Type checking
npm run type-check

# Linting
npm run lint
```

### 4. Submit Pull Request
```bash
# Push to your fork
git push origin feature/your-feature-name

# Create pull request on GitHub
# Include description, testing steps, and screenshots if applicable
```

## 📝 Coding Standards

### TypeScript/JavaScript
- Use TypeScript for all new code
- Follow ESLint configuration
- Use meaningful variable and function names
- Add JSDoc comments for public functions
- Prefer functional components with hooks

```typescript
// ✅ Good
interface MarketplaceProps {
  name: string;
  onDeploy: () => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ name, onDeploy }) => {
  const [isDeploying, setIsDeploying] = useState(false);
  
  return (
    <div className="marketplace">
      <h1>{name}</h1>
      <button onClick={onDeploy} disabled={isDeploying}>
        Deploy
      </button>
    </div>
  );
};

// ❌ Bad
const Marketplace = (props: any) => {
  return (
    <div>
      <h1>{props.name}</h1>
      <button onClick={props.onDeploy}>Deploy</button>
    </div>
  );
};
```

### Solidity
- Use Solidity ^0.8.20
- Follow OpenZeppelin conventions
- Add comprehensive NatSpec comments
- Use latest security practices

```solidity
// ✅ Good
/**
 * @title RWATokenizer
 * @author RealFlow Studio
 * @notice Tokenizes real-world assets using ERC-1155 standard
 * @dev Implements factory pattern for clone deployment
 */
contract RWATokenizer is ERC1155, Ownable, IERC2981 {
    /// @notice Mapping from token ID to metadata URI
    mapping(uint256 => string) private _tokenURIs;
    
    /**
     * @notice Mints new tokens to a specified address
     * @param to Address to mint tokens to
     * @param id Token ID to mint
     * @param amount Amount of tokens to mint
     * @param data Additional data for minting
     */
    function mint(
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) external onlyOwner {
        _mint(to, id, amount, data);
    }
}
```

### CSS/Styling
- Use TailwindCSS classes
- Follow mobile-first responsive design
- Use CSS variables for theming
- Maintain consistent spacing and colors

```tsx
// ✅ Good
<div className="flex flex-col gap-4 p-6 bg-surface-elevated rounded-lg">
  <h2 className="text-heading text-text-primary">Marketplace</h2>
  <p className="text-sm text-text-secondary">Deploy your RWA marketplace</p>
</div>

// ❌ Bad
<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
  <h2 style={{ fontSize: '24px' }}>Marketplace</h2>
</div>
```

## 🧪 Testing Guidelines

### Frontend Testing
- Use Vitest for unit tests
- Use React Testing Library for component tests
- Use Playwright for E2E tests
- Aim for 80%+ test coverage

```typescript
// Example component test
import { render, screen, fireEvent } from '@testing-library/react';
import { Marketplace } from './Marketplace';

describe('Marketplace', () => {
  it('renders marketplace name', () => {
    render(<Marketplace name="Test Marketplace" onDeploy={vi.fn()} />);
    expect(screen.getByText('Test Marketplace')).toBeInTheDocument();
  });
  
  it('calls onDeploy when button is clicked', () => {
    const onDeploy = vi.fn();
    render(<Marketplace name="Test" onDeploy={onDeploy} />);
    
    fireEvent.click(screen.getByText('Deploy'));
    expect(onDeploy).toHaveBeenCalledOnce();
  });
});
```

### Backend Testing
- Use Node.js built-in test runner
- Test all API endpoints
- Mock external services
- Test error scenarios

```javascript
// Example API test
import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { app } from '../server.js';

describe('POST /api/ai/generate-code', () => {
  it('generates smart contract code', async () => {
    const response = await app.request('/api/ai/generate-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: 'Create an ERC-1155 token contract',
        contractType: 'token'
      })
    });
    
    const data = await response.json();
    assert(response.status === 200);
    assert(data.success === true);
    assert(data.code.includes('ERC1155'));
  });
});
```

### Smart Contract Testing
- Use Foundry for testing
- Test all functions and edge cases
- Include gas optimization tests
- Test security vulnerabilities

```solidity
// Example contract test
import "forge-std/Test.sol";
import { RWATokenizer } from "../src/RWATokenizer.sol";

contract RWATokenizerTest is Test {
    RWATokenizer private tokenizer;
    
    function setUp() public {
        tokenizer = new RWATokenizer(
            "https://api.realflow.io/metadata/",
            address(this)
        );
    }
    
    function testMint() public {
        address recipient = address(0x1);
        uint256 tokenId = 1;
        uint256 amount = 100;
        
        tokenizer.mint(recipient, tokenId, amount, "");
        
        assertEq(tokenizer.balanceOf(recipient, tokenId), amount);
    }
}
```

## 📁 Project Structure

```
realflow-studio/
├── src/                          # Frontend source code
│   ├── components/               # Reusable UI components
│   │   ├── builder/             # Builder-specific components
│   │   ├── ui/                 # Base UI components
│   │   └── auth/               # Authentication components
│   ├── pages/                   # Page components
│   ├── hooks/                   # Custom React hooks
│   ├── services/                # API and external services
│   └── utils/                   # Utility functions
├── backend/                      # Backend source code
│   ├── src/
│   │   ├── routes/              # API route handlers
│   │   ├── services/            # Business logic
│   │   └── middleware/         # Express middleware
│   └── tests/                   # Backend tests
├── contracts/                    # Smart contracts
│   ├── src/                    # Solidity source files
│   ├── test/                   # Contract tests
│   ├── script/                 # Deployment scripts
│   └── out/                    # Compiled artifacts
├── docs/                         # Documentation
├── public/                       # Static assets
└── tests/                        # Frontend tests
```

## 🔧 Development Tools

### Recommended VS Code Extensions
- TypeScript and JavaScript Language Features
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Solidity by Juan Blanco
- Prettier - Code formatter
- ESLint

### Git Hooks Setup
```bash
# Install husky for git hooks
npm install --save-dev husky

# Set up pre-commit hook
npx husky add .husky/pre-commit "npm run lint && npm run test"

# Set up pre-push hook
npx husky add .husky/pre-push "npm run test:coverage"
```

## 🐛 Bug Reports

### How to Report Bugs
1. Check existing issues first
2. Use the bug report template
3. Provide detailed information:
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details
   - Screenshots/videos if applicable

### Bug Report Template
```markdown
## Bug Description
Brief description of the bug

## Steps to Reproduce
1. Go to...
2. Click on...
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., Windows 11, macOS 13.0]
- Browser: [e.g., Chrome 120, Firefox 121]
- Node.js version: [e.g., 18.19.0]
- Project version: [e.g., v1.2.0]

## Additional Context
Any other relevant information
```

## 💡 Feature Requests

### How to Request Features
1. Check existing issues and discussions
2. Use the feature request template
3. Provide clear use case and requirements

### Feature Request Template
```markdown
## Feature Description
Clear description of the feature

## Problem Statement
What problem does this solve?

## Proposed Solution
How should this work?

## Alternatives Considered
What other approaches did you consider?

## Additional Context
Any other relevant information
```

## 📖 Documentation Contributions

### Types of Documentation
- **API Documentation**: Endpoint descriptions and examples
- **User Guides**: Step-by-step tutorials
- **Developer Docs**: Setup and contribution guides
- **Code Comments**: Inline code documentation

### Documentation Style
- Use clear, concise language
- Include code examples
- Add diagrams and screenshots
- Follow consistent formatting

## 🎨 Design Contributions

### UI/UX Guidelines
- Follow our design system
- Maintain accessibility standards
- Test on different screen sizes
- Consider dark/light themes

### Design Assets
- Use SVG for icons and logos
- Optimize images for web
- Follow brand guidelines
- Include responsive versions

## 🔒 Security Considerations

### Reporting Security Issues
- Do not open public issues
- Email security@realflow.studio
- Include detailed vulnerability description
- Wait for our response before disclosing

### Security Best Practices
- Never commit secrets or API keys
- Validate all inputs
- Follow OWASP guidelines
- Keep dependencies updated

## 📊 Code Review Process

### Review Criteria
- **Functionality**: Does the code work as intended?
- **Testing**: Are there adequate tests?
- **Documentation**: Is the code well-documented?
- **Performance**: Is the code efficient?
- **Security**: Are there any security concerns?
- **Style**: Does it follow our standards?

### Review Guidelines
- Be constructive and respectful
- Provide specific feedback
- Suggest improvements
- Acknowledge good work

## 🚀 Release Process

### Version Management
- Follow semantic versioning (MAJOR.MINOR.PATCH)
- Update CHANGELOG.md
- Tag releases in Git
- Create GitHub releases

### Deployment Checklist
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Version numbers updated
- [ ] Security review completed
- [ ] Performance tests pass

## 🤝 Community Guidelines

### Code of Conduct
- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help others learn and grow

### Getting Help
- Join our Discord community
- Ask questions in GitHub Discussions
- Check documentation first
- Be patient with responses

## 🏆 Recognition

### Contributor Recognition
- Contributors section in README
- Hall of fame on website
- Special contributor badges
- Annual contributor awards

### Types of Contributions
- **Code**: Bug fixes, features, tests
- **Documentation**: Guides, API docs, tutorials
- **Design**: UI/UX improvements, assets
- **Community**: Support, feedback, promotion

## 📞 Getting Help

### Resources
- **Documentation**: [docs/](./docs/)
- **Issues**: [GitHub Issues](https://github.com/your-org/realflow-studio/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/realflow-studio/discussions)
- **Discord**: [Join our community](https://discord.gg/realflow)

### Contact
- **Maintainers**: maintainers@realflow.studio
- **Security**: security@realflow.studio
- **General**: hello@realflow.studio

---

Thank you for contributing to RealFlow Studio! Your contributions help make RWA tokenization accessible to everyone. 🚀
