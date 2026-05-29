import api from "./api";

export const login = async (email, password) => {
  const formData = new URLSearchParams();

  formData.append("username", email);
  formData.append("password", password);

  const response = await api.post(
    "/auth/login",
    formData,
    {
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data;
};

export const register = async (
  full_name,
  email,
  password
) => {
  const response = await api.post(
    "/auth/signup",
    {
      full_name,
      email,
      password,
    }
  );

  return response.data;
};