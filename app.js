require('dotenv').config();
const express = require("express")
const mongoose = require("mongoose")

const app = express();

const bodyParser = require("body-parser")
const cookieParser  = require("cookie-parser")
const cors = require("cors")

//routes
const authRoutes = require("./routes/auth")
const userRoutes = require('./routes/user')
const categoryRoutes = require('./routes/category')
const carRoutes = require('./routes/car')
const cityRoutes = require('./routes/city')
//DB connection
const DATABASE = process.env.DATABASE
mongoose
    .connect(
        DATABASE,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex:true,
            useFindAndModify: false
        }
    )
    .then(() => console.log("DB Connected"))
    .catch(err => console.log(err));
//middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//routes
app.use("/api",authRoutes)
app.use("/api", userRoutes)
app.use("/api", categoryRoutes)
app.use("/api", carRoutes)
app.use("/api", cityRoutes)

//port
const PORT = process.env.PORT || 5000;
//server
app.listen(PORT,() => {
    console.log(`app is running at ${PORT}`);
})    