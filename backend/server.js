const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const module_alias = require('module-alias/register');

dotenv.config({ path: path.resolve(__dirname, "../dotenv/config.env") });

const Events = require("@/routes/eventRoutes");


const app = express();
const PORT = process.env.PORT || 3000;

const dbConnection = require("@/db_connection/db");
const { events } = require("./models/eventModel");
dbConnection();

const corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/events", Events)


app.get("/", (req, res) => {
    res.send("hi");
});

app.listen(PORT, () => {
    console.log(`Running on port number ${PORT}`);
});
