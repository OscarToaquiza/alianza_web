var express = require('express');
var Route_controller = require('../controller/email.controller');
var router = express.Router();

router.post('/',Route_controller.sendEmail);
router.post('/inscripcioncurso',Route_controller.sendEmailInscripcion);
router.post('/contacto',Route_controller.sendEmailContacto);
router.post('/resetpass1',Route_controller.sendEmailReset1);
router.post('/resetpass2',Route_controller.sendEmailReset2);

module.exports = router;
