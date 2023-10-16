require("dotenv").config();
const userRoutes = require("./routes/user.routes")
const mapasRoutes = require("./routes/mapas.routes")
const mongoose = require("mongoose");

const express = require("express");
const app = express();
const cors = require("cors");
const urlBanco = `mongodb+srv://Criativaria:${process.env.DB_PASS}@viperpixelsdb.fwiupp7.mongodb.net/?retryWrites=true&w=majority`

app.use(cors());
app.use(express.json());

app.use("/user", userRoutes);
app.use("/mapas", mapasRoutes);

mongoose.connect(urlBanco).then(() => {

    app.listen(3000, () => {
        console.log("Funfando! 😽💗 na porta 3000");
    })

}).catch((error) => console.log(error));