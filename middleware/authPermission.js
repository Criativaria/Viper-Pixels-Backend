
function AuthPermission(req, res, next) {

    const { permission } = req.body;

    if (!permission) {
        return res.send("Não autorizado");
    }
    next()

}

//ver se ta logada

module.exports = AuthPermission;