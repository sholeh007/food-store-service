function getToken(req) {
  const token = req.headers.authorization
    ? req.headers.authorization.replace("Bearer ", "")
    : null;

  return token;
}

module.exports = {
  getToken,
};
