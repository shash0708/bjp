const Excel = require('../models/Excel');
const csv = require('csvtojson');

const importUser = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({ success: false, msg: 'No file uploaded' });
        }

        const userData = [];
        const filePath = req.file.path;

        const jsonArray = await csv().fromFile(filePath);
        
        jsonArray.forEach(row => {
            userData.push({ regdno: row.regdno });
        });

        await Excel.insertMany(userData);
        fs.unlinkSync(filePath); // Delete the file after processing

        res.send({ status: 200, success: true, msg: 'CSV Imported' });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};

module.exports = {
    importUser
};
