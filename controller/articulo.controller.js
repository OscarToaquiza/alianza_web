'use strict'
var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');
var Articulo = require('../models/articulo.model');


function getArticulos(req, res) {
    if (req.params.page) {
        var page = req.params.page;
    } else {
        var page = 1;
    }
    var itemsPerPage = 5;
    Articulo.find().sort({ "fecha_publicado_articulo": -1 }).paginate(page, itemsPerPage, function(err, Articulos, total) {
        if (err) {
            res.status(500).send({ mensaje: 'Error en la petición.' });
        } else {
            if (!Articulos) {
                res.status(404).send({ mensaje: 'No hay Articulos !!' });
            } else {
                return res.status(200).send({
                    total_items: total,
                    mensaje: Articulos
                });
            }
        }
    });
}

function getArticulo(req, res) {
    var ArticuloId = req.params.id;
    Articulo.findById(ArticuloId).populate('id_usuario').exec((err, ArticuloE) => {
        if (err) {
            res.status(500).send({ mensaje: "Error en el Servidor" });
        } else {
            if (!ArticuloE) {
                res.status(404).send({ mensaje: "No se ha encontrado la Articulo" })
            } else {
                res.status(200).send({ ArticuloE });
            }
        }
    });
}

function getArticuloUser(req, res) {
    var userId = req.params.id_usuario;
    Articulo.find({ id_usuario: userId }).exec((err, articulosE) => {
        if (err) {
            res.status(500).send({ mensaje: "Error en el Servidor" });
        } else {
            if (!articulosE) {
                res.status(404).send({ mensaje: "No se encontraron articulos..." });
            } else {
                res.status(200).send({ articulosE })
            }
        }
    });
}

function getAllArticulo(req, res) {
    console.log('BuscandoArticulos');
    Articulo.find().populate('id_usuario').exec((err, articulosE) => {
        if (err) {
            res.status(500).send({ mensaje: "Error en el Servidor" });
        } else {
            if (!articulosE) {
                res.status(404).send({ mensaje: "No se ha encontrado la Articulo" })
            } else {
                res.status(200).send({ articulosE });
            }
        }
    });
}

function saveArticulo(req, res) {
    var articulo = new Articulo();
    var params = req.body;

    articulo.titulo_articulo = params.titulo_articulo;
    articulo.descripcion_articulo = params.descripcion_articulo;
    articulo.observacion_articulo = params.observacion_articulo;
    articulo.id_usuario = params.id_usuario;
    if (req.files && req.files.imagen_articulo != undefined) {
        console.log('con imagen');
        var file_path = req.files.imagen_articulo.path;
        var file_split = file_path.split('/');
        var file_name = file_split[3];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        if (file_ext == 'PNG' || file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
            articulo.imagen_articulo = file_name;
            articulo.save((err, ArticuloGuardada) => {
                if (err) {
                    res.status(500).send({ mensaje: 'Error en el servidor' });
                } else {
                    if (!ArticuloGuardada) {
                        res.status(404).send({ mensaje: 'No se ha guardado la Articulo' });
                    } else {
                        res.status(200).send({ ArticuloGuardada });
                    }
                }
            });
        } else {
            res.status(200).send({
                mensaje: "Extension del archivo no valido"
            });
        }
    } else {
        console.log('sin imagen');
        articulo.imagen_articulo = "default_articulo.jpg";
        articulo.save((err, ArticuloGuardado) => {
            if (err) {
                res.status(500).send({ mensaje: 'Error en el servidor' });
            } else {
                if (!ArticuloGuardada) {
                    res.status(404).send({ mensaje: 'No se ha guardado la Articulo' });
                } else {
                    res.status(200).send({ mensaje: ArticuloGuardado });
                }
            }
        });
    }


}

function updateArticulo(req, res) {
    var ArticuloId = req.params.id;
    var update = req.body;
    console.log(update);
    if (req.files && req.files.imagen_articulo != undefined) {
        var file_path = req.files.imagen_articulo.path;
        var file_split = file_path.split('/');
        var file_name = file_split[3];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        if (file_ext == 'PNG' || file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
            update.imagen_articulo = file_name;
        } else {
            res.status(200).send({
                mensaje: "Extension del archivo no valido"
            });
        }
    }
    console.log(update.imagen_articulo);
    Articulo.findByIdAndUpdate(ArticuloId, update, (err, ArticuloUpdated) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor' });
        } else {
            if (!ArticuloUpdated) {
                res.status(404).send({ mensaje: 'No se ha actualizado la Articulo' });
            } else {
                res.status(200).send({ ArticuloUpdated });
            }
        }
    });
}

function deleteArticulo(req, res) {
    var ArticuloId = req.params.id;
    Articulo.findByIdAndRemove(ArticuloId, (err, ArticuloEliminado) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor' });
        } else {
            if (!ArticuloEliminado) {
                res.status(404).send({ mensaje: 'La Articulo no ha sido eliminado' });
            } else {
                res.status(200).send({ ArticuloEliminado });
            }
        }

    });
}

function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var path_file = './public/images/articulos/' + imageFile;
    fs.exists(path_file, function(exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(404).send("No existe imagen.");
        }
    });
}

function uploadImage(req, res) {
    var ArticuloId = req.params.id;
    var file_name = 'No subido...';
    if (req.files) {
        var file_path = req.files.imagen_Articulo.path;
        var file_split = file_path.split('/');
        var file_name = file_split[3];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'PNG') {
            Articulo.findByIdAndUpdate(ArticuloId, { imagen_articulo: file_name }, (err, ArticuloUpdated) => {
                if (!ArticuloUpdated) {
                    res.status(404).send({ message: 'No se ha podido actualizar el curso' });
                } else {
                    res.status(200).send({ imagen: file_name, articulo: ArticuloUpdated });
                }
            });

        } else {
            res.status(200).send({ message: 'Extensión del archivo no valida' });
        }

    } else {
        res.status(200).send({ message: 'No has subido ninguna imagen...' });
    }
}

function updateArticuloEstado(req, res) {
    var articuloId = req.params.id;
    var update = req.body.estado_articulo;
    Articulo.findByIdAndUpdate(articuloId, { estado_articulo: update }, (err, articuloAc) => {
        if (err) {
            res.status(500).send({ mensaje: 'Error en el servidor' });
        } else {
            if (!articuloAc) {
                res.status(404).send({ mensaje: 'No se ha actualizado el articulo' });
            } else {
                res.status(200).send({ articuloAc });
            }
        }
    });
}

module.exports = {
    getArticulos,
    saveArticulo,
    updateArticulo,
    deleteArticulo,
    getImageFile,
    getArticulo,
    uploadImage,
    getAllArticulo,
    getArticuloUser,
    updateArticuloEstado
};