const User = require("../models/userModel")
const bcrypt = require("bcrypt");

class UserController {

    async getUsers(req, res) {
        try {
            const users = await User.find()

            return res.send(users);
        } catch (error) {
            return res.send(error.message);
        }
    }

    async postUsers(req, res) {
        const { cadastro, senha } = req.body;

        try {

            const userExistente = await User.findOne({ cadastro: cadastro })

            if (userExistente) {
                return res.send("Usuário já existe");
            }
            const passwordCrypt = bcrypt.hashSync(senha, 5);
            //hashSync é o retorno da senha criptografada, numero de vezes que vai criptografar

            await User.create({ cadastro: cadastro, senha: passwordCrypt })
            return res.send("Usuario criado! Agora será possível utilizar os favoritos");
        } catch (error) {
            return res.send(error.message);

        }
    }

    async patchUsers(req, res) {

        const { novasenha } = req.body;
        const { id } = req.params;

        try {

            const user = await User.findOneAndUpdate({ _id: id }, { senha: novasenha }, { new: true })

            if (!user) {
                return res.send("Usuário não encontrado");
            }

            return res.send(user);
        } catch (error) {
            return res.send(error.message);
        }

    }

    async deleteUsers(req, res) {

        try {

            const { cadastro, senha } = req.body;
            const { id } = req.params;
            const user = await User.findOne({ _id: id, cadastro: cadastro });

            if (!user) {
                return res.send("Usuário não encontrado");
            }
            const comparePass = bcrypt.compareSync(senha, user.senha); // vai retornar true ou false;
            //comparar a senha q veio do body, o hash que está salvo no Banco

            if (!comparePass) {
                return res.send("usuario ou senha incorreta")
            }

            await User.deleteOne({ _id: id, cadastro: cadastro });

            return res.send("Usuario apagado com sucesso");
        } catch (error) {
            return res.send(error.message);
        }

    }

}

module.exports = new UserController;