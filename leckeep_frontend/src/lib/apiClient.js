const API_BASE_URL = (import.meta.env.VITE_API_URL || "/api/v1").replace(
  /\/$/,
  ""
);

export const getToken = () => localStorage.getItem("token");

export const getUserId = () => localStorage.getItem("userId");

export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
};

export const buildApiUrl = (path, params = {}) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(
    `${API_BASE_URL}${normalizedPath}`,
    window.location.origin
  );

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
};

const buildHeaders = (headers = {}) => {
  const token = getToken();
  return {
    ...headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const parseJson = async (response) => {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Server returned an invalid JSON response.");
  }
};

export const apiFetch = async (path, options = {}) => {
  const { params, headers, body, ...rest } = options;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const response = await fetch(buildApiUrl(path, params), {
    ...rest,
    headers: buildHeaders({
      ...(body && !isFormData ? { "Content-Type": "application/json" } : {}),
      Accept: "application/json",
      ...headers,
    }),
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  const data = await parseJson(response);

  if (!response.ok) {
    const message =
      data?.message || data?.error || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data;
};
