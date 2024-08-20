const init = require("../app");
const PORT = process.env.PORT || 3000;

init().then((app) => {
  app.listen(PORT);
});
