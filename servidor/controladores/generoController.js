var connection = require('../lib/conexionbd');

function retrieveAll(req, res) {
    var sql = "SELECT * FROM genero";
    connection.query(sql, function(error, result, fields) {
        if (error) {
            console.log("Hubo un error en la consulta");
            return res.status(400).send("Hubo un error en la consulta");
        }
        var response = {
            generos: result
        };

        res.send(JSON.stringify(response));
    });
}

module.exports = {
    retrieveAll
}