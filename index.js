const connectToMongo = require("./db");
const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

connectToMongo();
app.use(
  "/assets/images",
  express.static(path.join(__dirname, "assets/images"))
);

app.use("/api/auth", require("./routes/auth"));
app.use("/api/component", require("./routes/component"));
app.use("/api/lab-entries", require("./routes/lab-entry"));
app.use("/api/complaints", require("./routes/componentComplaint"));
app.use("/api/computer-complaints", require("./routes/computerComplaint"));
app.use("/api/deadstock", require("./routes/deadStock"));
app.use("/api/faculty", require("./routes/faculty"));
app.use("/api/student", require("./routes/students"));
app.use("/api/lablogin", require("./routes/lablogin"));
app.use("/api/subjects", require("./routes/subject"));
app.use("/api/add-component", require("./routes/componentAdd"));

app.listen(port, () => {
  console.log(` app listening on ${port}`);
});
