const { ValidationError } = require('sequelize');
const {User, Books, UserBooks}=require('../models');
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
     User.findAll({include:["books"]}).then((users)=>{
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
          include:["books"],
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

  
  /*======================= Start Books router ================= */
  app.post("/users/create-books/:userId",async(req,res)=>{
     const {userId}=req.params;

     try {
          const user= await User.findOne({
               where:{
                    id : parseInt(userId)
               }
          });
          
          if(!user)return res.status(404).json({statusCode:404,message:`User does not found`});
     
          const books={
               name:req.body.name,
               userId: user.id,
               about: req.body.about,
               pub_date: new Date(req.body.pub_date)
          }

       await Books.create(books).then(async(book)=>{
          res.status(201).json({statusCode:201,message:`User books is added with successfully !`,data:book});

       }).catch((err)=>{
          return res.status(500).json({statusCode:500,message:`Server ERROR`, data:err})
       })
     
     } catch (error) {
          res.status(500).json({statusCode:500,message:`Server ERROR`, data:error})
     }

  })
  //associer un livre à un ou plussieur author
  app.post("/users/:userId/associate-books/:bookId",async(req,res)=>{
     const {userId, bookId}=req.params;
     
     try {
          const user= await User.findOne({
               where:{
                    id : parseInt(userId)
               }
          });
          
          if(!user)return res.status(404).json({statusCode:404,message:`User does not found`});
          
          const book=await Books.findOne({
               where:{
                    id:parseInt(bookId)
               }
          })
          if(!book)return res.status(404).json({statusCode:404,message:`book does not found`})
          const arrayUser=req.body.array;
          if (arrayUser.length>0){
               for (let element of arrayUser) {
                    await UserBooks.create({
                      userId: element,  // Associer chaque utilisateur au livre
                      bookId: book.id
                    });
                  }
              
                  // Une seule réponse après que toutes les associations soient faites
                  res.status(201).json({
                    statusCode: 201,
                    message: `Book has been correctly associated with the users`,
                    data: arrayUser  // Retourner la liste des utilisateurs associés
                  });
               
          }else{
               res.status(404).json({statusCode:404,message:`array is empty!`,data:arrayUser})
          }
          

     } catch (error) {
          res.status(500).json({statusCode:500,message:`Server ERROR`, data:error})
     }
  })
  //get all books for othor
  app.get('/users/books/:bookId',async(req,res)=>{
     const {bookId}=req.params;
     
     try {
     const books=await Books.findOne({
          include:["users"],
          where:{
               id:parseInt(bookId)
          }
     })

     if(!books)return res.status(404).json({statusCode:404,message:`Get one book !`})

     res.status(200).json({statusCode:200,message:`Get one book !`, data:books})
     
     } catch (error) {
          res.status(500).json({statusCode:500,message:`Get one book !`,
          data:error
     })
     }
  })
  //delete books : only admin can do  that 
  app.delete('/users/:bookId/:userId',async(req,res)=>{
     const {bookId,userId}=req.params;

     await Books.destroy({
          where:{
               id:parseInt(bookId),
               userId: parseInt(userId)
          }
     }).then(book=>{
          const message=`Books deleted successfully`;
          res.status(200).json({statusCode:200,message:message,data:book});
     }).catch((error)=>{
          const message=`Server ERROR`;
          res.status(500).json({statusCode:500,message:message,data:error}) ; 
     })
  })
  /*======================= End Books router ================= */



}
