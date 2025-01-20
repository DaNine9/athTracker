const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const ejs = require("ejs");
const { error } = require("console");


const app = express();
const port = 3000;
app.set("view engine", "ejs")


var classcode = "";
var classname = "";
var idAlumno = "";
var pruebasAlumnosId ="";
var nombrePrueba = "";
var tipoPrueba = "";


//cambio

//public
app.use(express.static(path.join(__dirname, "/public")));

//bodyparser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//sesión (cookie)
app.use(session({
    secret: "~#€#==2e32",
    resave: false,
    saveUninitialized: true
}))

//base de datos
app.use(express.static(path.join(__dirname, "/public")));
const db = new sqlite3.Database("bi.db", (err) => {
    if (err) {
        console.error("ha habido un error al conectar a la base de datos");
    } else {
        console.log("conectado");
    }
})

// crear codigos
function crearCodigo() {
    codigo = ""
    function generarGrupo() {
        var grupo = ""
        const abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        for (var i = 0; i < 3; i++) {
            grupo += abc.charAt(Math.floor(Math.random() * abc.length))
        }
        return grupo;
    }
    codigo = `${generarGrupo()}-${generarGrupo()}-${generarGrupo()}`
    while (checkCodigos(codigo)) {
        codigo = `${generarGrupo()}-${generarGrupo()}-${generarGrupo()}`
    }
    return codigo
}

//funcion de conprobacion para el registro
function checkEmptyFields(username, password, isTeacher, fname) {
    if (!username) {
        return "Por favor, rellena el nombre de usuario";
    } else if (!password) {
        return "Por favor, añade una contraseña";
    } else if (isTeacher === undefined || isTeacher === null) { // Check for undefined or null
        return "Por favor, indica tu función (alumno / profesor)";
    } else if (!fname) {
        return "Por favor, rellena tu nombre completo";
    } else {
        return null; // All fields are filled
    }
}

function checkCodigos(code) {
    var query = "SELECT code FROM clases WHERE code = \"" + code + "\";"
    db.all(query, (err, data) => {
        if (data) {
            return true;
        } else {
            return false;
        }
    })
}

function getNameOnId(id) {
    const query = `SELECT name FROM users WHERE id = ${id}`
    db.all(query, (err, data) => {
        if (data) {
            console.log(data)
            return data;
        }
    })
}

function getClassNameOnCode(code) {
    const query = `SELECT name FROM classes WHERE code = "${code}"`
    db.all(query, (err, data) => {
        if (data) {
            console.log(data)
            return data;
        }
    })
}

//middleware autentificacion
function isAuth(req, res, next) {
    if (req.session.userId) {
        next();
    } else {
        res.redirect("/");
    }
}

app.get("/getName", isAuth, (req, res) => {
    res.json({ "name": req.session.username })
})

app.get("/", (req, res) => {
    if (req.session.userId) {

        if (req.session.isTeacher == 1) {
            return res.redirect("/teacherHome");
        } else if (req.session.isTeacher == 0) {
            return res.redirect("/studentHome");
        }
    } else {

        return res.sendFile(path.join(__dirname, "views/login.html"));
    }
});

app.get("/alumno", isAuth, (req, res) => {

    const id = req.query.id
    alumnoId = id

    res.sendFile(path.join(__dirname, "views/detailAlumnoT.html"))


})

//detalle del alumno, pagina con lista de pruebas
app.get("/detalleAlumno", isAuth, (req, res) => {

    const idClase = req.query.idClase
    const idAlumno = req.query.idAlumno

    var Fname = "Fname";
    if (req.session.isTeacher === 1) {

        var query = `SELECT name FROM users WHERE id = ?`;
        db.get(query, [idAlumno], (err, data) => {
            if (data) {
                Fname = data;
                var Pname = Fname.name;
                console.log(Pname);
                res.render("detalleAlumno", {
                    "idClase": idClase,
                    "idAlumno": idAlumno,
                    "name": Pname,
                    "pruebasDisplay": "Pruebas del alumno"
                });
            } else {
                res.send('parece que esta clase no existe ¯\_(ツ)_/¯')
            }
            if (err) {
                console.log(err);
            }
        });


    } else if (req.session.isTeacher === 0) {

        const query = `SELECT name FROM classes WHERE code = ?`;
        db.get(query, [idClase], (err, data) => {
            if (data) {
                console.log("data:", data);
                Fname = data;
                var Pname = Fname.name;
                console.log("Pname:", Pname);
                res.render("detalleAlumno", {
                    "idClase": idClase,
                    "idAlumno": idAlumno,
                    "name": Pname,
                    "pruebasDisplay": "Mis Pruebas"
                });
            } else {
                res.send(`parece que esta clase no existe ¯\_(ツ)_/¯`)
            }
        });


    } else {
        return res.status(400).send("Invalid user role");
    }
})


//unirse a clase
app.post("/joinClass", isAuth, (req, res) => {

    //codigo de clase
    var code = req.body.classCode
    //user ID
    var userId = req.session.userId

    var query = `SELECT * FROM classes WHERE code = "${code}";`


    //ejecutar el query, y si existe la clase con el código dado, añadir al usuario a enrollments con su UID y la classId
    db.get(query, (err, data) => {
        if (data) {
            console.log("hay datos:", data)

            //id de la clase
            var classId = data.id

            const query1 = `INSERT INTO enrollments (studentId, classId) VALUES (?, ?)`;
            db.run(query1, [userId, classId], (err) => {
                if (err) {
                    console.log("Error al añadir el usuario", err);
                } else {
                    console.log("Se añadió correctamente el usuario a la clase");
                }
            });



            res.redirect("/");
        } else {
            console.log("ERROR: NO HAY UNA CLASE CON ESTE CÓDIGO")
        }
    });
})

app.get("/class", (req, res) => {

    var code = req.query.code;
    classcode = code
    console.log(code);

    if (req.session.isTeacher == 1) {
        res.render("classTeacher", { "idClase": code });
    } else {
        res.sendFile(path.join(__dirname, "views/detailAlumno.html"));
    }
})

//prueba
app.get("/prueba", isAuth, (req, res) => {

    var id = req.query.id

})

app.get("/getMasterPruebas", isAuth, (req, res) => {
    var query = "SELECT * FROM pruebasMaster;"
    db.all(query, (err, data) => {
        if (err) {
            console.log("error al coger pruebasMaster")
        }

        if (data) {
            res.json(data);
        }
    })
})

app.post("/addPruebaAlumno", isAuth, (req, res) => {


    var idPrueba = req.body.prueba
    var idAlumno = req.body.idAlumno
    var idClase = req.body.idClase

    var query = 'SELECT * FROM pruebasAlumnos WHERE idPrueba = ? AND idAlumno= ? AND idClase = ?;'
    db.all(query, [idPrueba, idAlumno, idClase], (err, data) => {
        if (err) {
            console.log(err)
        }
        
        if (data.length == 0) {
            var query1 = 'INSERT INTO pruebasAlumnos (idPrueba, idAlumno, idClase) VALUES (?, ?, ?);'

            db.run(query1, [idPrueba, idAlumno, idClase], (err) => {
                if (err) {
                    console.log(err)
                }
            })
            res.redirect("/detalleAlumno?idAlumno="+idAlumno+"&idClase="+idClase)
        }else{
            res.send("ESTA PRUEBA YA EXISTE")
        }
    })

})


app.get("/getPruebasAlumno", isAuth, (req, res) => {
    
    var idClase = req.query.idClase
    var idAlumno = req.query.idAlumno

    console.log("llamada" + idAlumno)

    var query = 'SELECT name,type,pa.id as "idPruebasAlumnos", mp.id as "idMasterPruebas" FROM pruebasAlumnos pa LEFT JOIN pruebasMaster mp ON pa.idPrueba = mp.id WHERE pa.idAlumno = ? AND pa.idClase = ?;'
    db.all(query, [idAlumno, idClase], (err, data)=>{
        if(err){
            console.log(err)
        }

        if(data){
            res.json(data)
        }else{
            res.send("error")
        }
    })

})

//crear nueva clase
app.post("/newClass", isAuth, (req, res) => {
    console.log(req.body.ndci)


    //nombre
    const name = req.body.ndci;
    //user ID
    const uid = req.session.userId;

    const query2 = `INSERT INTO classes (teacherId, name, code) VALUES (?, ?, ?)`;
    console.log("Generated query:", query2);

    var code = crearCodigo();

    db.run(query2, [uid, name, code], (err) => {
        if (err) {
            console.error("Error inserting class:", err);
            return res.status(500).send("Error");
        }
        console.log("Class added successfully.");
            res.redirect("/teacherHome")
    });
});

/*
 *TODO:
    Al añadir clase, comprobar si ya esta unido el alumno a esa clase
*/


//getClasses funciona con profesores y alumnos, si es profe, coge de la tabla classes segun el id de profe y si es alumno, coge de la tabla classes segun enrollments
app.get("/getClasses", isAuth, (req, res) => {

    //si es 1 profesor
    if (req.session.isTeacher == 1) {
        var query = `SELECT * FROM classes WHERE teacherId = ?;`;
        console.log(query);
        db.all(query, [req.session.userId], (error, data) => {
            if (error) {
                res.send("fallo");
            }

            res.json(data);
        });

        //si es 0 es alumno
    } else if (req.session.isTeacher == 0) {

        const query = `SELECT c.*, u.name AS teacherName FROM classes c JOIN enrollments e ON c.id = e.classId JOIN users u ON c.teacherId = u.id WHERE e.studentId = ?;`;
        db.all(query, [req.session.userId], (error, data) => {
            if (error) {
                console.error("Error fetching data:", error);
                res.status(500).send("An error occurred while fetching data.");
            } else {
                res.json(data);
            }
        });


    }


})

app.get("/getClassData", isAuth, (req, res) => {
    var query = `SELECT u.id as "UID", u.name as "FNAME", c.name as "CLASSNAME", c.code as "CLASSCODE"  FROM enrollments  INNER JOIN classes as c on classId = c.id  INNER JOIN users as u on studentId = u.id  WHERE code = ?;`;
    console.log(query);
    db.all(query, [classcode], (error, data) => {
        if (error) {
            res.send("fallo");
        }
        classname = data.CLASSNAME;
        res.json(data);
    });


})


app.post("/newUser", (req, res) => {

    var username = req.body.user;
    var password = req.body.password;
    var isTeacher = req.body.isTeacher;
    var fname = req.body.fname;

    if (checkEmptyFields(username, password, isTeacher, fname) == null) {

        var query = `INSERT INTO users (username, password, isTeacher, name) VALUES ("${username}", "${password}", ${isTeacher}, "${fname}");`

        console.log(query);

        db.get(query, (err, data) => {
            if (err) {
                res.send("fallo")
                console.log(err);
            } else {
                console.log("user añadido correctamente");
                res.redirect("/");
            }
        });

    } else {
        res.send("<h1 style='font-size:100px;'>" + checkEmptyFields(username, password, isTeacher, fname) + "</h1>");
    }



});

app.get("/getUserData", (req, res) => {
    var query = `SELECT * FROM users WHERE id = "${req.session.userId}";`
    console.log(query);
    db.all(query, (err, data) => {
        console.log(data);
        if (data) {
            res.json(data);
        } else {
            console.log(err)
        }
    });

})


app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
})

app.post("/login", (req, res) => {
    var username = req.body.user;
    var password = req.body.password;
    query = `SELECT * FROM users WHERE username = "${username}" AND password = "${password}";`
    console.log(query);
    db.get(query, (err, user) => {
        console.log(user);
        if (user) {
            req.session.username = user.username
            req.session.fname = user.fname
            req.session.isTeacher = user.isTeacher
            req.session.userId = user.id


            res.redirect("/");
        } else {
            res.status(401).redirect("/");
        }
    });
});

app.get("/teacherHome", isAuth, (req, res) => {
    if (req.session.isTeacher == 1) {
        res.sendFile(path.join(__dirname, "views/teacherHome.html"))
    } else {
        res.redirect("/")
    }
})

app.get("/studentHome", isAuth, (req, res) => {
    if (req.session.isTeacher == 0) {
        const idClase = req.query.idClase
        const idAlumno = req.query.idAlumno

        res.render("studentHome", { "idClase": idClase, "idAlumno": idAlumno })
    } else {
        res.redirect("/")
    }
})

app.get("/detallePrueba",isAuth, (req,res) => {
    pruebasAlumnosId = req.query.id
    var query = `SELECT pruebasMaster.name, pruebasMaster.type  FROM pruebasAlumnos JOIN pruebasMaster ON pruebasAlumnos.idPrueba = pruebasMaster.id WHERE pruebasAlumnos.id = ?`
    db.get(query, [pruebasAlumnosId], (error, data) => {
        if(data){
            nombrePrueba = data.name
            tipoPrueba = data.type
        }
        res.render("detallePrueba", {
            name: nombrePrueba
        })
    })
})

app.post("/addResultado", isAuth, (req,res) => {
    var data = req.body.resultado
    var query = 'INSERT INTO resultados (idPruebasAlumnos, resultado) VALUES (?, ?)'
    db.run(query,[pruebasAlumnosId, data], (err)=>{
        if(err){
            console.log(err)
        }else{
            res.redirect("/detallePrueba?id="+pruebasAlumnosId)
        }
    })
})

app.get("/getResultadosPrueba", (req, res) => {
    var query = "SELECT * FROM resultados WHERE idPruebasAlumnos = ?"
    db.all(query,[pruebasAlumnosId],(err,data)=>{
        if(err){
            console.log(err)
        }

        if(data){
            res.json(data)
        }
    })
})

app.get("/reg", (req, res) => {
    res.render(path.join(__dirname, "register.html"))
})

app.get("/getPruebaData", (req, res) => {
    var query = ``
})

app.listen(3000, () => {
    console.log(`Server running on http://localhost:${port}`);
})
