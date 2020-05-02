'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ComentarioSchema = Schema({
    titulo_comentario: String,
    cuerpo_comentario: String,
    fecha_publica_cometario: { type: Date, default: Date.now },
    id_articulo: { type: Schema.ObjectId, ref: 'ARTICULO' },
    id_usuario_profesional: { type: Schema.ObjectId, ref: 'USER' },
    id_usuario_cliente: { type: Schema.ObjectId, ref: 'USER' }

});

module.exports = mongoose.model('COMENTARIO', ComentarioSchema);