var nodemailer = require('nodemailer');
var User = require('../models/user.model');
// email sender function
function sendEmail(req, res) {
    console.log("inicio de envio de email 1");
    var params = req.body;
    console.log(params);
    var correo = params.email;
    var nombre = params.nombre;
    var apellido = params.apellido;
    var asunto = 'Prueba';
    var mensaje = params.comentario;
    //Definimos el transporter
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'alianzaeeweb@gmail.com',
            pass: 'alianzaee#01'
        }
    });
    // Definimos el email

    var mailOptions = {
        from: 'Remitente',
        to: correo,
        subject: asunto,
        text: 'Bienvenido ' + nombre + ' ' + apellido + ', a la WEB ALIANZA ESTRATEGICA EMRESARIAL.',
        html: "Pulsa <a href='http://localhost:4200/emailConfirm/" + correo + "'>aquí</a> para confirmar tu cuenta, Será un gusto tenerte informad@."
    };
    // Enviamos el email
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
            res.send(500, error.message);
        } else {
            console.log("Email enviado");
            res.status(200).jsonp(req.body);
        }
    });
};


function sendEmailInscripcion(req, res) {
    console.log("inicio de envio de email");
    var params = req.body;
    console.log(params);
    var correo = params.email;
    var nombre = params.nombre;
    var cedula = params.cedula;
    var apellido = params.apellido;
    var nombre_curso = params.nombre_curso;
    var horario_curso = params.horario_curso;
    var costo_curso = params.costo_curso;
    var fecha_ini = params.fecha_ini;
    var fecha_fin = params.fecha_fin;
    var asunto = 'ALIANZA ESTRATEFICA EMPRESARIAL - INSCRIPCION';
    //Definimos el transporter
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'alianzaeeweb@gmail.com',
            pass: 'alianzaee#01'
        }
    });
    // Definimos el email

    var mailOptions = {
        from: 'Remitente',
        to: correo,
        subject: asunto,
        text: 'ALIANZA ESTRATEGICA EMRESARIAL.',
        html: "<h2>Hola " + nombre + " " + apellido + "</h2>" +
            "<p> Alianza Estrategica Empresarial te da la bienvenida al curso " + nombre_curso + ", " +
            "para completar tu inscripción porfavor deposita la cantidad de " + costo_curso + " en el " +
            "numero de cuanta: 22312312 del banco del pichincha y envianos tu comprobante por esete " +
            "medio o una foto al Whatsapp 0983898326. Antes del  " + fecha_ini + "<br> Para revisar el " +
            "estado de tu inscripcciín revisa tu perfil.</p> <h3>Gracias por confiar en nosotros</h3>"

    };

    // Enviamos el email
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
            res.send(500, error.message);
        } else {
            console.log("Email enviado");
            res.status(200).jsonp(req.body);
        }
    });
};

function sendEmailContacto(req, res) {
    console.log("inicio de envio de email");
    var params = req.body;
    console.log(params);
    var correo = params.email;
    var nombre = params.nombre;
    var tema = params.tema;
    var mensaje = params.mensaje;
    var asunto = 'ALIANZA ESTRATEFICA EMPRESARIAL - CONTACTO';
    //Definimos el transporter
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'alianzaeeweb@gmail.com',
            pass: 'alianzaee#01'
        }
    });
    // Definimos el email

    var mailOptions = {
        from: 'Remitente',
        to: correo,
        subject: asunto,
        text: 'ALIANZA ESTRATEGICA EMRESARIAL.',
        html: "<h2>Hola " + nombre + "</h2>" +
            "<p> Alianza Estratégica Empresarial te envia y coordial saludo y te da la bienvenida. </p>" +
            "<p> Tu mensaje ha sido resivido con exito. </p>" +
            "<p>" +
            "<b>Tema:</b> " + tema + " <br>" +
            "<b>Mensaje</b> " + mensaje + " <br>" +
            "</p>" +
            "<h3>Gracias por confiar en nosotros</h3>"

    };

    // Enviamos el email
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
            res.send(500, error.message);
        } else {
            console.log("Email enviado");
            res.status(200).jsonp(req.body);
        }
    });
};

function sendEmailReset1(req, res) {
    console.log("inicio de envio de email");
    var params = req.body;
    console.log(params);
    var correo = params.email;
    var nombre = params.nombre;
    var id = params.id;
    var asunto = 'ALIANZA ESTRATEFICA EMPRESARIAL - INSCRIPCION';
    //Definimos el transporter
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'alianzaeeweb@gmail.com',
            pass: 'alianzaee#01'
        }
    });
    // Definimos el email

    var mailOptions = {
        from: 'Remitente',
        to: correo,
        subject: asunto,
        text: 'ALIANZA ESTRATEGICA EMRESARIAL.',
        html: "<h2>Hola " + nombre + " " + apellido + "</h2>" +
            "<p> Alianza Estrategica Empresarial ha resivido un reseteo de clave para tu cuenta.</p>" +
            "<p> Por favor confirma este correo para saber que eres el propietario <a href='http://localhost:4200/confirm_email_reset/" + id + "'>aquí</a>  </p>" +
            "<p> Caso cobtrario no confirmar y eliminar este mensaje  </p>"
    };

    // Enviamos el email
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
            res.send(500, error.message);
        } else {
            console.log("Email enviado");
            res.status(200).jsonp(req.body);
        }
    });
};

function sendEmailReset2(req, res) {
    console.log("inicio de envio de email");
    var params = req.body;
    console.log(params);
    var correo = params.email;
    var nombre = params.nombre;
    var id = params.id;
    var clave = params.clave;
    var asunto = 'ALIANZA ESTRATEFICA EMPRESARIAL - INSCRIPCION';
    //Definimos el transporter
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'alianzaeeweb@gmail.com',
            pass: 'alianzaee#01'
        }
    });
    // Definimos el email

    var mailOptions = {
        from: 'Remitente',
        to: correo,
        subject: asunto,
        text: 'ALIANZA ESTRATEGICA EMRESARIAL.',
        html: "<h2>Hola " + nombre + " " + apellido + "</h2>" +
            "<p> Alianza Estrategica Empresarial ha resivido un reseteo de clave para tu cuenta.</p>" +
            "<p> Despues de confirmar tu correo y usuario, este tu nueva clave = " + clave +
            "<p> Es un gusto atenderte  </p>"
    };

    // Enviamos el email
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
            res.send(500, error.message);
        } else {
            console.log("Email enviado");
            res.status(200).jsonp(req.body);
        }
    });
};

module.exports = {
    sendEmail,
    sendEmailInscripcion,
    sendEmailReset1,
    sendEmailReset2,
    sendEmailContacto
};