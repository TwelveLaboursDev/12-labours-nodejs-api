const express = require("express");
require("dotenv").config();

// Setup Express
const app = express();
const port = process.env.LOGIN_API_PORT || 8080;

// Enable CORS
var cors = require("cors");
app.use(cors());

// Setup body-parser
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("Hello! Welcome to the 12labours portal login system."));

const routes = require("./routes");
app.use(routes);

app.listen(port, () => console.log(`listening on port ${port}...at ${Date()}`));
