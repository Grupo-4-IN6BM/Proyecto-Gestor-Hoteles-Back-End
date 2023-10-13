const express = require('express');
const passport = require('passport');
const Usuario = require('../models/usuario');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;

// Configuración de las estrategias
const google = passport.use(new GoogleStrategy({
    clientID: '1053486057798-g8616fs764lp64ov08qu49esmnnhplsm.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'https://proyecto-gestor-hoteles-back-end-gilt.vercel.app/api/social/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    console.log("hola");
    try {
        // Verifica si el usuario ya existe en la base de datos
        const user = await Usuario.findOne({ correo: profile.emails[0].value });
    
        if (user) {
            // Actualiza la imagen del usuario
            const userUpdate = await Usuario.findByIdAndUpdate(user._id, { img: profile.photos[0].value });
            done(null, userUpdate);
        } else {
            // Crea un nuevo usuario si no existe
            let newUser = new Usuario({
                nombre: profile.displayName,
                correo: profile.emails[0].value,
                rol: "ROL_CLIENTE",
                img: profile.photos[0].value
            });
            await newUser.save();
            done(null, newUser);
        }
    } catch (err) {
        console.log("ERRORR");
        done(err);
    }
}));
const facebook = passport.use(new FacebookStrategy({
    clientID: 'YOUR_FACEBOOK_APP_ID',
    clientSecret: 'YOUR_FACEBOOK_APP_SECRET',
    callbackURL: 'http://localhost:8080/auth/facebook/callback'
}, (accessToken, refreshToken, profile, done) => {
    // Implementa la lógica de autenticación o registro del usuario aquí
    return done(null, profile);
}));

// Configuración de la sesión
passport.serializeUser((user, done) => {
    if (!user) {
      return done(new Error('No user'));
    }
    console.log("USER", user);
    console.log("DONE",done);
    done(null, user._id);
    console.log(done);
  });
passport.deserializeUser(async (id, done) => {
    console.log("HOOOOLA");
    try {
      const user = await Usuario.findById(id);
  
      if (!user) {
        return done(null, false);
      }
      
      done(null, user);
  
    } catch (err) {
      done(err, null);
    }
  });
