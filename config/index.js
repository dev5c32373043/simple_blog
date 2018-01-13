module.exports = {
  development: {
    db: 'mongodb://localhost:27017/simple_blog',
    jwtSecret: 'blablabla',
    cookieSecret: 'secret'
  },
  production: {
    db: process.env.DB_URL,
    jwtSecret: process.env.JWT_SECRET,
    cookieSecret: process.env.COOKIE_SECRET,
    host: 'https://simple-express-blog.herokuapp.com',
    smtp: {
      host: process.env.SMTP_HOST,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    }
  }
}
