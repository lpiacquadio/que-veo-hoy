require('dotenv').config()
//paquetes necesarios para el proyecto
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var peliculaController = require('./controladores/peliculaController');
var generoController = require('./controladores/generoController');

var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get('/peliculas', peliculaController.retrieveAll);
app.get('/peliculas/recomendacion', peliculaController.recomendation);
app.get('/peliculas/:id', peliculaController.retrieve);
app.get('/generos', generoController.retrieveAll);

//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
var puerto = '8080';

app.listen(puerto, function () {
  console.log( "Escuchando en el puerto " + puerto );
});

