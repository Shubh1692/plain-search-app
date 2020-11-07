(async function () {
    try {
        const express = require('express');
        const path = require('path');
        const mongoose = require('mongoose');
        const { MONGODB_URL = 'mongodb+srv://Shubh1692:Shubh1616@cluster0.b9alz.mongodb.net/employeestest?retryWrites=true&w=majority' } = process.env;
        await mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Mongo Connection has been established successfully.');
        const {
            Schema,
            model
        } = require("mongoose");
        const EmployeeSchema = new Schema({
            name: {
                type: String,
            },
            email: {
                type: String,
                unique: true
            }
        }, { timestamps: true, });
        EmployeeSchema.index({ name: 1 });
        EmployeeSchema.index({ email: 1 });
        EmployeeModel = model("employees", EmployeeSchema);
        const app = express();
        app.get('/getSuggestion/:search', async (req, res) => {
            if (!req.params.search || !req.params.search.trim().length) {
                return res.status(400).json({
                    msg: 'Please provide search'
                }); 
            }
            EmployeeModel.find({ 'name': { '$regex': req.params.search, '$options': 'i' } })
                .exec((err, employees) => {
                    if (err) {
                        return res.status(500).json({
                            msg: 'Error while fatching employees in mongo'
                        })
                    }
                    return res.status(200).json({
                        msg: 'Fetch employees',
                        employees
                    });
                })
        });
        // Serve only the static files form the dist directory
        app.use(express.static(__dirname + '/'));

        app.get('/*', function (req, res) {
            res.sendFile(path.join(__dirname + '/index.html'));
        });

        // Start the app by listening on the default Heroku port
        app.listen(process.env.PORT || 8080);
    } catch (error) {
        console.error(error);
        process.exit()
    }
}())