'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArchivoSchema = Schema({
		titulo_archivo: String,
		descripcion_archivo: String,
		fecha_publicado_archivo: {type: Date, default: Date.now },
		ruta_archivo: String,
		id_usuario: { type: Schema.ObjectId, ref: 'USER'},
		observacion_archivo: String
});

module.exports = mongoose.model('ARCHIVO', ArchivoSchema);