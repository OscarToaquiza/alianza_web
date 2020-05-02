'use strict'
var fs = require('fs');
var path = require('path');
var Curso = require('../models/curso.model');



function saveCurso(req, res) {
    var curso = new Curso();
    var params = req.body;
    console.log(params);
    curso.nombre_curso = params.nombre_curso;
    curso.titulo_curso = params.titulo_curso;
    curso.descripcion_curso = params.descripcion_curso;
    curso.costo_curso = params.costo_curso;
    curso.direccion_curso = params.direccion_curso;
    curso.mapa_curso = params.mapa_curso;
    curso.fecha_inicio = params.fecha_inicio;
    curso.fecha_fin = params.fecha_fin;
    curso.horario_curso = params.horario_curso;
    curso.id_usuario = params.id_usuario;

    if (req.files && req.files.url_img_curso != undefined) {
        var file_path = req.files.url_img_curso.path;
        var file_split = file_path.split('/');
        var file_name = file_split[3];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'PNG') {
            curso.url_img_curso = file_name;
        } else {
            res.status(404).send({ mensaje: "El formato de la imagen no es valida" });
        }
    } else {
        curso.url_img_curso = "default_curso.jpg";
    }

    if (req.files && req.files.archivo_curso != undefined) {
        var file_path = req.files.archivo_curso.path;
        var file_split = file_path.split("/");
        var file_name = file_split[3];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        if (file_ext == 'pdf') {
            curso.archivo_curso = file_name;
        } else {
            res.status(404).send({ mensaje: "El formato de la archivo no es valido" });
        }
    } else {
        curso.archivo_curso = "default_archivo.pdf";
    }

    console.log(curso.url_img_curso);
    console.log(curso.archivo_curso);

    curso.save((err, cursoGuardado) => {
        if (err) {
            console.log("Error = " + err);
            res.status(500).send({ mensaje: "Error en el servidor" });
        } else {
            if (!cursoGuardado) {
                res.status(404).send({ mensaje: "Error al guardar el curso" });
            } else {
                res.status(200).send({ cursoGuardado });
            }
        }
    });
}

function updateCurso(req, res) {
    var cursoId = req.params.id;
    var update = req.body;
    if (req.files && req.files.url_img_curso != undefined) {
        var file_path = req.files.url_img_curso.path;
        var file_split = file_path.split('/');
        var file_name = file_split[3];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'PNG') {
            update.url_img_curso = file_name;
        } else {
            res.status(404).send({ mensaje: "El formato de la imagen no es valida" });
        }
    }

    if (req.files && req.files.archivo_curso != undefined) {
        var file_path = req.files.archivo_curso.path;
        var file_split = file_path.split("\\");
        var file_name = file_split[3];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        if (file_ext == 'pdf') {
            update.archivo_curso = file_name;
        } else {
            res.status(404).send({ mensaje: "El formato de la archivo no es valido" });
        }
    }

    console.log(update.url_img_curso);
    console.log(update.archivo_curso);
    Curso.findByIdAndUpdate(cursoId, update, (err, cursoUpdate) => {
        if (err) {
            res.status(500).send({ mensaje: "Error en en el Servidor" });
        } else {
            if (!cursoUpdate) {
                res.status(404).send({ mensaje: "Error al actualizar el curso" });
            } else {
                res.status(200).send({ curso: cursoUpdate });
            }
        }
    });
}

function getCursos(req, res) {
    Curso.find({}).sort({ 'fecha_inicio': -1 }).exec((err, cursos) => {
        if (err) {
            res.status(500).send({ mensaje: "Error del Servidor" });
        } else {
            if (!cursos) {
                res.status(404).send({ mensaje: "No existen cursos..." });
            } else {
                res.status(200).send({ cursos });
            }
        }
    });
}

function getCurso(req, res) {
    var cursoId = req.params.id;
    Curso.findById(cursoId).exec((err, cursoE) => {
        if (err) {
            res.status(500).send({ mensaje: "Error en el Servidor" });
        } else {
            if (!cursoE) {
                res.status(404).send({ mensaje: "No se encontro el curso" });
            } else {
                res.status(200).send({ cursoE })
            }
        }
    });
}

function deleteCurso(req, res) {
    var cursoId = req.params.id;
    Curso.findByIdAndRemove(cursoId, (err, cursoEliminado) => {
        if (err) {
            res.status(500).send({ mensaje: "Error en el Servidor" });
        } else {
            if (!cursoEliminado) {
                res.status(404).send({ mensaje: "El curso no existe.." });
            } else {
                res.status(200).send({ cursoEliminado });
            }
        }
    });
}


function getarchivoFile(req, res) {
    var archivoFile = req.params.archivoFile;
    var path_file = './public/images/cursos/' + archivoFile;
    fs.exists(path_file, function(exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'No existe el archivo...' });
        }
    });
}

function uploadImage(req, res) {
    var cursoId = req.params.id;
    var file_name = 'No subido...';
    if (req.files) {
        var file_path = req.files.url_img_curso.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[3];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'PNG') {
            Curso.findByIdAndUpdate(cursoId, { url_img_curso: file_name }, (err, cursoUpdated) => {
                if (!cursoUpdated) {
                    res.status(404).send({ message: 'No se ha podido actualizar el curso' });
                } else {
                    res.status(200).send({ imagen: file_name, curso: cursoUpdated });
                }
            });

        } else {
            res.status(200).send({ message: 'Extensión del archivo no valida' });
        }

    } else {
        res.status(200).send({ message: 'No has subido ninguna imagen...' });
    }
}

function uploadArchivo(req, res) {
    var cursoId = req.params.id;
    var file_name = 'No subido...';
    if (req.files) {
        var file_path = req.files.archivo_curso.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[3];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        if (file_ext == 'pdf') {
            Curso.findByIdAndUpdate(cursoId, { archivo_curso: file_name }, (err, cursoUpdated) => {
                if (!cursoUpdated) {
                    res.status(404).send({ message: 'No se ha podido actualizar el curso' });
                } else {
                    res.status(200).send({ imagen: file_name, curso: cursoUpdated });
                }
            });

        } else {
            res.status(200).send({ message: 'Extensión del archivo no valida' });
        }

    } else {
        res.status(200).send({ message: 'No has subido ninguna imagen...' });
    }
}

function getCursosLista(req, res) {
    if (req.params.page) {
        var page = req.params.page;
    } else {
        var page = 1;
    }
    var itemsPerPage = 3;
    Curso.find().sort({ 'fecha_inicio': -1 }).paginate(page, itemsPerPage, function(err, ncursos, total) {
        if (err) {
            res.status(500).send({ mensaje: 'Error en la petición.' });
        } else {
            if (!ncursos) {
                res.status(404).send({ mensaje: 'No hay noticias !!' });
            } else {
                return res.status(200).send({
                    total_items: total,
                    mensaje: ncursos
                });
            }
        }
    });
}


module.exports = {
    saveCurso,
    getCursos,
    getCurso,
    deleteCurso,
    getarchivoFile,
    uploadImage,
    uploadArchivo,
    updateCurso,
    getCursosLista
}