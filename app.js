const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();

connectDB();

app.use(express.json());
app.use("/api/auth", authRoutes);

app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/',async(req,res)=>{
    res.send("server is running..")
})

app.listen(5000, () => {
  console.log('Server running on port  http://localhost:5000');
});
