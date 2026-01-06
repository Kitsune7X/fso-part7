import axios from 'axios';
export const baseUrl = '/api/blogs';

let token = null;

const setToken = (newToken) => (token = `Bearer ${newToken}`);

// TODO: Rewrite service using `fetchAPI`
// Get All --------------------------------------------------------------
const getAll = async () => {
  const request = axios.get(baseUrl);
  const response = await request;
  return response.data;
};

// Create New Blog --------------------------------------------------------------
const create = async (newBlog) => {
  const config = {
    headers: { Authorization: token },
  };
  const request = axios.post(baseUrl, newBlog, config);

  const response = await request;

  return response.data;
};

// Delete a Blog --------------------------------------------------------------
const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  };

  const request = axios.delete(`${baseUrl}/${id}`, config);

  const response = await request;

  return response.data;
};

// Update a Blog --------------------------------------------------------------
const update = async (update, id) => {
  const config = {
    headers: { Authorization: token },
  };

  const request = axios.put(`${baseUrl}/${id}`, update, config);

  const response = await request;

  return response.data;
};

export default { getAll, create, update, remove, setToken };
