const express= require('express');
const bodyParser=require('body-parser');
const cors=require('cors');


const app = express();
const PORT= process.env.PORT || 4000

app
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({extended:true}))
    .use(cors())

require('./routes')(app);


app.listen(PORT, ()=>{
    console.log(`The microservice users is starting on the port ${PORT}`);
})