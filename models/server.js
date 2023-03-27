//Importaciones de nodejs
const express = require('express');
const cors = require('cors');
const { dbConection } = require('../database/config');

class Server {

    constructor() {
        //Configuración inicial
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            // cuentas:       '/api/cuentas',
            eventos:     '/api/eventos',
            // facturas: '/api/facturas',
            // habitaciones:   '/api/habitaciones',
            // reservaciones:  '/api/reservaciones',
            // servicios:   '/api/servicios',
            usuarios:   '/api/usuarios',
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
        // this.app.use(this.paths.cuentas , require('../routes/detalle-cuenta'));
        this.app.use(this.paths.eventos , require('../routes/evento'));
        // this.app.use(this.paths.facturas, require('../routes/factura'));
        // this.app.use(this.paths.habitaciones, require('../routes/habitacion'));
        // this.app.use(this.paths.reservaciones, require('../routes/reservacion'));
        // this.app.use(this.paths.servicios, require('../routes/servicio'));
        // this.app.use(this.paths.eventos, require('../routes/tipo-evento'));
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