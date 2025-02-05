const express = require("express");
const path = require("path");
const bodyparser = require("body-parser")
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const businessroutes = require("./routes/businessroutes");
const locationroutes = require("./routes/locationRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const teamRoutes = require("./routes/teamRoutes");
const attendanceroutes = require('./routes/attendanceroutes');

dotenv.config();

const app = express();

connectDB();
app.use(bodyparser.json());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/business",businessroutes);
app.use("/api/location",locationroutes);
app.use("/api/employees",employeeRoutes);
app.use("/api/teams",teamRoutes);
app.use('/api/attendance',attendanceroutes)
app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/',async(req,res)=>{
    res.send("server is running..")
})

app.listen(5000, () => {
  console.log('Server running on port  http://localhost:5000');
});
