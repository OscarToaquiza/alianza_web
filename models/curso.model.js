'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CursoSchema = Schema({
    nombre_curso:String,
    titulo_curso:String,
    descripcion_curso:String,
    costo_curso:String,
    direccion_curso:String,
    mapa_curso:String,
    fecha_inicio:Date,
    fecha_fin:Date,
    horario_curso: String,
    url_img_curso:String,
    archivo_curso:String,
    id_usuario: { type: Schema.ObjectId, ref: 'USER'},
    estado_curso:{type:Boolean,default:true}
});

module.exports = mongoose.model('CURSO',CursoSchema);