import axios from 'axios';
// vuela alto helton
// Base URLs desde .env (ABSOLUTAS)
const IS_DEV = import.meta.env.DEV;
const STORE_BASE_ABS = import.meta.env.VITE_XANO_STORE_BASE; // Grupo Store (product, cart_product, order, order_product, shipping)
const AUTH_BASE_ABS = import.meta.env.VITE_XANO_AUTH_BASE;   // Grupo Auth (si lo usas para login/signup)

// En desarrollo usamos proxy para evitar CORS
const STORE_BASE = IS_DEV ? '/xano-store' : STORE_BASE_ABS;
const AUTH_BASE = IS_DEV ? '/xano-auth' : AUTH_BASE_ABS;

// Clientes Axios
export const storeApi = axios.create({ baseURL: STORE_BASE });
export const authApi = axios.create({ baseURL: AUTH_BASE });

const getAuthToken = () => localStorage.getItem('authToken');

// Interceptor simple para Authorization si más adelante agregas JWT
[storeApi, authApi].forEach((client) => {
  client.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
});

const installRateLimitRetry = (client) => {
  client.interceptors.response.use(
    (resp) => resp,
    async (err) => {
      const status = err?.response?.status;
      const cfg = err?.config || {};
      if (status === 429 && !cfg.__retry) {
        cfg.__retry = true;
        const h = err?.response?.headers || {};
        const ra = Number(h['retry-after']) || Number(h['x-ratelimit-reset']) || 2000;
        await new Promise((r) => setTimeout(r, ra));
        return client(cfg);
      }
      return Promise.reject(err);
    }
  );
};

installRateLimitRetry(storeApi);
installRateLimitRetry(authApi);

// --------- PRODUCT ---------
export const getProducts = (params = {}) => storeApi.get('/product', { params });
export const getProduct = (product_id) => storeApi.get(`/product/${product_id}`);
export const createProduct = (data) => storeApi.post('/product', data);
export const updateProduct = (product_id, data) => storeApi.patch(`/product/${product_id}`, data);
export const deleteProduct = (product_id) => storeApi.delete(`/product/${product_id}`);

// --------- CART_PRODUCT ---------
export const listCartItems = (params = {}) => storeApi.get('/cart_product', { params });
export const getCartItem = (cart_product_id) => storeApi.get(`/cart_product/${cart_product_id}`);
export const addCartItem = (data) => storeApi.post('/cart_product', data); // { product_id, quantity, user_id | cart_id }
export const updateCartItem = (cart_product_id, data) => storeApi.patch(`/cart_product/${cart_product_id}`, data);
export const deleteCartItem = (cart_product_id) => storeApi.delete(`/cart_product/${cart_product_id}`);

// --------- ORDER ---------
export const listOrders = (params = {}) => storeApi.get('/order', { params });
export const getOrder = (order_id) => storeApi.get(`/order/${order_id}`);
export const createOrder = (data) => storeApi.post('/order', data);
export const updateOrder = (order_id, data) => storeApi.patch(`/order/${order_id}`, data);
export const deleteOrder = (order_id) => storeApi.delete(`/order/${order_id}`);

// --------- ORDER_PRODUCT ---------
export const listOrderProducts = (params = {}) => storeApi.get('/order_product', { params });
export const getOrderProduct = (order_product_id) => storeApi.get(`/order_product/${order_product_id}`);
export const addOrderProduct = (data) => storeApi.post('/order_product', data); // { order_id, product_id, quantity, unit_price }
export const updateOrderProduct = (order_product_id, data) => storeApi.patch(`/order_product/${order_product_id}`, data);
export const deleteOrderProduct = (order_product_id) => storeApi.delete(`/order_product/${order_product_id}`);

// --------- SHIPPING ---------
export const listShipping = (params = {}) => storeApi.get('/shipping', { params });
export const getShipping = (shipping_id) => storeApi.get(`/shipping/${shipping_id}`);
export const createShipping = (data) => storeApi.post('/shipping', data); // { order_id, address, city, postal_code, method, cost }
export const updateShipping = (shipping_id, data) => storeApi.patch(`/shipping/${shipping_id}`, data);
export const deleteShipping = (shipping_id) => storeApi.delete(`/shipping/${shipping_id}`);

// --------- UPLOAD ---------
// Sube una o varias imágenes a Xano y devuelve array de archivos { url | path }
export const uploadImages = async (files) => {
  const fd = new FormData();
  for (const f of files) fd.append('content[]', f);
  const { data } = await storeApi.post('/upload/image', fd, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  const arr = Array.isArray(data) ? data : (data.files || []);
  // Normaliza a url absoluta si viene "path"
  return arr.map((f) => ({
    url: f.url || (f.path?.startsWith('http') ? f.path : `${new URL(STORE_BASE_ABS).origin}${f.path}`),
    path: f.path
  }));
};

// Convierte un path relativo (ej. "/file/xyz") a URL absoluta del servidor de Xano
export const absoluteFileUrl = (pathOrUrl) => {
  if (!pathOrUrl) return undefined;
  try {
    return pathOrUrl.startsWith('http')
      ? pathOrUrl
      : `${new URL(STORE_BASE_ABS).origin}${pathOrUrl}`;
  } catch {
    return pathOrUrl; // fallback sin cambios si algo falla
  }
};

// Normaliza distintos formatos de imagen (string, objeto {url|path}, array) a URL absoluta única
export const getImageUrl = (value) => {
  if (!value) return undefined;
  if (Array.isArray(value)) {
    const first = value[0];
    if (!first) return undefined;
    const candidate = typeof first === 'string' ? first : (first.url || first.path);
    return absoluteFileUrl(candidate);
  }
  if (typeof value === 'object') {
    const candidate = value.url || value.path;
    return absoluteFileUrl(candidate);
  }
  if (typeof value === 'string') {
    return absoluteFileUrl(value);
  }
  return undefined;
};

// Construye una galería de imágenes deduplicada a partir de múltiples posibles campos
export const getImageList = (...values) => {
  const urls = [];
  for (const v of values) {
    if (!v) continue;
    if (Array.isArray(v)) {
      for (const it of v) {
        const candidate = typeof it === 'string' ? it : (it?.url || it?.path);
        const url = absoluteFileUrl(candidate);
        if (url) urls.push(url);
      }
    } else if (typeof v === 'object') {
      const candidate = v.url || v.path;
      const url = absoluteFileUrl(candidate);
      if (url) urls.push(url);
    } else if (typeof v === 'string') {
      const url = absoluteFileUrl(v);
      if (url) urls.push(url);
    }
  }
  // Dedup
  const seen = new Set();
  const gallery = [];
  for (const url of urls) {
    if (!seen.has(url)) {
      seen.add(url);
      gallery.push({ url });
    }
  }
  return gallery;
};

// Export agrupado
const xano = {
  storeApi,
  authApi,
  // product
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  // cart_product
  listCartItems,
  getCartItem,
  addCartItem,
  updateCartItem,
  deleteCartItem,
  // order
  listOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  // order_product
  listOrderProducts,
  getOrderProduct,
  addOrderProduct,
  updateOrderProduct,
  deleteOrderProduct,
  // shipping
  listShipping,
  getShipping,
  createShipping,
  updateShipping,
  deleteShipping,
  // upload
  uploadImages,
  absoluteFileUrl,
  getImageUrl,
  getImageList,
};

export default xano;
