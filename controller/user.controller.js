const { User } = require("../model/user.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");



const homepage = asyncHandler(async(req, res) => {
    if (req.isAuthenticated()) {
      console.log(req.user);
      req.email = req.user.email;
      res.send(`Hello, ${req.user.displayName}!`);
    } else {
      res.redirect('/login');
    }
  }
    
);

const fillDetails = asyncHandler(async (req, res) => {
    if (!req.isAuthenticated()) {
     // get the details of the user
        const {email} = req.user.email;
        const {name, lastName, number, mentor} = req.body;
      
        if(!email || !name || !lastName || !number) throw new ApiError(400 , "Please provide the details" );

        //now we have all the details of the user 

        const user =  await User.create({email, name, lastName, number});

        //the user have been created in the database
        //checking if the user is mentor or not 

        if(!user) throw new ApiError(500 , "Something went wrong while creating account");
        
        if(mentor) user.mentor = true;

        res.status(201).json(new ApiResponse(201, "User created" , {success : true, user} ));

    } else {
      res.redirect('/login');
    }
  });

  const firstLogin  = asyncHandler(async(req, res , next)=>{
        const {email} = req.user.email;

        //now we have the email 
        if(!email) throw new ApiError(500 , "login failed");

        const user = await User.findOne({email});

        if(user){
          //if the user is found in the database 
          //redirect them to home page
          res.redirect('/');
        }else{
          res.redirect('/details')
        }
  })


  const getUser = asyncHandler(async(req ,res)=>{
    const {id} = req.params;

    if(!id) throw new ApiError(400 , "Please provide the valid id");

    const user = await User.findById(id);

    if(!user) throw new ApiError(404, "Unable to find the user");

    res.status(200).json(new ApiResponse(200 , "user fetched" , {success : true, user}));
  });
module.exports = {homepage, fillDetails, firstLogin};