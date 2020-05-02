'use strict'
var fs = require('fs');
var path = require('path');
var Archivo = require('../models/archivo.model');

function saveArchivo(req, res) {
    var archivo = new Archivo();
    var params = req.body;

    archivo.titulo_archivo = params.titulo_archivo;
    archivo.descripcion_archivo = params.descripcion_archivo;
    archivo.id_usuario = params.id_usuario;
    archivo.observacion_archivo = params.observacion_archivo;

    if (req.files && req.files.ruta_archivo != undefined) {
        var file_path = req.files.ruta_archivo.path;
        var file_split = file_path.split("/");
        var file_name = file_split[3];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        if (file_ext == 'xlsm' || file_ext == 'xlsx' || file_ext == 'xlt' || file_ext == 'pdf' || file_ext == 'docx') {
            archivo.ruta_archivo = file_name;
            console.log(archivo.ruta_archivo)

            archivo.save((err, archivoGuardado) => {
                if (err) {
                    console.log("Error = " + err);
                    res.status(500).send({ mensaje: "Error en el servidor" });
                } else {
                    if (!archivoGuardado) {
                        res.status(404).send({ mensaje: "Error al guardar el archivo" });
                    } else {
                        res.status(200).send({ archivoGuardado });
                    }
                }
            });
        } else {
            res.status(404).send({ mensaje: "El formato del archivo no es válido" });
        }
    } else {
        res.status(404).send({ mensaje: "El archivo es obligatorio" });
    }


}

function getArchivo(req, res) {
    var archivoId = req.params.id;
    Archivo.findById(archivoId).exec((err, archivoE) => {
        if (err) {
            res.status(500).send({ mensaje: "Error en el Servidor" });
        } else {
            if (!archivoE) {
                res.status(404).send({ mensaje: "No se encontro el curso" });
            } else {
                res.status(200).send({ archivoE })
            }
        }
    });
}

function getArchivoUsuario(req, res) {
    var userId = req.params.id_usuario;
    Archivo.find({ id_usuario: userId }).exec((err, archivosE) => {
        if (err) {
            res.status(500).send({ mensaje: "Error en el Servidor" });
        } else {
            if (!archivosE) {
                res.status(404).send({ mensaje: "No se encontraron archivos..." });
            } else {
                res.status(200).send({ archivosE })
            }
        }
    });
}

function getTodosArchivos(req, res) {
    Archivo.find().populate('id_usuario').exec((err, archivosE) => {
        if (err) {
            res.status(500).send({ mensaje: "Error en el Servidor" });
        } else {
            if (!archivosE) {
                res.status(404).send({ mensaje: "No se encontro el curso" });
            } else {
                res.status(200).send({ archivosE })
            }
        }
    });
}

function getarchivoFile(req, res) {
    var archivoFile = req.params.archivoFile;
    var path_file = './public/images/archivos/' + archivoFile;
    fs.exists(path_file, function(exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'No existe el archivo...' });
        }
    });
}

function deleteArchivo(req, res) {
    var archivoId = req.params.id;
    Archivo.findByIdAndRemove(archivoId, (err, archivoBorrado) => {
        if (err) {
            res.status(500).send({ mensaje: "Error ene le Servidor" });
        } else {
            if (!archivoBorrado) {
                res.status(404).send({ mensaje: "No se puede eliminar el archivo" });
            } else {
                //BORRA ARCHIVO ANTERIOR
                var path_file = './public/images/archivos/' + archivoBorrado.ruta_archivo;
                fs.exists(path_file, function(exists) {
                    if (exists) {
                        console.log(exists);
                        fs.unlink(path_file, (err) => {
                            if (err) {
                                console.log("El archivo no pudo ser eliminado");
                            } else {
                                console.log("Archivo eliminado...");
                            }
                        });
                    } else {
                        console.log("No hay archivo.");
                    }
                });
                res.status(200).send({ archivoBorrado });
            }
        }
    });
}

function updateArchivo(req, res) {
    var archivoId = req.params.id;
    var update = req.body;
    if (req.files && req.files.ruta_archivo != undefined) {
        console.log("Con imagen")
        var file_path = req.files.ruta_archivo.path;
        var file_split = file_path.split('/');
        var file_name = file_split[3];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        if (file_ext == 'xlsm' || file_ext == 'xlsx' || file_ext == 'xlt' || file_ext == 'pdf' || file_ext == 'docx') {
            update.ruta_archivo = file_name;
            Archivo.findByIdAndUpdate(archivoId, update, function(err, archivoA) {
                if (err) {
                    console.log(err);
                    res.status(500).send({ mensaje: 'Error en el servidor' });
                } else {
                    if (!archivoA) {
                        res.status(404).send({ mensaje: 'No se ha actualizado el archivo' });
                    } else {
                        //BORRA ARCHIVO ANTERIOR
                        var path_file = './public/images/archivos/' + archivoA.ruta_archivo;
                        fs.exists(path_file, function(exists) {
                            if (exists) {
                                console.log(exists);
                                fs.unlink(path_file, (err) => {
                                    if (err) {
                                        console.log("El archivo no pudo ser eliminado");
                                    } else {
                                        console.log("Archivo eliminado...");
                                    }
                                });
                            } else {
                                console.log("No hay archivo.");
                            }
                        });
                        res.status(200).send({ archivoA });
                    }
                }
            });
        } else {
            res.status(200).send({
                mensaje: "Extension del archivo no valido"
            });
        }
    } else {
        console.log("Actualiza sin archivo");
        Archivo.findByIdAndUpdate(archivoId, update, function(err, archivoAc) {
            if (err) {
                console.log(err);
                res.status(500).send({ mensaje: "Error del servidor" });
            } else {
                if (!archivoAc) {
                    res.status(404).send({ mensaje: "Error no se puede actualizar el archivo" });
                } else {
                    res.status(200).send({ archivoAc })
                }
            }
        })
    }
}


module.exports = {
    saveArchivo,
    getArchivo,
    getarchivoFile,
    getArchivoUsuario,
    getTodosArchivos,
    deleteArchivo,
    updateArchivo
}