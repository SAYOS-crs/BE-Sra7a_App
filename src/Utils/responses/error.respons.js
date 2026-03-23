export const ErrorRespons = async ({
  res,
  status = 400,
  Error = "somthing went wrong",
  Extra = undefined,
}) => {
  return res.status(status).json({ Error, Extra });
};
