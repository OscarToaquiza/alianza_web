'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NoticiaSchema = Schema({
		titulo_noticia: String,
		descripcion_noticia: String,
		observacion_noticia: String,
		fecha_publicado_notica: {type: Date, default: Date.now },
		imagen_noticia: String,
		enlace_noticia: String,
		id_usuario: { type: Schema.ObjectId, ref: 'USER'},
		estado_noticia:{type:Boolean,default:true}
});

module.exports = mongoose.model('NOTICIA', NoticiaSchema);