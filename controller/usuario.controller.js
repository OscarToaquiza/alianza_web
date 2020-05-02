'use strict'
var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/usuario.model');
var jwt = require('../services/jwt');


function saveUser(req, res){
	var user = new User();
	var params = req.body;
	console.log(params);
	user.nombre_usuario = params.nombre_usuario;
	user.apellido_usuario = params.apellido_usuario;
	user.email_usuario = params.email_usuario;
    user.cedula_usuario = params.cedula_usuario;
    user.password_usuario = params.password_usuario;
    user.fecha_nacimiento_usuario=params.fecha_nacimiento_usuario;
    user.genero_usuario=params.genero_usuario;
  	user.image_usuario = 'null';

	if(params.password_usuario){
		// Encriptar contraseña
		bcrypt.hash(params.password_usuario, null, null, function(err, hash){
			user.password_usuario = hash;

			if(user.nombre_usuario != null && user.apellido_usuario != null && user.cedula_usuario != null){
				// Guardar el usuario
				user.save((err, userStored) => {
					if(err){
						res.status(500).send({mensaje: 'Error al guardar el usuario'});
					}else{
						if(!userStored){
							res.status(404).send({mensaje: 'No se ha registrado el usuario'});
						}else{
							res.status(200).send({saveuser: userStored});
						}
					}
				});

			}else{
			    res.status(200).send({mensaje: 'Rellena todos los campos'});
			}
		});
	}else{
		res.status(200).send({mensaje: 'Introduce la contraseña'});
	}

}

function loginUser(req, res){
	var params = req.body;

	var cedula = params.cedula;
	var password = params.password;

	User.findOne({cedula_usuario: cedula}, (err, user) => {
		if(err){
			res.status(500).send({mensaje: 'Error en la petición'});
		}else{
			if(!user){
				res.status(404).send({mensaje: 'El usuario no existe'});
			}else{
				console.log(user);
				// Comprobar la contraseña
				bcrypt.compare(password, user.password_usuario, function(err, check){
					if(check){
						//devolver los datos del usuario logueado
						if(params.gethash){
							// devolver un token de jwt
							res.status(200).send({
								token: jwt.createToken(user)
							});
						}else{
							res.status(200).send({user});
						}
					}else{
						res.status(404).send({mensaje: 'El usuario no ha podido loguease'});
					}
				});
			}
		}
	});
}

function updateUser(req, res){
	var userId = req.params.id;
	var update = req.body;

	if(userId != req.user.sub){
	  return res.status(500).send({message: 'No tienes permiso para actualizar este usuario'});
	}

	User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
		if(err){
			res.status(500).send({message: 'Error al actualizar el usuario'});
		}else{
			if(!userUpdated){
				res.status(404).send({message: 'No se ha podido actualizar el usuario'});
			}else{
				res.status(200).send({user: userUpdated});
			}
		}
	});
}

function uploadImage(req, res){
	var userId = req.params.id;
	var file_name = 'No subido...';

	if(req.files){
		var file_path = req.files.image_usuario.path;
		// var file_split = file_path.split('\\');descomentar para pruebas
		var file_split = file_path.split('/');      
		var file_name = file_split[2];

		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1];

		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){

			User.findByIdAndUpdate(userId, {image_usuario: file_name}, (err, userUpdated) => {
				if(!userUpdated){
					res.status(404).send({message: 'No se ha podido actualizar el usuario'});
				}else{
					res.status(200).send({image: file_name, user: userUpdated});
				}
			});

		}else{
			res.status(200).send({message: 'Extensión del archivo no valida'});
		}

	}else{
		res.status(200).send({message: 'No has subido ninguna imagen...'});
	}
}

function getImageFile(req, res){
	var imageFile = req.params.imageFile;
	var path_file = './uploads/users/'+imageFile;
	fs.exists(path_file, function(exists){
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(200).send({message: 'No existe la imagen...'});
		}
	});
}


module.exports = {

	saveUser,
	loginUser,
	updateUser,
	uploadImage,
	getImageFile
};
