const authorization = (role)=>
{
    return async(req,res,next)=>
    {
        
        if(!req.user) return res.status(401).send({status:'error', error:"Unauthorized."});

        if (!role.includes(req.user.role))  return res.status(403).send({status:'error', error:"Forbidden."});
        
        next();
    }
}

export default authorization;
