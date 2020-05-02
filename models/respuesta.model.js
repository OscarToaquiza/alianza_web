'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RespuestaSchema = Schema({
		descripcion_respuesta: String,
		fecha_publicada_respuesta: {type: Date, default: Date.now },
        id_usuario_respuesta: { type: Schema.ObjectId, ref: 'USER'},
        id_comentario: { type: Schema.ObjectId, ref: 'COMENTARIO'}
});

module.exports = mongoose.model('RESPUESTA', RespuestaSchema);