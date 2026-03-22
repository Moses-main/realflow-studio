# Support Guide

Welcome to RealFlow Studio Support! We're here to help you succeed with building RWA marketplaces.

## 🆘 Getting Help

### Quick Help Options
- **📚 Documentation**: [Read our docs](./docs/)
- **🐛 Bug Reports**: [Report an issue](https://github.com/your-org/realflow-studio/issues)
- **💬 Discussions**: [Ask the community](https://github.com/your-org/realflow-studio/discussions)
- **📧 Email Support**: support@realflow.studio
- **💬 Discord**: [Join our community](https://discord.gg/realflow)

## 🚨 Emergency Support

### Critical Issues
For security vulnerabilities, data breaches, or production outages:
- **Security**: security@realflow.studio
- **Emergency**: emergency@realflow.studio
- **Response Time**: Within 2 hours

### Production Issues
If your deployed marketplace is experiencing issues:
1. Check [PolygonScan status](https://polygonscan.com/)
2. Verify your contract is deployed correctly
3. Check our [status page](https://status.realflow.studio)
4. Contact us with contract address and error details

## 📋 Common Issues

### Frontend Issues

#### Wallet Connection Problems
**Problem**: Can't connect wallet or wallet not showing
**Solutions**:
```bash
# Clear browser cache and cookies
# Try different browser (Chrome, Firefox, Brave)
# Disable browser extensions
# Check MetaMask is unlocked and correct network
```

**Network Settings**:
- Network Name: Polygon Amoy
- RPC URL: https://rpc-amoy.polygon.technology
- Chain ID: 80002
- Currency Symbol: MATIC

#### Builder Not Loading
**Problem**: Visual builder shows blank or errors
**Solutions**:
```javascript
// Check browser console for errors
// Verify all dependencies loaded
// Try refreshing the page
// Check internet connection
```

#### Deployment Fails
**Problem**: Deploy button shows error or hangs
**Solutions**:
1. Check wallet has sufficient MATIC for gas
2. Verify backend server is running
3. Check network connectivity
4. Try with smaller marketplace design

### Backend Issues

#### Server Won't Start
**Problem**: Backend fails to start or crashes
**Solutions**:
```bash
# Check Node.js version (must be 18+)
node --version

# Check port 5000 is available
lsof -i :5000

# Install dependencies
npm install

# Check environment variables
cat .env
```

#### API Errors
**Problem**: API endpoints return 500 errors
**Solutions**:
```bash
# Check server logs
npm run dev

# Verify environment variables
echo $OPENAI_API_KEY
echo $PINATA_API_KEY

# Test database connection
curl http://localhost:5000/api/health
```

### Smart Contract Issues

#### Contract Verification Fails
**Problem**: Contract deployed but not verified on PolygonScan
**Solutions**:
```bash
# Flatten contract code
forge flatten contracts/src/RWATokenizer.sol > flattened.sol

# Verify with correct constructor arguments
forge verify-contract <ADDRESS> "flattiled.sol:RWATokenizer" \
  --chain-id 80002 \
  --verifier-url https://api-amoy.polygonscan.com/api \
  --constructor-args $(cast abi-encode "constructor(string,string)" "baseURI" "owner")
```

#### Gas Estimation Errors
**Problem**: Transaction fails due to gas estimation
**Solutions**:
- Increase gas limit by 20%
- Check gas price on [Polygon Gas Tracker](https://polygonscan.com/gastracker)
- Try deploying during low-traffic hours
- Use gas optimization techniques

## 🔧 Troubleshooting Guides

### Environment Setup Issues

#### Node.js Version Problems
```bash
# Install correct Node.js version using nvm
nvm install 18
nvm use 18
nvm alias default 18

# Verify installation
node --version  # Should show v18.x.x
npm --version   # Should show 9.x.x or higher
```

#### Dependency Conflicts
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install
```

#### Port Conflicts
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

### Development Issues

#### Hot Reload Not Working
```bash
# Check Vite configuration
# Ensure file watching is enabled
# Try manual restart
npm run dev

# Check for file permission issues
ls -la src/
```

#### TypeScript Errors
```bash
# Check TypeScript configuration
cat tsconfig.json

# Update type definitions
npm install --save-dev @types/node

# Strict type checking
npm run type-check
```

## 📊 Performance Issues

### Slow Loading Times
**Frontend Optimizations**:
```javascript
// Enable lazy loading
const LazyComponent = React.lazy(() => import('./Component'));

// Optimize images
// Use WebP format
// Implement code splitting

// Monitor performance
// Use React DevTools Profiler
// Check bundle size with npm run analyze
```

**Backend Optimizations**:
```javascript
// Enable response caching
app.use(compression());

// Use connection pooling
// Implement rate limiting
// Add database indexes

// Monitor performance
// Use APM tools
// Check response times
```

### Memory Issues
**Frontend**:
```javascript
// Check for memory leaks
// Clean up event listeners
// Use React.memo for expensive components
// Implement virtual scrolling for large lists
```

**Backend**:
```javascript
// Monitor memory usage
process.memoryUsage();

// Implement garbage collection
// Use streams for large data
// Optimize database queries
```

## 🔐 Security Issues

### Common Security Vulnerabilities

#### Smart Contract Security
**Reentrancy Protection**:
```solidity
// Use OpenZeppelin's ReentrancyGuard
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MyContract is ReentrancyGuard {
    function withdraw() external nonReentrant {
        // Your logic here
    }
}
```

**Access Control**:
```solidity
// Use OpenZeppelin's Ownable
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyContract is Ownable {
    function adminFunction() external onlyOwner {
        // Admin only logic
    }
}
```

#### Backend Security
**Input Validation**:
```javascript
// Use Zod for schema validation
import { z } from 'zod';

const userSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

try {
    const validated = userSchema.parse(req.body);
    // Process validated data
} catch (error) {
    res.status(400).json({ error: 'Invalid input' });
}
```

**Rate Limiting**:
```javascript
// Implement rate limiting
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## 📈 Monitoring and Analytics

### Application Monitoring
**Frontend**:
```javascript
// Error tracking
window.addEventListener('error', (event) => {
    console.error('Frontend error:', event.error);
    // Send to error tracking service
});

// Performance monitoring
const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        console.log('Performance:', entry.name, entry.duration);
    }
});

observer.observe({ entryTypes: ['measure', 'navigation'] });
```

**Backend**:
```javascript
// Request logging
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.path} - ${duration}ms`);
    });
    next();
});
```

### Smart Contract Monitoring
```javascript
// Event listening
const contract = new ethers.Contract(address, abi, provider);

contract.on('TokenMinted', (to, tokenId, amount) => {
    console.log(`Tokens minted: ${amount} to ${to}`);
    // Send notification or update database
});
```

## 📚 Learning Resources

### Documentation
- **[Getting Started Guide](./docs/getting-started.md)**
- **[API Reference](./docs/api.md)**
- **[Smart Contract Guide](./docs/smart-contracts.md)**
- **[Deployment Guide](./docs/deployment.md)**

### Tutorials
- **[Building Your First Marketplace](./docs/tutorials/first-marketplace.md)**
- **[Advanced AI Features](./docs/tutorials/ai-features.md)**
- **[Custom Contract Integration](./docs/tutorials/custom-contracts.md)**

### External Resources
- **[React Documentation](https://react.dev/)**
- **[Solidity by Example](https://solidity-by-example.org/)**
- **[Polygon Documentation](https://docs.polygon.technology/)**
- **[OpenZeppelin Contracts](https://docs.openzeppelin.com/)**

## 🤝 Community Support

### Discord Community
- **General Chat**: #general
- **Help & Support**: #help
- **Feature Requests**: #features
- **Bug Reports**: #bugs
- **Show & Tell**: #showcase

### GitHub Community
- **Discussions**: Ask questions and share ideas
- **Issues**: Report bugs and request features
- **Pull Requests**: Contribute code and documentation
- **Wiki**: Community-maintained documentation

### Social Media
- **Twitter**: [@RealFlowStudio](https://twitter.com/RealFlowStudio)
- **LinkedIn**: [RealFlow Studio](https://linkedin.com/company/realflow-studio)
- **YouTube**: [RealFlow Studio Channel](https://youtube.com/@realflow-studio)

## 📞 Contact Information

### Support Team
- **Lead Developer**: lead@realflow.studio
- **Technical Support**: tech@realflow.studio
- **Community Manager**: community@realflow.studio
- **Security Team**: security@realflow.studio

### Business Inquiries
- **Partnerships**: partnerships@realflow.studio
- **Enterprise**: enterprise@realflow.studio
- **Press**: press@realflow.studio
- **Investors**: investors@realflow.studio

### Office Hours
- **Monday - Friday**: 9:00 AM - 6:00 PM EST
- **Saturday**: 10:00 AM - 4:00 PM EST
- **Sunday**: Closed
- **Response Time**: Within 24 hours for non-urgent issues

## 🏆 Premium Support

### Enterprise Support
For enterprise customers requiring dedicated support:
- **Dedicated Slack channel**
- **Monthly check-in calls**
- **Priority bug fixes**
- **Custom onboarding**
- **SLA guarantees**

Contact: enterprise@realflow.studio for pricing and details.

### Consulting Services
- **Smart contract audits**
- **Custom marketplace development**
- **AI integration consulting**
- **Blockchain migration services**

Contact: consulting@realflow.studio for rates and availability.

## 📋 Feedback

### Help Us Improve
We value your feedback! Please share:
- **Feature suggestions**
- **Bug reports**
- **User experience improvements**
- **Documentation gaps**

**Feedback Form**: [realflow.studio/feedback](https://realflow.studio/feedback)

### Survey Participation
Join our user research program:
- **Monthly surveys**
- **Beta testing opportunities**
- **Feature voting**
- **User interviews**

Sign up: [realflow.studio/research](https://realflow.studio/research)

---

## 🚀 Need More Help?

If you can't find the answer you're looking for:

1. **Search our documentation** first
2. **Check GitHub Discussions** for similar questions
3. **Join our Discord** for real-time help
4. **Create an issue** if you've found a bug
5. **Email us** for personalized support

We're here to help you succeed with RealFlow Studio! 🎯

---

*Last updated: March 2026*  
*Version: 1.0.0*
