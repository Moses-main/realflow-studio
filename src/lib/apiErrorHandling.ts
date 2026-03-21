import { toast } from "@/hooks/use-toast";

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "APIError";
  }
}

export class NetworkError extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message);
    this.name = "NetworkError";
  }
}

export class TimeoutError extends Error {
  constructor(message = "Request timed out") {
    super(message);
    this.name = "TimeoutError";
  }
}

interface RequestOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

export async function apiRequest<T = unknown>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    timeout = 10000,
    retries = 3,
    retryDelay = 1000,
    ...fetchOptions
  } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  let lastError: Error;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...fetchOptions.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorData: APIResponse | null = null;
        try {
          errorData = await response.json();
        } catch {
          // Ignore JSON parse errors
        }

        throw new APIError(
          errorData?.error || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData?.code
        );
      }

      const data: APIResponse<T> = await response.json();

      if (!data.success) {
        throw new APIError(
          data.error || "Request failed",
          response.status,
          data.code
        );
      }

      return data.data as T;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }

      if (error instanceof DOMException && error.name === "AbortError") {
        lastError = new TimeoutError(`Request to ${url} timed out`);
      } else if (error instanceof TypeError) {
        lastError = new NetworkError(
          "Network error - check your connection",
          error
        );
      } else {
        lastError = error instanceof Error ? error : new Error(String(error));
      }

      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, retryDelay * (attempt + 1)));
      }
    }
  }

  throw lastError!;
}

export function handleAPIError(
  error: unknown,
  options: {
    showToast?: boolean;
    toastMessage?: string;
    fallbackMessage?: string;
    onRetry?: () => void;
  } = {}
): string {
  const {
    showToast = true,
    toastMessage,
    fallbackMessage = "An unexpected error occurred",
    onRetry,
  } = options;

  let message: string;

  if (error instanceof APIError) {
    message = error.message;
  } else if (error instanceof NetworkError) {
    message = "Unable to connect to server. Please check your internet connection.";
  } else if (error instanceof TimeoutError) {
    message = "Request timed out. Please try again.";
  } else if (error instanceof Error) {
    message = error.message || fallbackMessage;
  } else {
    message = fallbackMessage;
  }

  if (showToast) {
    toast({
      title: "Error",
      description: toastMessage || message,
      variant: "destructive",
      action: onRetry ? {
        label: "Retry",
        onClick: onRetry,
      } : undefined,
    });
  }

  console.error("API Error:", error);

  return message;
}

export function isRetriableError(error: unknown): boolean {
  if (error instanceof APIError) {
    return [408, 429, 500, 502, 503, 504].includes(error.statusCode);
  }
  if (error instanceof NetworkError || error instanceof TimeoutError) {
    return true;
  }
  return false;
}

export function createErrorHandler(context: string) {
  return (error: unknown, additionalInfo?: Record<string, unknown>) => {
    console.error(`[${context}] Error:`, error, additionalInfo);

    if (import.meta.env.DEV) {
      console.group(`[${context}] Error Details`);
      console.error(error);
      if (additionalInfo) {
        console.table(additionalInfo);
      }
      console.groupEnd();
    }

    return handleAPIError(error, {
      showToast: true,
      fallbackMessage: `Failed to ${context.toLowerCase()}`,
    });
  };
}
