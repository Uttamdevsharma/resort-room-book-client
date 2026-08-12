import { apiRequest, setStoredTokens, clearStoredTokens } from "./client";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  emailVerified?: boolean;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  roles?: string[];
  permissions?: string[];
}

export interface AuthResponseData {
  user: UserProfile;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export const authApi = {
  async register(data: { name: string; email: string; password: string }) {
    const res = await apiRequest<AuthResponseData>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (res.data?.tokens) {
      setStoredTokens(res.data.tokens.accessToken, res.data.tokens.refreshToken);
    }
    return res;
  },

  async login(data: { email: string; password: string }) {
    const res = await apiRequest<AuthResponseData>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (res.data?.tokens) {
      setStoredTokens(res.data.tokens.accessToken, res.data.tokens.refreshToken);
    }
    return res;
  },

  async getMe() {
    return apiRequest<UserProfile>("/auth/me");
  },

  async logout(refreshToken?: string) {
    if (refreshToken) {
      try {
        await apiRequest("/auth/logout", {
          method: "POST",
          body: JSON.stringify({ refreshToken }),
        });
      } catch {
        // ignore logout backend error
      }
    }
    clearStoredTokens();
  },
};
