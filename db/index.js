var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InfoSchema = new Schema({
	site_name:{type:String },
    title:{type:String },
    description:{type:String},
    url:{type:String},
    type:{type:String},
    image:{type: {}},
    video:{type: {}},
}, { versionKey: false });

module.exports = mongoose.model('Info' , InfoSchema);