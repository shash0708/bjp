var User =require('../models/Excel');

var csv = require('csvtojson')

const importUser = async(req,res)=>{


    try {
        csv()
        .fromFile(req.file.path)
        .then((response)=>{
            console.log(respone);
        })
        res.send({status:200,success:true,msg:''});
        
    } catch (error) {
        res.send({status:400,success:false,msg:error.message});

    }
}


module.export = {
    importUser
}