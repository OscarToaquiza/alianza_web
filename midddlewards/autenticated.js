'use strict'

var jwt = require('jwt-simple');
//token tiene una fecha de expiracion

var moment = require('moment');
var secret = 'clave_secreta_curso';


//next para poder salir del midleward
exports.ensureAuth = function(req,res,next){
//1. recoger la autorizacion
    if(!req.headers.authorization){
        return res.status(403).send({message : "La peticion no tiene la cebezera de la autenticación"});
    }
    //quitar las comillas al token
    var data= "/['"+'"'+"]+/g";
    var token = req.headers.authorization.replace(/["']+/g, '');
    console.log(token);
    try {
        //decpdofocar el token...
        var payload = jwt.decode(token, secret);
        //si ya expiro
        if(payload.exp <= moment().unix()){
            return res.status(401).send({message:"El token ha expirado"});
        }
    } catch (error) {
        //console.log(error);
        return res.status(404).send({mensaje:"Token no valido"});
    }
    //disponible todo el decon si esta decodificado
    req.user = payload;
    next();
};