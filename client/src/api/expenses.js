import api from "./api";

export const createExpenses = async (payload) => {
  try {
    const { userId } = payload;
    const { data } = await api.post(`/add-expense/${userId}`, payload);

    return data;
  } catch (error) {
    const message =
      error.response?.data.message ||
      "an error occurred while creating the expense please try again";

    throw new Error(message);
  }
};

export const getExpenses = async (userId) => {
  try {
    return await api.get(`/get-expenses/${userId}`);
  } catch (error) {
    const message =
      error.response?.data.message ||
      "an error occurred while fetching the expenses please try again";

    throw new Error(message);
  }
};
