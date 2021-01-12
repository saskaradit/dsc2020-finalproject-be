const express = require('express')
const app = express();

app.disable('x-powered-by')
app.use(express.urlencoded({extended: true}));
app.use(express.json())

const checkApiKey = (req,res,next) => {
  // const {apiKey} = req.headers['x-api-key'];
  if(req.headers['x-api-key'] === undefined) return res.send({message:"API Key Not Found"})
  else if(req.headers['x-api-key']!=='DSC2020BACKEND') return res.send({message:"API Key Invalid"})
  
  next()
}

app.use(checkApiKey) // check api key
app.use('/v1/province', require('./src/routes/v1/province.routes'))

app.listen(8080,console.log('Listening on PORT:8080'))

