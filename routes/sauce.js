const express = require('express')
const router = express.Router()
const upload = require('../controllers/upload');

const sauceCtrl = require('../controllers/sauce');

//upload est le middleware pour capturer et sauver les fichers dans le repertoire images, et le controller sauve l'image dans le DB 
router.post('/', upload ,sauceCtrl.addSauce);
router.get('/', sauceCtrl.getAllSauces);
router.get('/:id', sauceCtrl.getSauce);
router.put('/:id', upload, sauceCtrl.updateSauce);
router.delete('/:id', sauceCtrl.deteteSauce);
router.post('/:id/like', sauceCtrl.setLikeDislike);

module.exports = router;