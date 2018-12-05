const app=require('express')();
const MongoDB = require('./MongoDB');

const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017";
const AUTH_KEY = process.env.SAURON_AUTH_KEY;
const dbName = "sauron";

app.use((req,res,next)=>{
  if(req.headers['sauron-auth']!=AUTH_KEY) {
    res.sendStatus(401);
    return;
  }
  next();
});

app.get('/', (req,res) => {
  let criteria = {};
  if(req.query.project) criteria['project.name'] = req.query.project;
  if(req.query.job) criteria['job.name'] = req.query.job;

  let mongo = new MongoDB(MONGO_URL,dbName);
  mongo.connect()
    .then(()=>mongo.select('results',criteria))
    .then((records)=>{res.json(records)})
    .then(()=>mongo.disconnect())
    .catch(()=>{
      mongo.disconnect();
      res.send('not ok');
    });
});
app.listen(PORT,()=>console.log("listening"));


