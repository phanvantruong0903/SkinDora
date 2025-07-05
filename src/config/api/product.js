import { API_BASE_URL } from "../base";

export const productEndpoints = {
  list: `${API_BASE_URL}/products`,
  detail: (id) => `${API_BASE_URL}/products/${id}`,
  add: `${API_BASE_URL}/products`,
  update: (id) => `${API_BASE_URL}/products/${id}`,
  delete: (id) => `${API_BASE_URL}/products/${id}`,
};
