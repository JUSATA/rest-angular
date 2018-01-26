var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require("body-parser");




app.use(express.static('public'));
app.use(bodyParser.json());

var pool = mysql.createPool({
	connectionLimit : 25,
	host     : '127.0.0.1',
	user     : 'root',
	password : '',
	database : 'universidad',

});


pool.getConnection(function (err, connection) {
	if (!err) {
		console.log("Database is connected ... ");
		connection.release();
	} else {
		console.log("Error connecting database ... ");
	}
	console.log("releasing connection ... ");
});

app.get('/', function (req, res) {
	res.sendFile( __dirname + "/" + "index.html" );
});

app.get('/api/list', function (req, res) {
	console.log("GET Request :: /list");

	var data = {
        "error": 1,
        "students": ""
    };

	pool.getConnection(function (err, connection) {
		connection.query('SELECT * from estudiantes', function (err, rows, fields) {
			connection.release();

			if (rows.length !== 0 && !err) {
				data["error"] = 0;
				data["students"] = rows;
				res.json(data);
			} else if (rows.length === 0) {
				data["error"] = 2;
				data["students"] = 'No students Found..';
				res.json(data);
			} else {
				data["students"] = 'error while performing query';
				res.json(data);
				console.log('Error while performing Query: ' + err);
			}
		});

	});
});

app.put('/api/update', function (req, res) {
    var id = req.body.id;
    var name = req.body.name;
    var lastname = req.body.lastname;
    var age = req.body.age;
    var data = {
        "error": 1,
        "product": ""
    };
	console.log('PUT Request :: /update: ' + id);
    if (!!id && !!name && !!lastname && !!age) {
		pool.getConnection(function (err, connection) {
			connection.query("UPDATE estudiantes SET name = ?, lastname = ?, age = ? WHERE id=?",[name,  lastname, age, id], function (err, rows, fields) {
				if (!!err) {
					data["product"] = "Error Updating data";
					console.log(err);
				} else {
					data["error"] = 0;
					data["product"] = "Updated Book Successfully";
					console.log("Updated: " + [id, name, lastname, age]);
				}
				res.json(data);
			});
		});
    } else {
        data["product"] = "Please provide all required data (i.e : id, name, lastname, age)";
        res.json(data);
    }
});

app.get('/api/list/:id', function (req, res) {
	var id = req.params.id;
	var data = {
        "error": 1,
        "product": ""
    };

	console.log("GET request :: /list/" + id);
	pool.getConnection(function (err, connection) {
		connection.query('SELECT * from estudiantes WHERE id = ?', id, function (err, rows, fields) {
			connection.release();

			if (rows.length !== 0 && !err) {
				data["error"] = 0;
				data["product"] = rows;
				res.json(data);
			} else {
				data["product"] = 'No product Found..';
				res.json(data);
				console.log('Error while performing Query: ' + err);
			}
		});

	});
});

app.post('/api/insert', function (req, res) {
    var name = req.body.name;
    var lastname = req.body.lastname;
    var carrera = req.body.carrera;
    var age = req.body.age;
    var data = {
        "error": 1,
        "students": ""
    };
	console.log('POST Request :: /insert: ');
    if (!!name && !!lastname && !!age && !!carrera) {
		pool.getConnection(function (err, connection) {
			connection.query("INSERT INTO estudiantes SET nombre = ?, apellidos = ?, carrera = ?, edad = ?",[name,lastname,carrera,age], function (err, rows, fields) {
				if (!!err) {
					data["students"] = "Error Adding data";
					console.log(err);
				} else {
					data["error"] = 0;
					data["students"] = "Product Added Successfully";
					console.log("Added: " + [name, lastname,carrera, age]);
				}
				res.json(data);
			});
        });
    } else {
        data["students"] = "Please provide all required data (i.e : name, desc, age)";
        res.json(data);
    }
});

app.post('/api/delete', function (req, res) {
    var id = req.body.id;
    var data = {
        "error": 1,
        "product": ""
    };
	console.log('DELETE Request :: /delete: ' + id);
    if (!!id) {
		pool.getConnection(function (err, connection) {
			connection.query("DELETE FROM students WHERE id=?",[id],function (err, rows, fields) {
				if (!!err) {
					data["product"] = "Error deleting data";
					console.log(err);
				} else {
					data["product"] = 0;
					data["product"] = "Delete product Successfully";
					console.log("Deleted: " + id);
				}
				res.json(data);
			});
		});
    } else {
        data["product"] = "Please provide all required data (i.e : id ) & must be a integer";
        res.json(data);
    }
});

var server = app.listen(8081, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("student details app listening at: " + host + ":" + port);

})
