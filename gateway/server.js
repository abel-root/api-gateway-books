const express=require("express");
const axios=require("axios");
const bodyParser=require("body-parser")
const cors=require("cors");


const app  = express();

const PORT= process.env.PORT || 3000;

app
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: false }))
    .use(cors());
    
 require("./routes")(app);


app.listen(PORT,()=>{
    console.log(`API Gateway start on the port ${PORT}`);
})