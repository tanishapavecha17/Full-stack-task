const express = require("express");
const connectDb = require("./connection");
const app = express();
const dotenv = require("dotenv").config();
const approute = require("./routes/userRoutes");
const path = require("path");
const mainApiRouter = require('./routes/index');

connectDb();


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

app.use('/api', mainApiRouter);
app.listen(process.env.PORT,()=> {
    console.log(`Server started on ${process.env.PORT}`);    
});