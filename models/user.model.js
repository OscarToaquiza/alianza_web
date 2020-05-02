'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UsuarioSchema = Schema({
    nombre_usuario: String,
    apellido_usuario: String,
    telefono_usuario: String,
    cedula_usuario: String,
    email_usuario: { type: String, unique: true, required: true },
    password_usuario: String,
    imagen_usuario: String,
    fecha_nacimiento_usuario: Date,
    rol_usuario: Number,
    empresa_usuario: String,
    correo_empresa_usuario: String,
    confirm_email: { type: Boolean, default: false }

});

module.exports = mongoose.model('USER', UsuarioSchema);