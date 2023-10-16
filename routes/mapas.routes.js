const router = require('express').Router();
const MapasController = require("../controllers/mapasController");

router.get("/", (req, res) => MapasController.getMapas(req, res));
router.get("/:name", (req, res) => MapasController.getMapa(req, res));
router.post("/", (req, res) => MapasController.postMapas(req, res));
router.patch("/", (req, res) => MapasController.patchMapas(req, res));
router.delete("/", (req, res) => MapasController.deleteMapas(req, res));


module.exports = router;