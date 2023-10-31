import passport from "passport";
import local from 'passport-local';
import GithubStrategy from 'passport-github2';
import UserManager from "../dao/mongo/managers/userManager.js";
import auth from "../services/auth.js";
import { Strategy,ExtractJwt } from 'passport-jwt';
import { cookieExtractor } from "../utils.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";


const LocalStrategy = local.Strategy; //local = user + pass
const usersServices = new UserManager();

const initializeStrategies = ()=> 
{
    passport.use('register', new LocalStrategy({passReqToCallback:true, usernameField:'email',session:false}, async (req,email,password,done)=>
    {
        //register logic
        const {firstName, lastName, age} = req.body;
        if(!firstName || !lastName || !email || !age || !password) return done(null,false, {message: "incomplete values"})
        
        const hashedPasword = await auth.createHash(password);   //hasheo la pass
        const newUser = {firstName, lastName, email, age, password:hashedPasword};
        const result = await usersServices.create(newUser);
        done(null,result);
    }));

    passport.use('login', new LocalStrategy({usernameField:'email',session:false}, async (email,password,done)=>
    {
        //login logic
        if(!email || !password) return done(null,false, {message: "incomplete values"})
        const user = await usersServices.getBy({email});
        if(!user) return done(null,false, {message: "incorrect credentials "})
        const isValidPassword = await auth.validatePassword(password, user.password);
        if(!isValidPassword) return done(null,false, {message: "incorrect credentials"})
        done(null,user);
    }));

    passport.use('github', new GithubStrategy(
    {
        clientID: 'Iv1.87741a77ec8e2cf2',
        clientSecret: 'bc7f140ebb4006da6f1f7659bba30b089ff77e2e',
        callbackURL:'http://localhost:8080/api/sessions/githubcallback'

    }, async (accessToken, refreshToken, profile, done)=>
    {
        const {email,name} = profile._json;
        const user = await usersServices.getBy({email});
        if(!user)
        {
            const newUser = 
            {
                firstName:name,
                email,
                password:''
            }

            const result = await usersServices.create(newUser);
            done(null,result);
        }else
        {
            done(null,user);
        }
    }))

    passport.use('google', new GoogleStrategy(
    {
        clientID:"682700092334-ls46chnjrekrkvp7lr6907m5posodi02.apps.googleusercontent.com",
        clientSecret:"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",
        callbackURL:"http://localhost:8080/api/sessions/googlecallback",
    },async(accessToken, refreshToken, profile, done) => 
    {
        try 
        {
            const { _json } = profile;
            const user = await usersServices.getBy({ email: _json.email });
      
            if (user) return done(null, user); //se encontro en la bd un usuario con el email ingresado.
            else 
            {
                //caso contrario, creo usuario y agrego a bd (o persistencia seleccionada)
                const newUser = {firstName: _json.given_name,lastName: _json.family_name,email: _json.email};
                const createdUser = await usersServices.create(newUser);
              
                if (createdUser) return done(null, createdUser);
                else return done(new Error('Error al crear el usuario'), null);
            }
        } catch (error){ return done(error, null);}
    }));

    passport.use('jwt', new Strategy(
    {
        jwtFromRequest:ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey:'buhoS3cr3t'
    }, async(payload,done)=>
    {
        return done(null,payload);
    }))
}

passport.serializeUser((user,done)=>
{
    return done(null,user._id);
});

passport.deserializeUser(async(id,done)=>
{
    const user = await usersServices.getBy({_id:id});
    done(null,user);
});

export default initializeStrategies;