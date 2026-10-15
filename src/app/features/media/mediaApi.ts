import { API_URLS, FILE_UPLOAD } from "@/utils/Constants";
import { api } from "../../services/baseApi";
import { unwrapResponse } from "../../services/apiHelpers";
import type { Media } from "@/types/media";

export const mediaApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Upload first, then send the returned `path` values in contract / user / lookup payloads
    uploadFiles: builder.mutation<Media[], File[]>({
      query: (files) => {
        const formData = new FormData();
        files.forEach((file) => formData.append(FILE_UPLOAD.FIELD_NAME, file));
        return { url: API_URLS.MEDIA_UPLOAD, method: "POST", body: formData, meta: { silent: true } };
      },
      transformResponse: unwrapResponse<Media[]>,
    }),
  }),
});

export const { useUploadFilesMutation } = mediaApi;
