const express = require('express');
const session = require('express-session');
const app = express();
const mysql = require('mysql');
const ejs = require('ejs');
const path = require('path');

const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1901',
    database: 'anuario'
})

app.use(session({
    secret: 's-user', // Clave secreta para firmar la cookie de sesión
    resave: false, // No guardar sesión si no hay cambios
    saveUninitialized: false // No crear sesión automáticamente
  }));
  
app.use(express.urlencoded({
    extended: true
}))


app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

//Rutas GET
app.get('/', (req, res) => {
    const message = req.query.message ?? '';

    res.render('home', {
        mensaje: message
    });
})

app.get('/login', (req, res) => {
    const message = req.query.message ?? '';

    res.render('home', {
        mensaje: message
    });
})

app.get('/registro-usuario', (req, res) =>{
    res.render('registro-usuario');
})

app.get('/editar-alumno', (req, res) =>{
    const usuario = req.session.usuario ?? '';
    const idAlumno = req.query.id ?? '';

    if(usuario === ''){
        res.redirect('/');
        return true;
    }

    conexion.query(`SELECT * FROM alumnos WHERE id = '${idAlumno}'`,
    (error, rows) =>{
        if(error){
            throw error;
        }
        if(rows.length > 0){
            res.render('editar-alumno', {
                alumno: rows[0]
            });
        }
    })
})

app.get('/editar-proyecto', (req, res) =>{
    const usuario = req.session.usuario ?? '';
    const idProyecto = req.query.id ?? '';

    if(usuario === ''){
        res.redirect('/');
        return true;
    }

    conexion.query(`SELECT * FROM proyectos WHERE id = '${idProyecto}'`,
    (error, rows) =>{
        if(error){
            throw error;
        }
        if(rows.length > 0){
            res.render('editar-proyecto', {
                proyecto: rows[0]
            });
        }
    })
})

app.get('/registro-anuario', (req, res) =>{
    const usuario = req.session.usuario ?? '';
    const rol = req.session.usuarioTipo ?? '';
    const nombre = req.session.nombreUsuario ?? '';
    const apellidos = req.session.apellidosUsuario ?? '';
    const id = req.session.idUsuario ?? '';

    if(usuario === ''){
        res.redirect('/');
        return true;
    }

    if(rol == 'alumno'){ 
        conexion.query(`SELECT * FROM alumnos WHERE correo = '${usuario}'`,
        (error, rows) =>{
            if(error){
                throw error;
            }
            if(rows.length > 0){
                res.render('registro-anuario', {
                    alumno: rows[0],
                    correo: usuario,
                    nombre: nombre,
                    id: id,
                    apellidos: apellidos
                });
            } else {
                res.render('registro-anuario', {
                    correo: usuario,
                    nombre: nombre,
                    id: id,
                    apellidos: apellidos
                });
            }
        })
        return true;
    }

    res.render('registro-anuario');
})

app.get('/eliminar-alumno', (req, res) =>{
    const usuario = req.session.usuario ?? '';
    
    if(usuario === ''){
        res.redirect('/');
        return true;
    }
    const mensaje = encodeURIComponent('Registro eliminado correctamente.');
    const id = req.query.id;

    conexion.query(`DELETE FROM alumnos where id='${id}'`,
        (error, rows) =>{
        if(error){
            throw error;
        }
        res.redirect('/alumnos?message='+mensaje);
    })
})

app.get('/eliminar-proyecto', (req, res) =>{
    const usuario = req.session.usuario ?? '';
    
    if(usuario === ''){
        res.redirect('/');
        return true;
    }
    const mensaje = encodeURIComponent('Registro eliminado correctamente.');
    const id = req.query.id;

    conexion.query(`DELETE FROM proyectos where id='${id}'`,
        (error, rows) =>{
        if(error){
            throw error;
        }
        res.redirect('/proyectos?message='+mensaje);
    })
})

app.get('/agregar-proyecto', (req, res) =>{
    const usuario = req.session.usuario ?? '';
    const rol = req.session.usuarioTipo ?? '';

    if(usuario === ''){
        res.redirect('/');
        return true;
    }

    res.render('agregar-proyecto', {
        rol: rol,
        usuario: usuario
    });
})

app.get('/alumnos', (req, res) =>{
    const message = req.query.message ?? '';
    const rol = req.session.usuarioTipo ?? '';
    const usuario = req.session.usuario ?? '';

    if(usuario === ''){
        res.redirect('/');
        return true;
    }

    conexion.query(`SELECT id, nombre, apellidos, fotografia FROM alumnos`,
        (error, rows) =>{
        if(error){
            throw error;
        }
        if(rows.length > 0){
            res.render('alumnos', {
                alumnos: rows,
                mensaje: message,
                rol: rol,
                usuario: usuario
            });
        } else {
            res.render('alumnos', {
                alumnos: rows,
                mensaje: 'No hay alumnos registrados.',
                rol: rol,
                usuario: usuario
            });
        }
    })
})

app.get('/buscar', (req, res) =>{
    const rol = req.session.usuarioTipo ?? '';
    const usuario = req.session.usuario ?? '';
    const nombre = req.query.nombre;

    if(usuario === ''){
        res.redirect('/');
        return true;
    }
    
    conexion.query(`SELECT id, nombre, apellidos, fotografia FROM alumnos where nombre like '%${nombre}%'`,
        (error, rows) =>{
        if(error){
            throw error;
        }
        if(rows.length > 0){
            res.render('alumnos', {
                alumnos: rows,
                rol: rol,
                usuario: usuario
            });
        } else {
            res.render('alumnos', {
                alumnos: rows,
                mensaje: 'No se encuentran coincidencias',
                rol: rol,
                usuario: usuario
            });
        }
    })
})

app.get('/proyectos', (req, res) =>{
    const message = req.query.message ?? '';
    const rol = req.session.usuarioTipo ?? '';
    const usuario = req.session.usuario ?? '';

    if(usuario === ''){
        res.redirect('/');
        return true;
    }
    
    conexion.query(`SELECT * FROM proyectos`,
    (error, rows) =>{
    if(error){
        throw error;
    }
    if(rows.length > 0){
        res.render('proyectos', {
            proyectos: rows,
            mensaje: message,
            rol: rol,
            usuario: usuario
        });
    } else {
        res.render('proyectos', {
            proyectos: rows,
            mensaje: 'No hay proyectos registrados.',
            rol: rol,
            usuario: usuario
        });
    }
});
})

app.get('/inf-alumno', (req, res) =>{
    const usuario = req.session.usuario ?? '';
    if(usuario === ''){
        res.redirect('/');
        return true;
    }
    const idAlumno = req.query.id ?? '';
    
    conexion.query(`SELECT * FROM alumnos WHERE id = '${idAlumno}'`,
    (error, rows) =>{
        if(error){
            throw error;
        }
        if(rows.length > 0){
            res.render('inf-alumno', {
                alumno: rows[0]
            });
        }
    })
})

app.get('/inf-proyecto', (req, res) =>{
    const usuario = req.session.usuario ?? '';
    if(usuario === ''){
        res.redirect('/');
        return true;
    }
    const idProyecto = req.query.id ?? '';
    
    conexion.query(`SELECT * FROM proyectos WHERE id = '${idProyecto}'`,
    (error, rows) =>{
        if(error){
            throw error;
        }
        if(rows.length > 0){
            res.render('inf-proyecto', {
                proyecto: rows[0]
            });
        }
    })
})

app.get('/logout', (req, res) => {
    // Destruir la sesión
    req.session.destroy((error) => {
      if (error) {
        console.error('Error al destruir la sesión:', error);
      }
      // Redirigir o responder según sea necesario
      res.redirect('/');
    });
});

//rutas POST
app.post('/crear-usuario', (req, res) =>{
    const nombre = req.body.nombre;
    const apellidos = req.body.apellidos;
    const correo = req.body.correo;
    const pass = req.body.pass;
    const tipo_usuario = req.body.tipo_usuario;
    const mensaje = encodeURIComponent('Usuario registrado con exito.');

    conexion.query(`INSERT INTO usuarios (nombre, apellidos, correo, password, tipo_usuario) 
        values ('${nombre}', '${apellidos}', '${correo}', '${pass}', '${tipo_usuario}')`,
        (error, rows) =>{
        if(error){
            throw error;
        }
        res.redirect('/?message='+mensaje);
    })
})

app.use(express.json())
app.post('/registro-anuario', (req, res) =>{
    const usuario = req.session.usuario ?? '';
    if(usuario === ''){
        res.redirect('/');
    }
    const nombre = req.body.nombre;
    const apellidos = req.body.apellidos;
    const correo = req.body.correo;
    const intereses = req.body.intereses;
    const habilidades = req.body.habilidades;
    const objetivosCorto = req.body.objetivosCorto;
    const objetivosLargo = req.body.objetivosLargo;
    const comentarios = req.body.comentarios;
    const imagen = req.body.imagen;
    
    conexion.query(`INSERT INTO alumnos (nombre, apellidos, correo, intereses, habilidades, objetivosCorto, objetivosLargo, comentarios, fotografia) 
        values ('${nombre}', '${apellidos}', '${correo}', '${intereses}', '${habilidades}', '${objetivosCorto}', '${objetivosLargo}', '${comentarios}', '${imagen}')`,
        (error, rows) =>{
        if(error){
            console.log(error);
        }
    })
})

app.use(express.json())
app.post('/registro-proyecto', (req, res) =>{
    const usuario = req.session.usuario ?? '';
    if(usuario === ''){
        res.redirect('/');
    }
    const nombre = req.body.nombre;
    const descripcion = req.body.descripcion;
    const autores = req.body.autores;
    const imagen = req.body.imagen;
    const evidencia = req.body.evidencia;

    conexion.query(`INSERT INTO proyectos (nombre, descripcion, autores, creado_por, fotografia, evidencia) 
        values ('${nombre}', '${descripcion}', '${autores}', '${usuario}', '${imagen}', '${evidencia}')`,
        (error, rows) =>{
        if(error){
            throw error;
        }
    })
})

app.use(express.json())
app.post('/actualizar-proyecto', (req, res) =>{
    const usuario = req.session.usuario ?? '';
    if(usuario === ''){
        res.redirect('/');
    }
    const nombre = req.body.nombre;
    const descripcion = req.body.descripcion;
    const autores = req.body.autores;
    const imagen = req.body.imagen;
    const evidencia = req.body.evidencia;
    const id = req.body.id;

    conexion.query(`UPDATE proyectos SET nombre='${nombre}', descripcion='${descripcion}',
    autores='${autores}', evidencia='${evidencia}', fotografia='${imagen}' where id='${id}'`,
        (error, rows) =>{
        if(error){
            throw error;
        }
    })
})

app.use(express.json())
app.post('/actualizar-alumno', (req, res) =>{
    const nombre = req.body.nombre;
    const apellidos = req.body.apellidos;
    const correo = req.body.correo;
    const intereses = req.body.intereses;
    const habilidades = req.body.habilidades;
    const objetivosCorto = req.body.objetivosCorto;
    const objetivosLargo = req.body.objetivosLargo;
    const comentarios = req.body.comentarios;
    const imagen = req.body.imagen;
    const id = req.body.id;

    let query = `UPDATE alumnos SET nombre='${nombre}', apellidos='${apellidos}', correo='${correo}',
    intereses='${intereses}', habilidades='${habilidades}', objetivosCorto='${objetivosCorto}',
    objetivosLargo='${objetivosLargo}', comentarios='${comentarios}', fotografia='${imagen}' where correo='${correo}'`;

    if(id !== null && id !== ''){
        query = `UPDATE alumnos SET nombre='${nombre}', apellidos='${apellidos}', correo='${correo}',
        intereses='${intereses}', habilidades='${habilidades}', objetivosCorto='${objetivosCorto}',
        objetivosLargo='${objetivosLargo}', comentarios='${comentarios}', fotografia='${imagen}' where id=${id}`;
    }

    conexion.query(query,
        (error, rows) =>{
        if(error){
            throw error;
        }
    })
})

app.post('/login', (req, res) => {
    const email = req.body.email ?? '';
    const pass = req.body.password ?? '';
    const mensaje = encodeURIComponent('Credenciales no validas.');
    
    if(email === ''){
        res.redirect('/');
    }

    conexion.query(`SELECT * FROM usuarios where correo = '${email}' and password = '${pass}'`,
    (error, rows) =>{
        if(error){
            throw error;
        }
        if(rows.length > 0){
            req.session.usuario = email;
            req.session.usuarioTipo = rows[0].tipo_usuario;
            req.session.nombreUsuario = rows[0].nombre;
            req.session.apellidosUsuario = rows[0].apellidos;
            res.redirect('/alumnos');
            return true;
        }
        res.redirect('/?message='+mensaje);
    })
})

app.listen(3000, () => {
    console.log('Servidor en linea')
})