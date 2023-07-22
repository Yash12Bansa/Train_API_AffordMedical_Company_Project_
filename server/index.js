const express = require("express");
const connectToMongo = require("./db");
const app = express();
const port = 8000;
app.use(express.json());

app.use("/train", require("./routes/auth"));
app.get("/", (req, res) => {
  res.send("Hello 2100320128002");
});
app.listen(port, () => {
  console.log(`connected ${port}`);
});
