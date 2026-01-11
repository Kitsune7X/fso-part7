import axios from 'axios';

// Using relative path since we set up proxy with vite config
export const baseUrl = '/api/blogs';

let token = null;

const setToken = (newToken) => (token = `Bearer ${newToken}`);

// Get All --------------------------------------------------------------
const getAll = async () => {
  const request = axios.get(baseUrl);
  const response = await request;
  return response.data;
};

// Get a single blog --------------------------------------------------------------
const getBlog = async (blogId) => {
  console.info(`Fetching blog with id ${blogId}`);
  await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    const response = await axios.get(`${baseUrl}/${blogId}`);

    return response.data;
  } catch (error) {
    if (error.status === 404) {
      throw new Error(`Blog with ID ${blogId} not found`);
    }
    throw error;
  }
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

// ---------- Add comment for a blog ----------
const addComment = async (comment, blogId) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.patch(
    `${baseUrl}/${blogId}/comments`,
    comment,
    config,
  );

  return response.data;
};

// ---------- Delete comment for a blog ----------
const deleteComment = async (blogId, commentId) => {
  // https://github.com/axios/axios
  // Custom config with axios
  const response = await axios({
    url: `${baseUrl}/${blogId}/comments/${commentId}`,
    method: 'patch',
    headers: { Authorization: token },
  });

  return response.data;
};

export default {
  getAll,
  getBlog,
  create,
  update,
  remove,
  setToken,
  addComment,
  deleteComment,
};
