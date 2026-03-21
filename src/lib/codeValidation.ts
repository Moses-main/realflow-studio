export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: string[];
}

export interface ValidationError {
  line: number;
  column: number;
  message: string;
  severity: "error" | "warning" | "info";
  code: string;
}

export interface ValidationWarning {
  line: number;
  column: number;
  message: string;
  suggestion?: string;
}

const SOLIDITY_KEYWORDS = [
  "contract", "interface", "library", "struct", "enum", "function",
  "event", "error", "modifier", "constructor", "fallback", "receive",
  "public", "private", "internal", "external", "pure", "view", "payable",
  "nonpayable", "constant", "immutable", "override", "virtual",
  "import", "using", "for", "if", "else", "while", "do", "for",
  "assembly", "try", "catch", "return", "revert", "throw", "emit",
  "require", "assert", "storage", "memory", "calldata", "type",
  "pragma", "abstract", "contract", "contract", "contract"
];

const DANGEROUS_PATTERNS = [
  { pattern: /tx\.origin/, message: "Use msg.sender instead of tx.origin", code: "SEC-001" },
  { pattern: /address\(0\)/, message: "Avoid using address(0) for critical operations", code: "SEC-002" },
  { pattern: /selfdestruct|suicide/, message: "selfdestruct is deprecated and dangerous", code: "SEC-003" },
  { pattern: /delegatecall/, message: "delegatecall requires extreme caution", code: "SEC-004" },
  { pattern: /block\.timestamp\s*\*.*block\.timestamp/, message: "Block timestamp manipulation risk", code: "SEC-005" },
  { pattern: /block\.number\s*==.*block\.number/, message: "Block number comparison may behave unexpectedly", code: "SEC-006" },
  { pattern: /\.call\{value:/, message: "Use safe transfer methods instead of .call", code: "SEC-007" },
];

const GAS_OPTIMIZATION_PATTERNS = [
  { pattern: /uint256\.max/i, message: "Consider using constant for max values", code: "GAS-001" },
  { pattern: /for.*memory/gi, message: "Consider using calldata for function parameters", code: "GAS-002" },
];

const COMMON_ERRORS = [
  { pattern: /=.*=.*;/g, message: "Possible assignment comparison (use ==)", code: "ERR-001" },
  { pattern: /;\s*}/g, message: "Empty statement before closing brace", code: "ERR-002" },
  { pattern: /^\s*function\s+\(/gm, message: "Missing function name", code: "ERR-003" },
  { pattern: /\.\s*\.\s*\./g, message: "Invalid spread operator usage", code: "ERR-004" },
];

export function validateSolidity(code: string): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  const suggestions: string[] = [];
  
  const lines = code.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    for (const { pattern, message, code: errorCode } of DANGEROUS_PATTERNS) {
      if (pattern.test(line)) {
        errors.push({
          line: lineNum,
          column: line.indexOf(pattern.source),
          message,
          severity: "error",
          code: errorCode,
        });
      }
    }

    for (const { pattern, message, code: errorCode } of COMMON_ERRORS) {
      if (pattern.test(line)) {
        errors.push({
          line: lineNum,
          column: 0,
          message,
          severity: "error",
          code: errorCode,
        });
      }
    }

    for (const { pattern, message, code: warnCode } of GAS_OPTIMIZATION_PATTERNS) {
      if (pattern.test(line)) {
        warnings.push({
          line: lineNum,
          column: line.indexOf(pattern.source),
          message,
          suggestion: "Review for gas optimization opportunities",
        });
      }
    }

    const missingPragma = !code.includes("pragma solidity") && i === 0;
    if (missingPragma && line.trim().startsWith("//")) {
      continue;
    }
  }

  if (!code.includes("pragma solidity")) {
    errors.push({
      line: 1,
      column: 0,
      message: "Missing SPDX license identifier or pragma statement",
      severity: "error",
      code: "STR-001",
    });
  }

  if (!code.includes("SPDX-License-Identifier")) {
    warnings.push({
      line: 1,
      column: 0,
      message: "Missing SPDX license identifier",
      suggestion: "Add '// SPDX-License-Identifier: MIT' at the top",
    });
  }

  const hasReentrancyGuard = /ReentrancyGuard|nonReentrant/.test(code);
  const hasExternalCalls = /\.call|\.delegatecall|\.transfer/.test(code);
  
  if (hasExternalCalls && !hasReentrancyGuard) {
    warnings.push({
      line: 0,
      column: 0,
      message: "External calls detected without ReentrancyGuard",
      suggestion: "Consider adding ReentrancyGuard from OpenZeppelin",
    });
  }

  if (warnings.length > 3) {
    suggestions.push("Consider running a full audit before deployment");
  }

  const hasEvents = /event\s+\w+/.test(code);
  const hasStorageVariables = /(address|uint|bool|string|bytes)\s+\w+\s*;/g.test(code);
  
  if (hasStorageVariables && !hasEvents) {
    suggestions.push("Consider emitting events for state changes");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    suggestions,
  };
}

export function validateContractAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function validateABI(abi: any[]): ValidationResult {
  const errors: ValidationError[] = [];

  if (!Array.isArray(abi)) {
    errors.push({
      line: 0,
      column: 0,
      message: "ABI must be an array",
      severity: "error",
      code: "ABI-001",
    });
    return { valid: false, errors, warnings: [], suggestions: [] };
  }

  for (let i = 0; i < abi.length; i++) {
    const item = abi[i];
    
    if (!item.type) {
      errors.push({
        line: i + 1,
        column: 0,
        message: `ABI item ${i} missing 'type' field`,
        severity: "error",
        code: "ABI-002",
      });
    }

    if (item.type === "function" && !item.name) {
      errors.push({
        line: i + 1,
        column: 0,
        message: `Function at index ${i} missing 'name' field`,
        severity: "error",
        code: "ABI-003",
      });
    }

    if (item.inputs && !Array.isArray(item.inputs)) {
      errors.push({
        line: i + 1,
        column: 0,
        message: `Function inputs must be an array`,
        severity: "error",
        code: "ABI-004",
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings: [],
    suggestions: errors.length === 0 ? ["ABI is valid"] : [],
  };
}
