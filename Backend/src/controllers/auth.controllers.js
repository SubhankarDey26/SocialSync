const crypto=require("crypto")
const jwt=require("jsonwebtoken")
const userModel=require("../models/user.model")

async function registerController(req,res){
    const {email,username,password,bio,profileImage}=req.body

    // const isUserExistByEmail=await userModel.findOne({email})
    // if(isUserExistByEmail)
    // {
    //    return res.status(409).json({
    //     message:"User Already Exist with same email"
    //    })
    // }
    // const isUserExistByUsername=await userModel.findOne({username})
    // if(isUserExistByUsername)
    // {
    //     return res.status(409).json({
    //         message:"User alreay exist with same username"
    //     })
    // }
    
    const isUserAlreayExists=await userModel.findOne(
        {
            $or:[
                {username},
                {email}
            ]
        }
    )

    if(isUserAlreayExists){
        return res.status(409).json({
            message:"User Already Exist "+ isUserAlreayExists.email==email ?"Email already exist" :"Username ALready Exist"
        })
    }

    const hash=crypto.createHash('sha256').update(password).digest('hex')

    const user=await userModel.create({
        username,
        email,
        bio,
        profileImage,
        password:hash
    })

    const token=jwt.sign({
        id:user.__id
    },process.env.JWT_SECRET,{expiresIn:"1d"}
    )
    res.cookie("token",token)

    res.status(201).json({
        message:"User registered Succesfully",
        user:{
            email:user.email,
            username:user.username,
            profileImage:user.profileImage,
            bio:user.bio
        }
    })
}


async function logincontroller(req,res){
    const {username,email,password}=req.body

    const user=await userModel.findOne({
        $or:
        [
            {
                username:username
            },
            {
                email:email
            }
        ]
    })
    if(!user){
        return res.status(404).json({
            message:"User Not Found"
        })
    }
    const hash=crypto.createHash('sha256').update(password).digest('hex')

    const isPasswordValid =hash ==user.password

    if(!isPasswordValid){
        return res.status(404).json({
            message:"password Invalid"
        })
    }

    const token=jwt.sign({
        id:user.__id
    },process.env.JWT_SECRET,{expiresIn:"1d"})

    res.cookie("token",token)

    res.status(200).json({
        message:"User Login SucessFully",
        user:{
            email:user.email,
            username:user.username,
            profileImage:user.profileImage,
            bio:user.bio
        }
    })
}

module.exports={registerController,logincontroller}