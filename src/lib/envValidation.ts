interface EnvVar {
  key: string;
  required: boolean;
  description: string;
  validate?: (value: string) => boolean;
}

const ENV_VARS: EnvVar[] = [
  {
    key: "VITE_API_URL",
    required: false,
    description: "Backend API URL",
    validate: (v) => v.startsWith("http"),
  },
  {
    key: "VITE_PRIVY_APP_ID",
    required: true,
    description: "Privy App ID for authentication",
    validate: (v) => v.length > 0 && v !== "YOUR_PRIVY_APP_ID",
  },
  {
    key: "VITE_WALLET_CONNECT_PROJECT_ID",
    required: false,
    description: "WalletConnect Project ID",
  },
  {
    key: "VITE_MARKETPLACE_ADDRESS",
    required: false,
    description: "Deployed marketplace contract address",
    validate: (v) => /^0x[a-fA-F0-9]{40}$/.test(v),
  },
  {
    key: "VITE_ERC1155_ADDRESS",
    required: false,
    description: "ERC1155 token contract address",
    validate: (v) => /^0x[a-fA-F0-9]{40}$/.test(v),
  },
];

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  missing: string[];
}

export function validateEnv(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const missing: string[] = [];

  const allEnvVars = { ...import.meta.env };

  for (const envVar of ENV_VARS) {
    const value = allEnvVars[envVar.key] as string | undefined;

    if (!value) {
      if (envVar.required) {
        errors.push(`Missing required environment variable: ${envVar.key} (${envVar.description})`);
        missing.push(envVar.key);
      } else {
        warnings.push(`Optional environment variable not set: ${envVar.key} (${envVar.description})`);
      }
      continue;
    }

    if (envVar.validate && !envVar.validate(value)) {
      errors.push(`Invalid value for ${envVar.key}: ${envVar.description}`);
    }

    if (value.includes("YOUR_") || value.includes("xxx")) {
      warnings.push(`${envVar.key} appears to use placeholder value`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    missing,
  };
}

export function getEnvStatus(): Record<string, { set: boolean; valid: boolean }> {
  const status: Record<string, { set: boolean; valid: boolean }> = {};

  for (const envVar of ENV_VARS) {
    const value = import.meta.env[envVar.key] as string | undefined;
    status[envVar.key] = {
      set: !!value,
      valid: envVar.validate ? envVar.validate(value || "") : !!value || !envVar.required,
    };
  }

  return status;
}

export function logEnvStatus(): void {
  const result = validateEnv();
  
  console.group("Environment Configuration");
  
  if (result.errors.length > 0) {
    console.error("Errors:", result.errors);
  }
  
  if (result.warnings.length > 0) {
    console.warn("Warnings:", result.warnings);
  }
  
  if (result.valid) {
    console.log("Environment configuration is valid");
  } else {
    console.error("Environment configuration has issues");
  }
  
  console.groupEnd();
}

export function getRequiredEnvVars(): string[] {
  return ENV_VARS.filter(v => v.required).map(v => v.key);
}

export function getOptionalEnvVars(): string[] {
  return ENV_VARS.filter(v => !v.required).map(v => v.key);
}
