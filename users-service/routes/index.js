const { ValidationError } = require('sequelize');
const {User}=require('../models');
const bcrypt=require('bcrypt');

 module.exports=(app)=>{
/*======================== Start User router===================*/ 
     //create
  app.post('/users',async(req,res)=>{
       const users={
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password,10),
        type:req.body.type
       }

      await User.create(users).then((user)=>{
            const message=`The user is created with success.`;
            const code =201;
            res.status(201).json({statusCode:code,message,data:user})
       }).catch((error)=>{
            if(error instanceof ValidationError){
                const message=`The user must be unique !`
                const code =500;
                return res.status(500).json({statusCode:code,message,data:error});
            }
            const message=`Error became to the server !`
            const code =500;
            res.status(500).json({statusCode:code,message,data:error});
       })

  });

  //get All
  app.get('/users',async(req,res)=>{
     User.findAll().then((users)=>{
          if(users.length==0){
               const message=`The Users data is empty`
               return res.status(404).json({statusCode:404,message, data:users});
          }
          const message=`The Users collection is getting successfully`
          res.status(200).json({statusCode:200,message, data:users});
     }).catch((err)=>{
          const message=`Error to the server !`
            const code =500;
            res.status(500).json({statusCode:code,message,data:err});
     })
  });
  //get one 
  app.get('/users/:userId',async(req,res)=>{
     const {userId}=req.params;

     User.findOne({
          where:{
               id: parseInt(userId)
          }
     }).then((user)=>{
          if(!user){
               const message=`The user does not exist `
               return res.status(404).json({statusCode:404,message, data:user});
          }
          const message=`The user is getting successfully`
          res.status(200).json({statusCode:200,message, data:user});
     }).catch((err)=>{
          const message=`Error to the server !`
            const code =500;
            res.status(500).json({statusCode:code,message,data:err});
     })
  });

  //update
  app.put('/users/:userId', async (req,res)=>{
     const {userId}=req.params;
     const user= await User.findOne({
          where:{
               id:parseInt(userId)
          }
     })

     if(!user){
          const message=`The user does not exist !`;
          return res.status(404).json({statusCode:404,message})
     }

     try {
          await User.update(req.body,{
               where:{
                    id:user.id
               }
          }).then((_)=>{
               const message=`The user is  update successfully.`
               res.status(200).json({statusCode:200, message,data:user});
          }).catch(err=>{
               const message=`Error to the server !`
               const code =500;
               res.status(500).json({statusCode:code,message,data:err});
          })
     } catch (error) {
          const message=`Server Error !`;
          res.status(500).json({statusCode:500, message,data:error});
     }
  })

  //delete
  app.delete('/users/:userId', async (req,res)=>{
     const {userId}=req.params;
     const user= await User.findOne({
          where:{
               id:parseInt(userId)
          }
     })

     if(!user){
          const message=`The user does not exist !`;
          return res.status(404).json({statusCode:404,message})
     }

     try {
          await User.destroy({
               where:{
                    id:user.id,
                    email:user.email
               }
          }).then((_)=>{
               const message=`The user is  deleted with successfully.`
               res.status(200).json({statusCode:200, message, data:user});
          }).catch(err=>{
               const message=`Error to the server !`
               const code =500;
               res.status(500).json({statusCode:code,message,data:err});
          })
     } catch (error) {
          const message=`Server Error !`;
          res.status(500).json({statusCode:500, message,data:error});
     }
  })

  //update user password
  app.put('/users/:userId/update-password',async(req,res)=>{
     const {userId}=req.params;

     const user=await User.findOne({
          where:{
               id:parseInt(userId),
               email:req.body.email
          }
     });

     if(!user){
          const message=`The user does not exist.`;
          return res.status(404).json({statusCode:404,message})
     }

     try {
        await  User.update(await bcrypt.hash(req.body.password,10), {
          where:{
               id:user.id,
               email: user.email
          }
        }).then((_)=>{
          const message=`The password is update.`;
          res.status(200).json({statusCode:200,message,data:user});
        }).catch(err=>{
          const message=`Server Erorr`;
          res.status(500).json({statusCode:500,message,data:error});
        }) 
     } catch (error) {
          const message=`Server Erorr`;
          res.status(500).json({statusCode:500,message,data:error});
     }

  })


  /*======================== End User router===================*/ 

}
