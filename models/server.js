//Importaciones de nodejs
const express = require('express');
const cors = require('cors');
const { dbConection } = require('../database/config');
const {roles} = require('../controllers/usuario');
const passport = require('passport');
const expressSession = require('express-session');
class Server {

    constructor() {
        //Configuración inicial
        this.app = express();
        this.app.use(cors());
        this.app.use(expressSession({
            secret: 'tu_secreto', // Cambia 'tu_secreto' por una cadena segura para tus sesiones
            resave: false, 
            saveUninitialized: false,
            cookie: {
              expires: 0
            }
          }));
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        this.app.get('/', (req, res) => {
            res.send("PAGINA DE INICIO")
        })
        this.port = process.env.PORT;

        this.paths = {
            auth:           '/api/auth',
            authSocial:     '/api/social',
            buscar:         '/api/buscar',
            eventos:        '/api/eventos',
            facturas:       '/api/facturas',
            habitaciones:   '/api/habitaciones',
            hoteles:        '/api/hoteles',
            reservaciones:  '/api/reservaciones',
            servicios:      '/api/servicios',
            tipo:           '/api/tipo',
            usuarios:       '/api/usuarios',
        }


        //Conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        //Rutas de mi app
        this.routes();

    }

    //Función de conexión
    async conectarDB() {
        await dbConection();
        await roles()
    }

    //Un middleware es una función que se ejecuta antes de las rutas
    middlewares() {

        // CORS
        this.app.use(cors());

        // Lectura y parseo del Body
        this.app.use(express.json());

        //Directorio publico
        this.app.use(express.static('public'));

    }


    routes() {
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.authSocial, require('../routes/auth-social'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.eventos , require('../routes/evento'));
        this.app.use(this.paths.facturas, require('../routes/factura'));
        this.app.use(this.paths.habitaciones, require('../routes/habitacion'));
        this.app.use(this.paths.hoteles, require('../routes/hotel'));
        this.app.use(this.paths.reservaciones, require('../routes/reservacion'));
        this.app.use(this.paths.servicios, require('../routes/servicio'));
        this.app.use(this.paths.tipo, require('../routes/tipo-evento'));
        this.app.use(this.paths.usuarios, require('../routes/usuario'));
    }


    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto ', this.port);
        })
    }


}


//Importamos la clase Server
module.exports = Server;