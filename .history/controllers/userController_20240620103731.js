var User =require('../models/Excel');

var csv = require('csvtojson')

const importUser = async(req,res)=>{


    try {

        var userDa

        csv()
        .fromFile(req.file.path)
        .then((response)=>{
        
         })
        res.send({status:200,success:true,msg:'CSV Imported'});
        
    } catch (error) {
        res.send({status:400,success:false,msg:error.message});

    }
}


module.export = {
    importUser
}