module.exports = ()=>{
  global.models = {
    user: null,
    post: null
  }
  let keys = Object.keys(models)

  for(var i = 0; i < keys.length; i++){
    let key = keys[i];
    Object.defineProperty(models, key.charAt(0).toUpperCase() + key.slice(1), {
      get: ()=> require(`${process.cwd()}/app/models/${key}`)
    })
  }
}
