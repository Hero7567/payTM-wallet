// backend/index.js
const express = require('express');
const cors = require("cors");
const app = express();

app.use(cors()); // cors 
app.use(express.json()); // body parser


const mainRouter = require("./routes/index");





app.use("/api/v1",mainRouter);
app.listen(3000);
