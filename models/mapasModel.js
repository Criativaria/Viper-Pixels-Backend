const mongoose = require("mongoose");

const MapasSchema = new mongoose.Schema({

    name: String,
    link_capa: String,
    mapa_img: String,
    bomb: [{
        type: String,
        ref: 'Bombs' //referenciando o model bombs
    }],
    __v: {
        type: Number,
        select: false
    }
});

const BombsSchema = new mongoose.Schema({

    mapa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mapas',
        require: true,
    },
    bombName: String,
    pixel: [{
        type: String,
        ref: 'Pixels'
    }],
    __v: {
        type: Number, //cria um campo de versão automatico (espero q um dia eu entenda)
        select: false // não aparece nas consultas 
    }
})

const PixelsSchema = new mongoose.Schema({
    bomb: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bombs',
        require: true

    },
    mapa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mapas',
        require: true,
    },
    nome: String,
    capa: String,
    versao: [{
        type: String,
        ref: 'VersaoPixel'
    }],
    __v: {
        type: Number,
        select: false
    }
})

const VersaoPixelSchema = new mongoose.Schema({
    bomb: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bombs',
        require: true

    },
    mapa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mapas',
        require: true,
    },
    pixel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pixels',
        require: true,
    },
    versao: String,
    gif: String,
    passo1: String,
    passo2: String,
    passo3: String,
    passo4: String,
    __v: {
        type: Number,
        select: false
    }
})

const Mapas = mongoose.model("Mapas", MapasSchema);
const Bombs = mongoose.model("Bombs", BombsSchema);
const Pixels = mongoose.model("Pixels", PixelsSchema);
const VersaoPixel = mongoose.model("VersaoPixel", VersaoPixelSchema);

module.exports = { Mapas: Mapas, Bombs: Bombs, Pixels: Pixels, VersaoPixel: VersaoPixel };
