var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var usuarioRoute = require('./routes/usuario.route');
var cursoRoute = require('./routes/curso.router');
var noticiaRoute = require('./routes/noticia.route');
var inscripcionRoute = require('./routes/inscripcion.router');
var archivoRoute = require('./routes/archivo.router');
var emailRoute = require('./routes/email.router');
var articuloRouter = require('./routes/articulo.router');

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// configurar cabeceras http
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    next();
});

//app.use('/', index);
//----para produccion
app.use('/', express.static('angular', { redirect: false }));
//----
app.use('/api/usuario', usuarioRoute);
app.use('/api/curso', cursoRoute);
app.use('/api/noticia', noticiaRoute);
app.use('/api/inscripcion', inscripcionRoute);
app.use('/api/archivo', archivoRoute);
app.use('/api/email', emailRoute);
app.use('/api/articulo', articuloRouter);


//para produccion
app.get('*', function(req, res, next) {
    res.sendFile(path.resolve('angular/index.html'));
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    console.log("Que paso!!" + err);
    res.render('error');
});

module.exports = app;