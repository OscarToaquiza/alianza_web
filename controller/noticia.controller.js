'use strict'
var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');
var Noticia = require('../models/noticia.model');


function getNoticias(req, res) {
    if (req.params.page) {
        var page = req.params.page;
    } else {
        var page = 1;
    }
    var itemsPerPage = 3;
    Noticia.find().sort({ "fecha_publicado_notica": -1 }).paginate(page, itemsPerPage, function(err, noticias, total) {
        if (err) {
            res.status(500).send({ mensaje: 'Error en la petición.' });
        } else {
            if (!noticias) {
                res.status(404).send({ mensaje: 'No hay noticias !!' });
            } else {
                return res.status(200).send({
                    total_items: total,
                    mensaje: noticias
                });
            }
        }
    });
}

function getNoticia(req, res) {
    var noticiaId = req.params.id;
    Noticia.findById(noticiaId).exec((err, noticiaE) => {
        if (err) {
            res.status(500).send({ mensaje: "Error en el Servidor" });
        } else {
            if (!noticiaE) {
                res.status(404).send({ mensaje: "No se ha encontrado la noticia" })
            } else {
                res.status(200).send({ noticiaE });
            }
        }
    });
}

function getAllNoticia(req, res) {
    Noticia.find().exec((err, noticiaE) => {
        if (err) {
            res.status(500).send({ mensaje: "Error en el Servidor" });
        } else {
            if (!noticiaE) {
                res.status(404).send({ mensaje: "No se ha encontrado la noticia" })
            } else {
                res.status(200).send({ noticiaE });
            }
        }
    });
}

function saveNoticia(req, res) {
    var noticia = new Noticia();
    var params = req.body;
    noticia.titulo_noticia = params.titulo_noticia;
    noticia.descripcion_noticia = params.descripcion_noticia;
    noticia.observacion_noticia = params.observacion_noticia;
    noticia.enlace_noticia = params.enlace_noticia;
    noticia.id_usuario = params.id_usuario;
    if (req.files && req.files.imagen_noticia != undefined) {
        var file_path = req.files.imagen_noticia.path;
        var file_split = file_path.split('/');
        var file_name = file_split[3];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        if (file_ext == 'PNG' || file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
            noticia.imagen_noticia = file_name;
            noticia.save((err, noticiaGuardada) => {
                if (err) {
                    res.status(500).send({ mensaje: 'Error en el servidor' });
                } else {
                    if (!noticiaGuardada) {
                        res.status(404).send({ mensaje: 'No se ha guardado la noticia' });
                    } else {
                        res.status(200).send({ noticiaGuardada });
                    }
                }
            });
        } else {
            res.status(200).send({
                mensaje: "Extension del archivo no valido"
            });
        }
    } else {
        noticia.imagen_noticia = "default_noticia.jpg";
        noticia.save((err, noticiaGuardada) => {
            if (err) {
                res.status(500).send({ mensaje: 'Error en el servidor' });
            } else {
                if (!noticiaGuardada) {
                    res.status(404).send({ mensaje: 'No se ha guardado la noticia' });
                } else {
                    res.status(200).send({ mensaje: noticiaGuardada });
                }
            }
        });
    }


}

function updateNoticia(req, res) {
    var noticiaId = req.params.id;
    var update = req.body;
    console.log(update);
    if (req.files && req.files.imagen_noticia != undefined) {
        var file_path = req.files.imagen_noticia.path;
        var file_split = file_path.split('/');
        var file_name = file_split[3];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        if (file_ext == 'PNG' || file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
            update.imagen_noticia = file_name;
        } else {
            res.status(200).send({
                mensaje: "Extension del archivo no valido"
            });
        }
    }
    console.log(update.imagen_noticia);
    Noticia.findByIdAndUpdate(noticiaId, update, (err, noticiaUpdated) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor' });
        } else {
            if (!noticiaUpdated) {
                res.status(404).send({ mensaje: 'No se ha actualizado la noticia' });
            } else {
                res.status(200).send({ noticiaUpdated });
            }
        }
    });
}

function deleteNoticia(req, res) {
    var noticiaId = req.params.id;
    Noticia.findByIdAndRemove(noticiaId, (err, noticiaEliminada) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor' });
        } else {
            if (!noticiaEliminada) {
                res.status(404).send({ mensaje: 'La noticia no ha sido eliminado' });
            } else {
                res.status(200).send({ noticiaEliminada });
            }
        }

    });
}

function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var path_file = './public/images/noticias/' + imageFile;
    fs.exists(path_file, function(exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(404).send("No existe imagen.");
        }
    });
}

function uploadImage(req, res) {
    var noticiaId = req.params.id;
    var file_name = 'No subido...';
    if (req.files) {
        var file_path = req.files.imagen_noticia.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[3];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'PNG') {
            Noticia.findByIdAndUpdate(noticiaId, { imagen_noticia: file_name }, (err, noticiaUpdated) => {
                if (!noticiaUpdated) {
                    res.status(404).send({ message: 'No se ha podido actualizar el curso' });
                } else {
                    res.status(200).send({ imagen: file_name, noticia: noticiaUpdated });
                }
            });

        } else {
            res.status(200).send({ message: 'Extensión del archivo no valida' });
        }

    } else {
        res.status(200).send({ message: 'No has subido ninguna imagen...' });
    }
}


module.exports = {
    getNoticias,
    saveNoticia,
    updateNoticia,
    deleteNoticia,
    getImageFile,
    getNoticia,
    uploadImage,
    getAllNoticia
};