'use strict'

var express = require('express');
var ArticuloController = require('../controller/articulo.controller');
var api = express.Router();
var md_auth = require('../midddlewards/autenticated');

var multipart = require('connect-multiparty');
var carpeta_destino_imagen = multipart({ uploadDir: './public/images/articulos' });

api.post('/guardar', carpeta_destino_imagen, ArticuloController.saveArticulo);
api.get('/lista/:page?', ArticuloController.getArticulos);
api.put('/update/:id', carpeta_destino_imagen, ArticuloController.updateArticulo);
api.put('/actualizarimagen/:id', [md_auth.ensureAuth, carpeta_destino_imagen], ArticuloController.uploadImage);
api.delete('/delete/:id', ArticuloController.deleteArticulo);
api.get('/get-image-articulo/:imageFile', ArticuloController.getImageFile);
api.get('/articulo/:id', ArticuloController.getArticulo);
api.get('/articulos', ArticuloController.getAllArticulo);
api.get('/articulosusuario/:id_usuario', md_auth.ensureAuth, ArticuloController.getArticuloUser);
api.put('/update-estado/:id', md_auth.ensureAuth, ArticuloController.updateArticuloEstado);

module.exports = api;