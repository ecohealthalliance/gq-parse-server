Parse.Cloud.define('echo', (req, res) => {
  const message = req.params.message;
  res.success(message);
});
