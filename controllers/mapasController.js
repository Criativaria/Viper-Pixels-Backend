const { Mapas, Bombs, Pixels, VersaoPixel } = require("../models/mapasModel");

class MapasController {

    async getMapas(req, res) {
        try {
            const mapas = await Mapas.find()
                .populate({
                    path: 'bomb',
                    populate: {
                        path: 'pixel',
                        populate: {
                            path: 'versao'
                        }
                    }
                })

            if (!mapas || mapas.length === 0) return res.status(404).send('Nenhum mapa encontrado');

            return res.status(200).send(mapas);

        } catch (error) {
            res.status(500).send({ error: "Erro na busca dos mapas" })
        }
    }

    async getMapa(req, res) {
        const { name } = req.params;

        if (!name) return res.status(500).send('Nome do mapa vazio');

        try {
            const mapas = await Mapas.findOne({ name: name })
                .populate({
                    path: 'bomb',
                    populate: {
                        path: 'pixel',
                        populate: {
                            path: 'versao'
                        }
                    }
                })
            if (!mapas || mapas.length === 0) return res.status(404).send('Mapa não encontrado');

            return res.status(200).send(mapas);
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: "Erro na busca do bomb pixel" })
        }
    }

    async postMapas(req, res) {
        const { name, link_capa, bombName, pixels, mapa_img, nomePixel } = req.body;

        try {
            var mapa = await Mapas.findOne({ name: name });
            if (!mapa) mapa = await Mapas.create({ name, link_capa, mapa_img });

            var bomb = await Bombs.findOne({ mapa: mapa._id, bombName: bombName });
            if (!bomb) bomb = await Bombs.create({ mapa: mapa._id, mapaName: mapa.name, bombName: bombName });

            var pixel = await Pixels.findOne({ bomb: bomb._id, mapa: mapa._id, nome: nomePixel });
            if (!pixel) pixel = await Pixels.create({ bomb: bomb._id, mapa: mapa._id, nome: nomePixel });

            const versaoIds = await Promise.all(pixels.map(async (newpixel) => {
                const versaoResult = await VersaoPixel.findOne({ bomb: bomb._id, mapa: mapa._id, pixel: pixel._id, versao: newpixel.versao })

                if (!versaoResult) {
                    const versaoRegistro = await VersaoPixel.create({ bomb: bomb._id, mapa: mapa._id, pixel: pixel._id, ...newpixel })

                    return versaoRegistro._id;
                }
                return null;
            }))

            const versoesValidas = await Promise.all(versaoIds.filter((pixel) => pixel != null));


            if (versoesValidas && versoesValidas.length > 0) {
                // const bombBusca = await Bombs.findOne({ _id: bomb._id })
                const pixelBusca = await Pixels.findOne({ _id: pixel._id })

                const novasVersoes = [...pixelBusca.versao, ...versoesValidas];

                // console.log(novasVersoes)

                await Pixels.findOneAndUpdate({ _id: pixelBusca._id }, { versao: novasVersoes });
            } else {
                return res.status(500).send(`A versão do ${pixel.nome} no ${bomb.bombName} do mapa ${mapa.name} já existe`);
            }

            const bombExiste = mapa.bomb.some((idBomb) => idBomb.toString() === bomb._id.toString());
            if (bombExiste) return res.status(200).send("Bomb ja existe, pixel criado com sucesso")

            const bombIds = [...mapa.bomb, bomb._id];
            await Mapas.findOneAndUpdate({ _id: mapa._id }, { bomb: bombIds });

            const pixelExiste = bomb.pixel.some((idPixel) => idPixel.toString() === pixel._id.toString());
            if (pixelExiste) return res.status(200).send("Pixel ja existe, versão criado com sucesso")

            const pixelsIds = [...bomb.pixel, pixel._id];
            await Bombs.findOneAndUpdate({ _id: bomb._id, mapa: mapa._id }, { pixel: pixelsIds });

            return res.status(200).send("Bomb e pixels criado com sucesso")

        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Erro na criação do bomb" })
        }
    }

    async patchMapas(req, res) {
        const { mapaName, bombName, pixelName, versao, atualizacao } = req.body;

        try {
            const mapa = await Mapas.findOne({ name: mapaName });
            if (!mapa) return res.status(404).send('Mapa não encontrado');

            const bomb = await Bombs.findOne({ mapa: mapa._id, bombName })
            if (!bomb) return res.status(404).send(`esse bomb não existe no mapa ${mapa.name}`)

            const pixel = await Pixels.findOne({ mapa: mapa._id, bomb: bomb._id, nome: pixelName })
            if (!pixel) return res.status(404).send(`esse pixel não existe no bomb ${bomb.name} no mapa ${mapa.name}`)

            const versaoAtualizada = await VersaoPixel.findOneAndUpdate(
                {
                    bomb: bomb._id,
                    mapa: mapa._id,
                    pixel: pixel._id,
                    versao: versao
                },
                { ...atualizacao },
                { new: true }

            );

            if (!versaoAtualizada) { return res.status(404).send(`Essa versao do ${pixel.nome} nooo ${bomb.bombName} do mapa ${mapa.name} não existe`) }

            res.status(200).send(versaoAtualizada);

        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: "Erro atualizando o pixel" })
        }
    }

    async deleteMapas(req, res) {

        try {
            await Mapas.deleteMany({});
            await Bombs.deleteMany({});
            await Pixels.deleteMany({});
            await VersaoPixel.deleteMany({});
            res.status(200).send("Banco de dados limpo com sucesso")
        } catch (error) {
            res.status(400).send({ error: "erro ao deletar todo o Banco de Dados" })
        }

    }
}

module.exports = new MapasController;