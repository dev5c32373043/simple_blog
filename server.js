const express      = require('express');
const morgan       = require('morgan');
const mongoose     = require('mongoose');
const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const path         = require('path');
const passport     = require('passport');
const config       = require('./config');
const cluster      = require('cluster');
const numCPUs      = require('os').cpus().length;
const PORT         = process.env.PORT || 3000;
const app          = express();

global.NODE_ENV    = process.env.NODE_ENV || 'development';

app.use((req, res, next)=> {
  res.setHeader('X-Powered-By', 'pickyDude')
  next()
})

if(NODE_ENV == 'production'){
  app.get('*.js', (req, res, next)=> {
    req.url = req.url + '.gz';
    res.set('Content-Encoding', 'gzip');
    res.set('Content-Type', 'text/javascript');
    next();
  });

  app.get('*.css', (req, res, next)=> {
    req.url = req.url + '.gz';
    res.set('Content-Encoding', 'gzip');
    res.set('Content-Type', 'text/css');
    next();
  });
}

mongoose.Promise = require('bluebird');

mongoose.connect(config[NODE_ENV].db)

app.use(morgan('dev'))

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use(cookieParser(config[NODE_ENV].cookieSecret))

app.use(express.static(path.join(__dirname, 'public')))

passport.use(require('./app/features/auth/strategies/jwt')())

app.use(passport.initialize())

if(NODE_ENV == 'production'){
  app.use(require('./app/features/uploader/s3'))
}

const database = mongoose.connection
database.on('error', console.error.bind(console, 'connection error:'))
database.once('open', ()=>{
  require('./app/models')()
  app.use('/auth', require('./app/features/auth/router'))
  app.use('/main', require('./app/features/main/router'))
  app.use('/profile', require('./app/features/profile/router'))
  app.use('/mail', require('./app/features/mailer/router'))
  app.get('*', (req, res)=> res.sendFile(`${__dirname}/public/index.html`))

  if(NODE_ENV == 'production'){
    if (cluster.isMaster) {
      console.log(`Master ${process.pid} is running`);
      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }

      cluster.on('exit', (deadWorker, code, signal) => {
        console.log(`worker ${deadWorker.process.pid} died.`);
        if(signal != 'SIGINT'){
          let worker = cluster.fork();
          console.log(`worker ${worker.process.pid} born.`);
        }
      })
    } else {
     app.listen(PORT, ()=> console.log(`Express listen on ${PORT} port!`))
     console.log(`Worker ${process.pid} started`);
   }
  }else{
    app.listen(PORT, ()=> console.log(`Express listen on ${PORT} port!`))
  }
})
