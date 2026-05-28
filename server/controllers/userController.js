import User from "../models/User.js";

export const registerUser = async (req, res)=>{
    try {
        const {name, email, password} = req.body;
        const userExist = await User.findOne({email});

        if(userExist){
            return res.json({
                message: "User already exists"
            });
        }

        const user = await User.create({
            name,
            email, 
            password
        })

        res.json(user)
    } catch (error) {
        console.error("error in the registerUser() ===> ", error)
        
        res.status(500).json({
            message: "Server Error"
        });
    }
}

