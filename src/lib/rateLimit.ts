interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  onLimitExceeded?: () => void;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

type RateLimitKey = string | ((...args: unknown[]) => string);

class RateLimiter {
  private limits = new Map<string, RateLimitEntry>();
  private config: RateLimitConfig;
  private cleanupInterval: NodeJS.Timeout;

  constructor(config: RateLimitConfig) {
    this.config = config;
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.limits.entries()) {
      if (entry.resetAt <= now) {
        this.limits.delete(key);
      }
    }
  }

  private getKey(key: RateLimitKey, args?: unknown[]): string {
    if (typeof key === "function") {
      return key(...(args || []));
    }
    return key;
  }

  check(key: RateLimitKey, args?: unknown[]): boolean {
    const k = this.getKey(key, args);
    const now = Date.now();
    const entry = this.limits.get(k);

    if (!entry || entry.resetAt <= now) {
      this.limits.set(k, {
        count: 1,
        resetAt: now + this.config.windowMs,
      });
      return true;
    }

    if (entry.count >= this.config.maxRequests) {
      this.config.onLimitExceeded?.();
      return false;
    }

    entry.count++;
    return true;
  }

  getRemainingRequests(key: RateLimitKey, args?: unknown[]): number {
    const k = this.getKey(key, args);
    const entry = this.limits.get(k);
    
    if (!entry || entry.resetAt <= Date.now()) {
      return this.config.maxRequests;
    }
    
    return Math.max(0, this.config.maxRequests - entry.count);
  }

  getResetTime(key: RateLimitKey, args?: unknown[]): number {
    const k = this.getKey(key, args);
    const entry = this.limits.get(k);
    return entry?.resetAt || 0;
  }

  reset(key?: RateLimitKey, args?: unknown[]): void {
    if (key) {
      this.limits.delete(this.getKey(key, args));
    } else {
      this.limits.clear();
    }
  }

  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.limits.clear();
  }
}

export const defaultRateLimiter = new RateLimiter({
  maxRequests: 10,
  windowMs: 60000,
  onLimitExceeded: () => {
    console.warn("Rate limit exceeded");
  },
});

export function rateLimit<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  config: RateLimitConfig
): T {
  const limiter = new RateLimiter(config);

  return (async (...args: Parameters<T>) => {
    const key = `fn:${fn.name || "anonymous"}:${JSON.stringify(args)}`;
    
    if (!limiter.check(key)) {
      throw new Error("Rate limit exceeded. Please wait before trying again.");
    }
    
    return fn(...args);
  }) as T;
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number
): T {
  let inThrottle = false;
  let lastArgs: Parameters<T> | null = null;

  return ((...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
        if (lastArgs) {
          fn(...lastArgs);
          lastArgs = null;
        }
      }, limit);
    } else {
      lastArgs = args;
    }
  }) as T;
}

export class RequestQueue {
  private queue: Array<() => Promise<unknown>> = [];
  private processing = false;
  private concurrency: number;
  private intervalMs: number;

  constructor(concurrency = 1, intervalMs = 1000) {
    this.concurrency = concurrency;
    this.intervalMs = intervalMs;
  }

  async add<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      this.process();
    });
  }

  private async process() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;

    while (this.queue.length > 0) {
      const batch = this.queue.splice(0, this.concurrency);
      await Promise.all(batch.map((fn) => fn()));
      
      if (this.queue.length > 0) {
        await new Promise((r) => setTimeout(r, this.intervalMs));
      }
    }

    this.processing = false;
  }

  clear() {
    this.queue = [];
  }

  get size(): number {
    return this.queue.length;
  }
}

export const apiRequestQueue = new RequestQueue(2, 500);
