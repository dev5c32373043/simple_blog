const fs      = require('fs');
const path    = require('path');
const events  = require('events');

module.exports = (res, file, oldPath, cb)=>{
  const emitter = new events.EventEmitter();
  let isValid = [".png", ".jpeg", ".jpg", ".gif"]
  .includes(path.extname(file.originalFilename)),
  filename = path.basename(file.path);
  if(typeof oldPath == 'function'){
    cb = oldPath;
  }else{
    let oldFilename = path.basename(oldPath);
  }
  emitter.on('file/move', ()=>{
    fs.rename(`${process.cwd()}/tmp/${filename}`, `${process.cwd()}/public/uploads/${filename}`, (error)=>{
      if(error) return res.status(500).end(error)
      return cb(filename);
    })
  })
  emitter.on('file/remove', ()=>{
    fs.unlink(`${process.cwd()}/tmp/${filename}`, ()=>{
      res.status(403).json({error: 'wrong image format!'})
    })
  })
  emitter.on('file/remove/old', ()=>{
    fs.unlink(`${process.cwd()}/public/uploads/${oldFilename}`, (error)=>{
      if(error) return res.status(500).end(error)
      emitter.emit('file/move')
    })
  })
  let event = (typeof oldFilename == 'string' ? 'file/remove/old' : 'file/move');
  isValid ? emitter.emit(event) : emitter.emit('file/remove')
}
