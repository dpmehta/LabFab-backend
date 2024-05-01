const connectToMongo = require("./db");
const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;

app.use(cors());
app.use(express.json());

connectToMongo();

app.use("/api/auth", require("./routes/auth"));
app.use("/api/component", require("./routes/component"));
app.use("/api/lab-entries", require("./routes/lab-entry"));
app.use("/api/complaints", require("./routes/componentComplaint"));
app.use("/api/computer-complaints", require("./routes/computerComplaint"));
app.use("/api/deadstock", require("./routes/deadStock"));

app.listen(port, () => {
  console.log(` app listening on ${port}`);
});
