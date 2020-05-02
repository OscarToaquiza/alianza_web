'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticuloSchema = Schema({
    titulo_articulo: String,
    descripcion_articulo: String,
    observacion_articulo: String,
    fecha_publicado_articulo: { type: Date, default: Date.now },
    imagen_articulo: String,
    id_usuario: { type: Schema.ObjectId, ref: 'USER' },
    estado_articulo: { type: Boolean, default: false }
});

module.exports = mongoose.model('ARTICULO', ArticuloSchema);