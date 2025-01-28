const authorizeAdmin = (req,res,next)=>{
    
   if(!req.user){
     return res.status(401).json({message:"unauthorized:User not authenticated"});
   }

    if(req.user.role!=='admin'){
        return res.status(403).json({message:'access denied, Admin only'});
    }
    next();
};

module.exports =authorizeAdmin;