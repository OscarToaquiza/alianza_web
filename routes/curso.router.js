'use strict'

var express = require('express');
var CursoController = require('../controller/curso.controller');

var api = express.Router();

var md_auth = require('../midddlewards/autenticated');

var multipart = require('connect-multiparty');
var carpeta_curso = multipart({uploadDir : './public/images/cursos'});

api.post('/guardar',  carpeta_curso, CursoController.saveCurso);
api.get('/listar', CursoController.getCursos);
api.get('/curso/:id', CursoController.getCurso);
api.delete('/borrar/:id',CursoController.deleteCurso);
//api.get('/getimagen/:imageFile',CursoController.getImageFile);
api.get('/getarchivo/:archivoFile',CursoController.getarchivoFile);
api.put('/actualizarimagen/:id',[md_auth.ensureAuth, carpeta_curso], CursoController.uploadImage);
api.put('/actualizararchivo/:id',[md_auth.ensureAuth, carpeta_curso], CursoController.uploadArchivo);
api.put('/actualizar/:id',carpeta_curso, CursoController.updateCurso);
api.get('/lista/:page?',CursoController.getCursosLista);

module.exports=api