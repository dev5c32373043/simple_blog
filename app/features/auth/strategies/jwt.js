const passportJwt = require('passport-jwt');
const extractJwt  = passportJwt.ExtractJwt;
const JwtStrategy = passportJwt.Strategy;

module.exports = ()=>{
  let cookieExtractor = (req)=> {
    if (req && req.signedCookies) return req.signedCookies.jwt;
  }
  let options = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: require(`${process.cwd()}/config`)[NODE_ENV].jwtSecret
  }

  return new JwtStrategy(options, (jwt_payload, next)=> {
    models.User.findById(jwt_payload.id, (error, user)=>{
      if(error) return done(error, false)
      user ? next(null, user) : next(null, false)
    })
  })
}
