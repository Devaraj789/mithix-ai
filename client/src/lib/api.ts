export const API_ENDPOINTS = {
  GENERATE_IMAGE: "/api/generate-image",
  USER_CREDITS: (userId: string) => `/api/user/${userId}/credits`,
  USER_IMAGES: (userId: string) => `/api/user/${userId}/images`,
  DOWNLOAD_IMAGE: (imageId: string) => `/api/image/${imageId}/download`,
} as const;

export const DEFAULT_USER_ID = "default-user";
