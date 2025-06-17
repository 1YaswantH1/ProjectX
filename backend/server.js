const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const module_alias = require('module-alias/register');

dotenv.config({ path: path.resolve(__dirname, "../dotenv/config.env") });

const Event = require("@/models/eventModel");


const app = express();
const PORT = process.env.PORT || 3000;

const dbConnection = require("@/db_connection/db");
dbConnection();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("hi");
});

app.listen(PORT, () => {
    console.log(`Running on port number ${PORT}`);
});
