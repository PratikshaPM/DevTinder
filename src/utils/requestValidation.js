const validateProfileEdit = (payload) => {
  const allowedUpdates = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "profileURL",
    "skills",
  ];

  const isValidPayload = Object.keys(payload).every((field) =>
    allowedUpdates.includes(field)
  );

  return isValidPayload;
};

const validateForgetPassword = (payload) => {
  const allowedUpdates = ["currentPassword", "newPassword"];

  const isValidPayload = Object.keys(payload).every((field) =>
    allowedUpdates.includes(field)
  );

  return isValidPayload;
};

module.exports = {
  validateProfileEdit,
  validateForgetPassword,
};
