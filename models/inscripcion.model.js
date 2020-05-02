'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InscripcionSchema = Schema({
    fecha_inscripcion: {type: Date, default: Date.now },
    id_usuario: { type: Schema.ObjectId, ref: 'USER'},
    id_curso: { type: Schema.ObjectId, ref: 'CURSO'},
    estado_inscripcion: {type: Number, default: 1 },
    observacion_inscripcion: String
});

module.exports = mongoose.model('INSCRIPCION',InscripcionSchema);