/**
 * Admin API Client
 * Handles all admin analytics API calls
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Helper to get auth headers
const getAuthHeaders = (): HeadersInit => {
  if (typeof window === "undefined") return {};

  const token = localStorage.getItem("campusor_jwt");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

// Type definitions matching backend responses
export interface DashboardSummary {
  activeTokens: number;
  servedToday: number;
  skippedTokens: number;
  totalTokensToday: number;
  peakHour: string;
}

export interface QueueLoad {
  time: string;
  activeTokens: number;
}

export interface TokensServed {
  hour: string;
  served: number;
}

export interface AvgWaitTime {
  queue: string;
  avgWaitMinutes: number;
}

export interface TokenStatusCount {
  status: string;
  count: number;
}

/**
 * Fetch dashboard summary with overview metrics
 */
export const fetchDashboardSummary = async (): Promise<DashboardSummary> => {
  const response = await fetch(`${API_BASE_URL}/api/admin/dashboard/summary`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard summary: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Fetch queue load analytics (active tokens over time)
 */
export const fetchQueueLoadAnalytics = async (): Promise<QueueLoad[]> => {
  const response = await fetch(`${API_BASE_URL}/api/admin/analytics/queue-load`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch queue load analytics: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Fetch tokens served per hour analytics
 */
export const fetchTokensServedAnalytics = async (): Promise<TokensServed[]> => {
  const response = await fetch(`${API_BASE_URL}/api/admin/analytics/tokens-served`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch tokens served analytics: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Fetch average wait time per queue analytics
 */
export const fetchAvgWaitTimeAnalytics = async (): Promise<AvgWaitTime[]> => {
  const response = await fetch(`${API_BASE_URL}/api/admin/analytics/avg-wait-time`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch wait time analytics: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Fetch token status distribution analytics
 */
export const fetchTokenStatusAnalytics = async (): Promise<TokenStatusCount[]> => {
  const response = await fetch(`${API_BASE_URL}/api/admin/analytics/token-status`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch token status analytics: ${response.statusText}`);
  }

  return response.json();
};

export interface AdminUser {
  _id: string;
  email: string;
  emailVerified: boolean;
  createdByAdmin: {
    _id: string;
  } | null;
}

/**
 * Fetch all admin users
 */
export const fetchAdmins = async (): Promise<AdminUser[]> => {
  const response = await fetch(`${API_BASE_URL}/api/admin/admins`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch admins: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Create a new admin (direct creation)
 */
export const createAdmin = async (
  name: string,
  email: string,
  password: string
) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/create`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Failed to create admin");
  }

  return response.json();
};

