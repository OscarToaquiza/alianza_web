'use strict'

var express = require('express');
var UserController = require('../controller/user.cotroller');

var api = express.Router();

var multipart = require('connect-multiparty');
var md_auth = require('../midddlewards/autenticated');
var carpeta_destino_imagen = multipart({uploadDir : './public/images/foto_personal'});

api.post('/register', carpeta_destino_imagen ,UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/update/:id', md_auth.ensureAuth, UserController.updateUser);
api.put('/updatepassword/:id', md_auth.ensureAuth, UserController.updatePassword);
api.put('/updateimage/:id',[md_auth.ensureAuth, carpeta_destino_imagen], UserController.uploadImage);
api.get('/getFotoUser/:imageFile', UserController.getImageFile);
api.get('/getuser/:id', UserController.getUser);
api.delete('/delete/:id', UserController.deleteUsuario);
api.get('/confirm_email/:id', UserController.confirmEmail);
api.get('/confirm_email_reset/:id', UserController.confirmEmailReset);
api.get('/findByEmail/:emailUser',UserController.getUserByEmail);
api.get('/users',UserController.getUsers);

module.exports = api;