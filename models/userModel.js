const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({ //rascunho

    cadastro: String,
    senha: String,
    permissao: {
        type: Boolean,
        default: false
    }
})

const User = mongoose.model("User", userSchema); //desenho

module.exports = User; //exportando funciona no javascript puro