'use strict'
var User = require('../models/user.model');
var path = require('path');
var fs = require('fs');
var bcrypt = require('bcrypt-nodejs');
var jwt = require("../services/jwt");

function saveUser(req, res) {

    var usuario = new User();
    var parametros = req.body;

    usuario.nombre_usuario = parametros.nombre_usuario;
    usuario.apellido_usuario = parametros.apellido_usuario;
    usuario.telefono_usuario = parametros.telefono_usuario;
    usuario.cedula_usuario = parametros.cedula_usuario;
    usuario.email_usuario = parametros.email_usuario;
    //usuario.password_usuario = parametros.password_usuario;
    usuario.fecha_nacimiento_usuario = parametros.fecha_nacimiento_usuario;
    usuario.rol_usuario = parametros.rol_usuario
    usuario.empresa_usuario = parametros.empresa_usuario;
    usuario.correo_empresa_usuario = parametros.correo_empresa_usuario;

    bcrypt.hash(parametros.password_usuario, null, null, function(err, hash) {
        usuario.password_usuario = hash;
        if (err) {
            res.status(500).send({ mensaje: "Error al encriptar el password" });
        } else {
            if (req.files && req.files.imagen_usuario != undefined) {
                var file_path = req.files.imagen_usuario.path;
                var file_split = file_path.split('/');
                var file_name = file_split[3];
                var ext_split = file_name.split('\.');
                var file_ext = ext_split[1];
                if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'PNG') {
                    usuario.imagen_usuario = file_name;
                    usuario.save((err, usuarioGuardado) => {
                        if (err) {
                            res.status(500).send({ mensaje: "Error en el servidor..." });
                        } else {
                            if (!usuarioGuardado) {
                                res.status(404).send({ mensaje: "Error al guardar el usuario, verifique su conexion" });
                            } else {
                                res.status(200).send({ usuarioGuardado });
                            }
                        }
                    });
                }
            } else {
                usuario.imagen_usuario = "user_default.png"
                console.log("Usuario sin IMAGEN...");
                console.log(usuario);
                usuario.save((err, usuarioGuardado) => {
                    console.log(err);
                    if (err) {
                        if (err.code === 11000) {
                            res.status(404).send({ mensaje: "El correo electrónico ya está registrado " });
                        } else {
                            res.status(500).send({ mensaje: "Error en el servidor..." });
                        }
                    } else {
                        if (!usuarioGuardado) {
                            res.status(404).send({ mensaje: "Error al guardar el usuario, verifique su conexion" });
                        } else {
                            res.status(200).send({ usuarioGuardado });
                        }
                    }
                });
            }
        }
    });

}

function loginUser(req, res) {
    var params = req.body;

    var correo = params.email;
    var password = params.password;

    User.findOne({ email_usuario: correo }, (err, user) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en la petición' });
        } else {
            if (!user) {
                res.status(404).send({ mensaje: 'El usuario no existe' });
            } else {
                console.log(params);
                // Comprobar la contraseña
                bcrypt.compare(password, user.password_usuario, function(err, check) {
                    if (check) {
                        //devolver los datos del usuario logueado
                        if (params.gethash) {
                            // devolver un token de jwt
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        } else {
                            res.status(200).send({ user });
                        }
                    } else {
                        res.status(404).send({ mensaje: 'El usuario no ha podido ingresar...' });
                    }
                });
            }
        }
    });
}

function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;
    console.log(userId);
    console.log(update);

    // if (userId != req.user.sub) {
    //     return res.status(500).send({ message: 'No tienes permiso para actualizar este usuario' });
    // }

    User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Error al actualizar el usuario' });
        } else {
            if (!userUpdated) {
                res.status(404).send({ message: 'No se ha podido actualizar el usuario' });
            } else {
                res.status(200).send({ user: userUpdated });
            }
        }
    });
}

function updatePassword(req, res) {
    console.log("Cambio de Cotraseña");
    var userId = req.params.id;
    var pass = req.body.password_usuario;
    console.log(pass);
    if (userId != req.user.sub) {
        return res.status(500).send({ message: 'No tienes permiso para actualizar este usuario' });
    }
    bcrypt.hash(pass, null, null, function(err, hash) {
        console.log(pass);
        var new_pass = hash;
        User.findByIdAndUpdate(userId, { password_usuario: new_pass }, (err, userUpdated) => {
            if (err) {
                res.status(500).send({ message: 'Error al actualizar la contraseña' });
            } else {
                if (!userUpdated) {
                    res.status(404).send({ message: 'No se ha podido actualizar la contraseña' });
                } else {
                    console.log(pass);
                    res.status(200).send({ user: userUpdated });
                }
            }
        });

    });

}

function getUser(req, res) {
    var userId = req.params.id;
    User.findById(userId, (err, userFind) => {
        if (err) {
            res.status(500).send({ message: 'Error en el servidor' });
        } else {
            if (!userFind) {
                res.status(404).send({ message: 'No se ha podido encontrar el usuario' });
            } else {
                res.status(200).send({ user: userFind });
            }
        }
    });
}

function getUsers(req, res) {
    User.find({}).exec((err, userFinds) => {
        if (err) {
            res.status(500).send({ message: 'Error en el servidor' });
        } else {
            if (!userFinds) {
                res.status(404).send({ message: 'No se ha podido encontrar el usuario' });
            } else {
                res.status(200).send({ users: userFinds });
            }
        }
    });
}

function getUserByEmail(req, res) {
    var emailUser = req.params.emailUser;
    console.log(emailUser);
    User.findOne({ email_usuario: emailUser }, (err, userFind) => {
        console.log(err);
        if (err) {
            res.status(500).send({ message: 'Error en el servidor' });
        } else {
            if (!userFind) {
                res.status(404).send({ message: 'No se ha podido encontrar el usuario' });
            } else {
                console.log("Usuario Encontrado...");
                var userId = userFind._id;
                console.log("id " + userId);
                User.findByIdAndUpdate(userId, { confirm_email: true }, (errorEamil, confirmOk) => {
                    if (errorEamil) {
                        res.status(500).send({ message: "Error en el servidor, intente mas tarde" });
                    } else {
                        if (!confirmOk) {
                            res.status(404).send({ message: "No se puede confirmar tu correo electronico" });
                        } else {
                            res.status(200).send({ confirmOk });
                        }
                    }
                });
            }
        }
    });
}

function uploadImage(req, res) {
    var userId = req.params.id;
    var file_name = 'No subido...';

    if (req.files) {
        var file_path = req.files.imagen_usuario.path;
        var file_split = file_path.split('/');
        var file_name = file_split[3];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {

            User.findByIdAndUpdate(userId, { imagen_usuario: file_name }, (err, userUpdated) => {
                if (!userUpdated) {
                    res.status(404).send({ message: 'No se ha podido actualizar el usuario' });
                } else {
                    res.status(200).send({ image: file_name, user: userUpdated });
                }
            });

        } else {
            res.status(200).send({ message: 'Extensión del archivo no valida' });
        }

    } else {
        res.status(200).send({ message: 'No has subido ninguna imagen...' });
    }
}

function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var path_file = './public/images/foto_personal/' + imageFile;
    fs.exists(path_file, function(exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'No existe la imagen...' });
        }
    });
}

function deleteUsuario(req, res) {
    var userId = req.params.id;
    User.findByIdAndRemove(userId, function(err, deleteUser) {
        if (err) {
            res.status(500).send({ message: "Error al eliminar Usuario." });
        } else {
            if (!deleteUser) {
                res.status(404).send({ message: "El usuario no ha  podido ser eliminado." });
            } else {
                res.status(200).send({ deleteUser });

            }
        }
    });
}


function confirmEmail(req, res) {
    var userId = req.params.id;
    User.findByIdAndUpdate(userId, { confirm_email: true }, (err, confirmOk) => {
        if (err) {
            res.status(500).send({ message: "Error en ele servidor, intente mas tarde" });
        } else {
            if (!confirm) {
                res.status(404).send({ message: "No se puede confirmar tu correo electronico" });
            } else {
                res.status(200).send({ confirmOk });
            }
        }
    });
}

function confirmEmailReset(req, res) {
    var userId = req.params.id;
    User.findByIdAndUpdate(userId, { confirm_email: false }, (err, confirmOk) => {
        if (err) {
            res.status(500).send({ message: "Error en ele servidor, intente mas tarde" });
        } else {
            if (!confirm) {
                res.status(404).send({ message: "No se puede confirmar tu correo electronico" });
            } else {
                res.status(200).send({ confirmOk });
            }
        }
    });
}


module.exports = {
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile,
    updatePassword,
    getUser,
    deleteUsuario,
    confirmEmail,
    getUserByEmail,
    getUsers,
    confirmEmailReset
};