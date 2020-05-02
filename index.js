var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 4444;

var uri = 'mongodb://alianza:2DlgfnC3oz4Qo9rL@cluster0-shard-00-00-hvjja.mongodb.net:27017,cluster0-shard-00-01-hvjja.mongodb.net:27017,cluster0-shard-00-02-hvjja.mongodb.net:27017/aee?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority';
//var uri = 'mongodb://localhost:27017/aee';
mongoose.connect(uri, (err) => {
    if (err) {
        console.log(err);
        throw err;
    } else {
        console.log("La Base de Datos Esta Corriendo Exitosamente");
        app.listen(port, function() {
            console.log("Servidor corriendo en el puerto localhost:" + port);
        })
    }
});