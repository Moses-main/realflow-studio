import { useState, useEffect, useCallback } from "react";

export interface UserProfile {
  username: string;
  email: string;
  displayName: string;
  bio: string;
  avatarUrl: string | null;
  twitter: string;
  website: string;
  preferences: {
    theme: "light" | "dark" | "system";
    notifications: boolean;
    autoSave: boolean;
  };
}

const DEFAULT_PROFILE: UserProfile = {
  username: "",
  email: "",
  displayName: "",
  bio: "",
  avatarUrl: null,
  twitter: "",
  website: "",
  preferences: {
    theme: "system",
    notifications: true,
    autoSave: true,
  },
};

const STORAGE_KEY = "realflow-user-profile";

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_PROFILE, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error("Failed to load user profile:", e);
    }
    return DEFAULT_PROFILE;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error("Failed to save user profile:", e);
    }
  }, [profile]);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  }, []);

  const updatePreferences = useCallback((updates: Partial<UserProfile["preferences"]>) => {
    setProfile((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, ...updates },
    }));
  }, []);

  const resetProfile = useCallback(() => {
    setProfile(DEFAULT_PROFILE);
  }, []);

  return {
    profile,
    updateProfile,
    updatePreferences,
    resetProfile,
  };
}

export default useUserProfile;
