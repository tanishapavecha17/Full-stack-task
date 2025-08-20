const express = require("express");
const connectDb = require("./connection");
const app = express();
const dotenv = require("dotenv").config();
const path = require("path");
const mainApiRouter = require('./routes/index');
const cors = require("cors");

connectDb();

app.use(express.static('public'));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(cors({
  origin: "http://localhost:5173", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

app.use('/api', mainApiRouter);
app.listen(process.env.PORT,()=> {
    console.log(`Server started on ${process.env.PORT}`);    
});