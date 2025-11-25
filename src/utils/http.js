export const formatAxiosError = (err) => {
  const status = err?.response?.status;
  const statusText = err?.response?.statusText;
  const data = err?.response?.data;
  const detail = typeof data === 'string' ? data : (data?.message || '');
  const url = err?.config?.baseURL ? `${err.config.baseURL}${err.config?.url}` : err?.config?.url;
  const method = err?.config?.method?.toUpperCase();
  return `(${method || 'REQ'} ${status ?? 'N/A'} ${statusText || ''}) ${url || ''} ${detail || err?.message || ''}`.trim();
};