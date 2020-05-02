'use strict'

var express = require('express');
var InscripcionController = require('../controller/inscripcion.controller');
var api = express.Router();
var md_auth = require('../midddlewards/autenticated');

api.post('/crear', InscripcionController.saveInscripcion);
api.get('/lista/:page?', InscripcionController.getInscritos);
api.get('/listaByCurso/:id_curso', InscripcionController.getInscripcion);
api.put('/actualizar/:id', md_auth.ensureAuth, InscripcionController.updateInscripcion);
api.put('/actualizarEstado/:id', md_auth.ensureAuth, InscripcionController.updateInscripcionEstado);
api.post('/usuario', InscripcionController.UsuarioEnCurso);
api.get('/byuser/:id', InscripcionController.getUsuarioCursos);
api.delete('/eliminar/:id', InscripcionController.borrar);

module.exports = api;