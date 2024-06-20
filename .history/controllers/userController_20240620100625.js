

const importUser = async(req,res)=>{


    try {
        res.send({status:200,success:true,msg:error.message});
        
    } catch (error) {
        res.send({status:400,success:false,msg:error.message});

    }
}


module.export = {
    importUser;
}