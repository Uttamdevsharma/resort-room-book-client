import { apiRequest } from "./client";

export interface HomepageSection {
  id: string;
  sectionType: "HERO" | "FEATURED_ROOMS" | "FACILITIES" | "OFFERS" | "TESTIMONIALS" | "FAQ" | "GALLERY" | "CTA";
  title?: string | null;
  subtitle?: string | null;
  content?: any;
  sortOrder: number;
  status: "ACTIVE" | "INACTIVE";
}

export const cmsApi = {
  async getPublicFeed() {
    return apiRequest<{ sections: HomepageSection[] }>("/homepage-sections/feed");
  },

  async listPublicSections() {
    return apiRequest<HomepageSection[]>("/homepage-sections/public");
  },

  async listAdminSections() {
    return apiRequest<HomepageSection[]>("/homepage-sections/admin/all");
  },

  async getById(id: string) {
    return apiRequest<HomepageSection>(`/homepage-sections/${id}`);
  },

  async createSection(data: Partial<HomepageSection>) {
    return apiRequest<HomepageSection>("/homepage-sections", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateSection(id: string, data: Partial<HomepageSection>) {
    return apiRequest<HomepageSection>(`/homepage-sections/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async deleteSection(id: string) {
    return apiRequest(`/homepage-sections/${id}`, { method: "DELETE" });
  },
};
