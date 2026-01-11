import axios from 'axios';

const baseUrl = '/api/users';

const getAll = async () => {
  const response = await axios.get(baseUrl);

  return response.data;
};

const getUser = async (userId) => {
  console.info(`Fetching user with id ${userId}`);
  // Simulate network delay with new Promise
  await new Promise((resolve) => setTimeout(resolve, 500));
  try {
    const response = await axios.get(`${baseUrl}/${userId}`);

    return response.data;
  } catch (error) {
    if (error.status === 404) {
      throw new Error(`User with ID "${userId} not found`);
    }
    throw error;
  }
};

export default { getAll, getUser };
