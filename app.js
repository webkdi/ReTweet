// Import packages
const express = require("express");
const tw = require("./routes/twitter");

// Middlewares
const app = express();
app.use(express.json());

// Routes
app.use("/twitter", tw);

// connection
const port = process.env.PORT || 9001;
app.listen(port, () => console.log(`Listening to port ${port}`));