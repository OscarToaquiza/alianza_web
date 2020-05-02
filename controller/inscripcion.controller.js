'use strict'
var mongoose = require('mongoose');
var Inscripcion = require('../models/inscripcion.model');
var ObjectID = mongoose.Types.ObjectId;

function saveInscripcion(req, res) {
	var inscripcion = new Inscripcion();
	var params = req.body;
	console.log(params);
	inscripcion.id_usuario = params.id_usuario;
	inscripcion.id_curso = params.id_curso;
	inscripcion.observacion_inscripcion = params.observacion_inscripcion;

	inscripcion.save((err, inscripcionG) => {
		if (err) {
			res.status(500).send({ mensaje: "Error en el Servidor" });
		} else {
			if (!inscripcionG) {
				res.status(404).send({ mensaje: "Error al realizar la inscripcion" });
			} else {
				res.status(200).send({ inscripcionG });
			}
		}
	});
}

function updateInscripcion(req, res) {
	var inscripcionId = req.params.id;
	var update = req.body;

	Inscripcion.findByIdAndUpdate(inscripcionId, update, (err, inscripcionAc) => {
		if (err) {
			res.status(500).send({ mensaje: 'Error en el servidor' });
		} else {
			if (!inscripcionAc) {
				res.status(404).send({ mensaje: 'No se ha actualizado la noticia' });
			} else {
				res.status(200).send({ inscripcionAc });
			}
		}
	});
}

function UsuarioEnCurso(req, res){
	console.log(req.body);
	var id_user = req.body.id_user;
	var id_curso_p = req.body.id_curso;
	
	Inscripcion.find(  { $and: [ {id_usuario: new ObjectID(id_user)},{id_curso:new ObjectID(id_curso_p)} ] } ).exec( (err, encotrado) => {
		if (err) {
			res.status(500).send({ mensaje: 'Error en el servidor' });
		} else {
			if (!encotrado) {
				res.status(404).send({ data: false });
			} else {
				console.log(encotrado.length);
				if(encotrado.length == 0){
					res.status(200).send({ data: false });
				}else{
					res.status(200).send({ data: true });
				}
			}
		}
	});
}

function updateInscripcionEstado(req, res) {
	var inscripcionId = req.params.id;
	var update = req.body.estado_inscripcion;
	console.log("Estado de la Inscripcion" + update);
	Inscripcion.findByIdAndUpdate(inscripcionId, {estado_inscripcion: update}, (err, inscripcionAc) => {
		if (err) {
			res.status(500).send({ mensaje: 'Error en el servidor' });
		} else {
			if (!inscripcionAc) {
				res.status(404).send({ mensaje: 'No se ha actualizado la noticia' });
			} else {
				res.status(200).send({ inscripcionAc });
			}
		}
	});
}

function borrar(req, res) {
	var inscripcionId = req.params.id;
	Inscripcion.findByIdAndRemove(inscripcionId, (err, Eliminado) => {
		if (err) {
			res.status(500).send({ mensaje: 'Error en el servidor' });
		} else {
			if (!Eliminado) {
				res.status(404).send({ mensaje: 'La inscripcion no ha podido ser eliminada' });
			} else {
				res.status(200).send({ Eliminado });
			}
		}

	});
}


function getUsuarioCursos(req, res) {
	var id_user = req.params.id;
	Inscripcion.find({ id_usuario: id_user }).populate('id_curso').populate('id_usuario').exec((err, cursos) => {
		if (err) {
			res.status(500).send({ mensaje: 'Error en la petición.' });
		} else {
			if (!cursos) {
				res.status(404).send({ mensaje: 'No hay cursos' });
			} else {
				return res.status(200).send({ cursos });
			}
		}
	});
}

function getInscritos(req, res) {
	var cursoId = req.body.id_curso;
	if (req.params.page) {
		var page = req.params.page;
	} else {
		var page = 1;
	}
	var itemsPerPage = 10;
	Inscripcion.find({ id_curso: cursoId }).populate('id_curso').populate('id_usuario').paginate(page, itemsPerPage, function (err, inscritos, total) {
		if (err) {
			res.status(500).send({ mensaje: 'Error en la petición.' });
		} else {
			if (!inscritos) {
				res.status(404).send({ mensaje: 'No hay inscripciones' });
			} else {
				return res.status(200).send({
					total_items: total,
					datos: inscritos
				});
			}
		}
	});
}

function getInscripcion(req, res) {
	var cursoId = req.params.id_curso;
	Inscripcion.find({ id_curso: cursoId }).populate('id_curso').populate('id_usuario').exec((err, cursos) => {
		if (err) {
			res.status(500).send({ mensaje: 'Error en la petición.' });
		} else {
			if (!cursos) {
				res.status(404).send({ mensaje: 'No hay cursos' });
			} else {
				return res.status(200).send({ cursos });
			}
		}
	});
}


module.exports = {
	getInscritos,
	borrar,
	saveInscripcion,
	updateInscripcion,
	updateInscripcionEstado,
	UsuarioEnCurso,
	getUsuarioCursos,
	getInscripcion
}