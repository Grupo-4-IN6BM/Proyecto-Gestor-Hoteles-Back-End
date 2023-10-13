const { Router } = require('express');
const passport = require('passport');
const express = require('express');
const { google } = require('../controllers/authGoogle');
const app = express();
const router = Router();
// app.use(expressSession({
//     secret: 'tu_secreto', // Cambia 'tu_secreto' por una cadena segura para tus sesiones
//     resave: false,
//     saveUninitialized: true
//   }));
// app.use(passport.initialize());
// app.use(passport.session());
// Rutas de autenticación con Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', 
  passport.authenticate('google', { session: false }), 
  (req, res) => {
    if(req.user) {
      req.session.user = user; 
        res.redirect('/hoteles');
    } else {
      // Error de autenticación
      res.status(401).json({error: 'No se pudo autenticar al usuario'});
    }
});
// Rutas de autenticación con Facebook
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook', { successRedirect: '/auth/success', failureRedirect: '/auth/failure' }));

module.exports = router;
