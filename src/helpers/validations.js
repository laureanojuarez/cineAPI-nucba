export const validateString = (str, minLength, maxLength) => {
  if (minLength && str.length < minLength) return false;
  if (maxLength && str.length > maxLength) return false;
  return true;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (
  password,
  minLength,
  maxLength,
  needsUppercase,
  needsNumber
) => {
  if (minLength && password.length < minLength) return false;
  if (maxLength && password.length > maxLength) return false;
  if (needsUppercase && !/[A-Z]/.test(password)) return false;
  if (needsNumber && !/[0-9]/.test(password)) return false;
  return true;
};

export const validateLoginUser = (req) => {
  const result = {
    error: false,
    message: "",
  };
  const {email, password} = req;

  if (!email || !validateEmail(email)) {
    return {
      error: true,
      message: "Email inválido",
    };
  }

  if (!password || !validatePassword(password, 7, null, true, true)) {
    return {
      error: true,
      message: "Contraseña inválida",
    };
  }

  return result;
};
