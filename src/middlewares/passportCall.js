import passport from "passport";

const passportCall = (strategy, options = {}) => 
{
    return async (req, res, next) => 
    {
        passport.authenticate(strategy, options, async (error, user, info) => 
        {
            if (error) return next(error);
            if (user) req.user = user; //autenticacion llevada a cabo con exito
            next();
        })(req, res, next);
    };
}

export default passportCall;