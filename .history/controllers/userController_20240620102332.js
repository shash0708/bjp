var User =require('../models/Excel');

var csv = require('csvtojson')

const importUser = async(req,res)=>{


    try {
        csv()
        .fromFile
        res.send({status:200,success:true,msg:error.message});
        
    } catch (error) {
        res.send({status:400,success:false,msg:error.message});

    }
}


module.export = {
    importUser
}