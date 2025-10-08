// lib/api-client.ts
class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem("accessToken");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    // Add Authorization header if token exists
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
      credentials: "include" as RequestCredentials, // Important for cookies
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);

      // Handle token expiration
      if (response.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        throw new Error("Authentication required");
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  async get(endpoint: string) {
    return this.request(endpoint);
  }

  async post(endpoint: string, data?: any) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put(endpoint: string, data?: any) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint: string) {
    return this.request(endpoint, {
      method: "DELETE",
    });
  }
}

export const apiClient = new ApiClient();
