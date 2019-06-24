const express = require("express");
const app = express();
const gameRoutes = require("./routes/game.js");

app.listen(3000, () => {
  console.log("nasluchuje na porcie 3000");
});
app.use(express.static(__dirname + "/public"));

gameRoutes(app);
