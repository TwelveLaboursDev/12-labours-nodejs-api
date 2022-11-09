const express = require("express");
require("dotenv").config();

// Setup Express
const app = express();
const port = process.env.API_PORT || 8080;

// Enable CORS
var cors = require("cors");
app.use(cors());

// Setup body-parser
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const routes = require("./routes");
app.use(routes);

app.listen(port, () => console.log(`listening on port ${port}...at ${Date()}`));
