/**
 * Created by gokhan on 4/1/15.
 */
'use strict';

var company = require('./company');
var mongoose = require('mongoose'),
    crypto = require('crypto'),


    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;
var User = new Schema({

    username: {
        type: String,
        unique: true,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        default: 'User'
    },
    email: {
        type: String,
        required: true,
        min: 5
    },
    name: {
        type: String,
        required: true,
        min: 5
    },
    company: [{type: ObjectId, ref: 'Company'}]

});


User.methods.encryptPassword = function (password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
    //more secure - return crypto.pbkdf2Sync(password, this.salt, 10000, 512);
};

User.virtual('userId')
    .get(function () {
        return this.id;
    });


User.virtual('password')
    .set(function (password) {
        this._plainPassword = password;
        this.salt = crypto.randomBytes(32).toString('base64');
        //more secure - this.salt = crypto.randomBytes(128).toString('base64');
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function () {
        return this._plainPassword;
    });


User.methods.checkPassword = function (password) {
    return this.encryptPassword(password) === this.hashedPassword;
};


module.exports = mongoose.model('User', User);

