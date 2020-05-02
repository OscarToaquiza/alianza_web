'use strict'

var express = require('express');
var NoticiaController = require('../controller/noticia.controller');
var api = express.Router();
var md_auth = require('../midddlewards/autenticated');

var multipart = require('connect-multiparty');
var carpeta_destino_imagen = multipart({uploadDir : './public/images/noticias'});

api.post('/guardar', carpeta_destino_imagen, NoticiaController.saveNoticia);
api.get('/lista/:page?', NoticiaController.getNoticias);
api.put('/update/:id',carpeta_destino_imagen, NoticiaController.updateNoticia);
api.put('/actualizarimagen/:id',[md_auth.ensureAuth,carpeta_destino_imagen],NoticiaController.uploadImage);
api.delete('/delete/:id', NoticiaController.deleteNoticia);
api.get('/get-image-noticia/:imageFile', NoticiaController.getImageFile);
api.get('/noticia/:id',NoticiaController.getNoticia);
api.get('/noticias',NoticiaController.getAllNoticia);

module.exports = api;