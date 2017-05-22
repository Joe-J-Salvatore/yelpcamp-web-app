var mongoose = require("mongoose");
var passLocMong = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

UserSchema.plugin(passLocMong);

module.exports = mongoose.model("User", UserSchema);