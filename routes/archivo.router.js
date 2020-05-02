'use strict'

var express = require('express');
var api = express.Router();
var ArchivoController = require('../controller/archivo.controller');

var md_auth = require('../midddlewards/autenticated');

var multipart = require('connect-multiparty');
var carpeta_destino = multipart({uploadDir : './public/images/archivos'});

api.post('/guardar', [md_auth.ensureAuth,carpeta_destino], ArchivoController.saveArchivo );
api.get('/archivo/:id', ArchivoController.getArchivo);
api.get('/getarchivo/:archivoFile', ArchivoController.getarchivoFile);
api.get('/getarchivos', ArchivoController.getTodosArchivos);
api.delete('/delete/:id', md_auth.ensureAuth, ArchivoController.deleteArchivo);
api.get('/archivosusuario/:id_usuario', md_auth.ensureAuth, ArchivoController.getArchivoUsuario);
api.put('/actualizararchivo/:id', carpeta_destino, ArchivoController.updateArchivo);

module.exports = api;

