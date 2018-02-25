var connection = require('../lib/conexionbd');

function retrieveAll(req, res) {
    let query = req.query;
    let anio = query.anio ? ` anio = ${query.anio}` : false;
    let titulo = query.titulo ? ` titulo LIKE '%${query.titulo}%'` : false;
    let genero = query.genero ?  ` genero_id = ${query.genero}` : false;
    let where = anio || titulo || genero ? 'WHERE' : '';
    let response = {};

    if (anio) {
        where += anio;
        if (titulo) {
            where += ' AND';
            where += titulo;
        }
        if (genero) {
            where += ' AND';
            where += genero;   
        }
    } else if (titulo) {
        where += titulo;
        if (genero) {
            where += ' AND';
            where += genero;   
        }
    } else if (genero) {
        where += genero;
    }

    var sql = `SELECT * FROM pelicula ${where} ORDER BY ${query.columna_orden} ${query.tipo_orden} LIMIT ${query.cantidad} OFFSET ${query.cantidad * (query.pagina - 1)};`;
    connection.query(sql, function(error, result, fields) {
        if (error) {
            console.log("Hubo un error en la consulta");
            return res.status(400).send("Hubo un error en la consulta");
        }
        response.peliculas = result;

        connection.query(`SELECT COUNT(*) FROM pelicula ${where};`, function(error, result, fields) {
            if (error) {
                console.log("Hubo un error en la consulta");
                return res.status(400).send("Hubo un error en la consulta");
            }
            response.total = result[0]['COUNT(*)'];
            res.send(JSON.stringify(response));
        });
    });
}

function retrieve(req, res) {
    var id = req.params.id;
    var response = {};
    var sql = `SELECT pelicula.*, genero.nombre FROM pelicula INNER JOIN genero ON pelicula.genero_id = genero.id WHERE pelicula.id = ${id};`;
    connection.query(sql, function(error, result, fields) {
        if (error) {
            console.log("Hubo un error en la consulta");
            return res.status(400).send("Hubo un error en la consulta");
        }
        if (result.length === 0) {
            console.log("No se encontro ninguna pelicula con ese id");
            return res.status(400).send("No se encontro ninguna pelicula con ese id");
        } else {
            response.pelicula = result[0];

            connection.query(`SELECT * FROM actor_pelicula INNER JOIN actor ON actor_id = actor.id WHERE actor_pelicula.pelicula_id = ${id};`, function(error, result, fields) {
                if (error) {
                    console.log("Hubo un error en la consulta");
                    return res.status(400).send("Hubo un error en la consulta");
                }
                response.actores = result;
                res.send(JSON.stringify(response));
            });
        }
    });
}

function recomendation(req, res) {
    let query = req.query;
    let genero = query.genero ? ` nombre = '${query.genero}'` : false;
    let puntuacion = query.puntuacion ? ` puntuacion >= ${query.puntuacion}` : false;
    let anio_inicio = query.anio_inicio ? ` anio >= ${query.anio_inicio}` : false
    let anio_fin = query.anio_fin ? ` anio <= ${query.anio_fin}` : false
    let where = genero ? ' WHERE' : '';
    let response = {};

    if (genero) {
        where += genero;
        if (puntuacion) {
            where += ' AND';
            where += puntuacion;
        }
        if (anio_inicio) {
            where += ' AND';
            where += anio_inicio;
        }
        if (anio_fin) {
            where += ' AND';
            where += anio_fin;
        }
    } else if (puntuacion) {
        where += puntuacion;
        if (anio_inicio) {
            where += ' AND';
            where += anio_inicio;
        }
        if (anio_fin) {
            where += ' AND';
            where += anio_fin;
        }
    } else if (anio_inicio) {
        where += anio_inicio;
        if (anio_fin) {
            where += ' AND';
            where += anio_fin;
        }
    } else if (anio_fin) {
        where += anio_fin;
    }

    var sql = `SELECT pelicula.*, genero.nombre FROM pelicula INNER JOIN genero ON pelicula.genero_id = genero.id${where};`;
    connection.query(sql, function(error, result, fields) {
        if (error) {
            console.log("Hubo un error en la consulta");
            return res.status(400).send("Hubo un error en la consulta");
        }
        response.peliculas = result;
        res.send(JSON.stringify(response));
    });
}

module.exports = {
    retrieveAll,
    retrieve,
    recomendation
}