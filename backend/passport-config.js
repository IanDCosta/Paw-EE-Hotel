const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByEmail, getUserById) {
    const authenticateUser = async (email, password, done) => {
        const user = await getUserByEmail(email)
        
        if(user == null){
            return done(null, false, { message: 'No user found' })
        }

        try {
            if(await bcrypt.compare(password, user.password)){
                return done(null, user)
            } else {
                return done(null, false, { message: 'incorrect password' })
            }
        } catch (err) {
            return done(err)
        }
    }

    passport.use(new LocalStrategy(({
        usernameField: 'email',
    }), authenticateUser))

    passport.serializeUser((user,done) => done(null, user._id))
    /* passport.deserializeUser((id,done) => {
        return done(null, getUserById(id))
    }) */
    passport.deserializeUser( async (id,done) => {
        const user = await getUserById(id);
        return done(null, user);
    })
}

module.exports = initialize