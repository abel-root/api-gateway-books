const config=require("../Config-service");
const axios=require('axios');

const  routes=(app)=>{

    //user services
    app.use('/users', async (req,res)=>{
        try {
            const response= await axios({
                method: req.method,
                url: `${config.userServiceURL}${req.originalUrl}`,
                data: req.body
            });
            res.json(response.data);
        } catch (error) {
            const message=`Mistake with the users service`;
            const code =500;
            res.status(500).json({statusCode : code, message: message, Mistake: error });
        }
    })

    //books services
    app.use('/books', async (req,res)=>{
        try {
            const response= await axios({
                method: req.method,
                url: `${config.booksServiceURL}${req.originalUrl}`,
                data: req.body
            });
            res.json(response.data);
        } catch (error) {
            const message=`Mistake with the users service`;
            const code =500;
            res.status(500).json({statusCode : code, message: message, Mistake: error });
        }
    })

    //reservation services
    app.use('/reservations', async (req,res)=>{
        try {
            const response= await axios({
                method: req.method,
                url: `${config.reservationServiceURL}${req.originalUrl}`,
                data: req.body
            });
            res.json(response.data);
        } catch (error) {
            const message=`Mistake with the users service`;
            const code =500;
            res.status(500).json({statusCode : code, message: message, Mistake: error });
        }
    })

    //nofification services
    app.use('/notifications', async (req,res)=>{
        try {
            const response= await axios({
                method: req.method,
                url: `${config.notificationServiceURL}${req.originalUrl}`,
                data: req.body
            });
            res.json(response.data);
        } catch (error) {
            const message=`Mistake with the users service`;
            const code =500;
            res.status(500).json({statusCode : code, message: message, Mistake: error });
        }
    })
}
module.exports=routes;