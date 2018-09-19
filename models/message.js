var mongoose = require("mongoose");

var messageSchema = mongoose.Schema({
    subject: String,
    text: String,
    from: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    } 
});

module.exports = mongoose.model("Message", messageSchema);  