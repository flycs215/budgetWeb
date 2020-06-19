var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TotalSchema = new Schema({

    type: {type: String},
    description: {type: String},
    value: {type: Number}
    // id: {type: String}

});

TotalSchema
.virtual('url')
.get(function(){
    return '/control';
});

module.exports = mongoose.model('Total', TotalSchema);

