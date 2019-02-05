"use strict";

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

// Experience Schema in Resume
const expSchema = mongoose.Schema({
    company: String,
    location: String,
    position: String,
    desc: String,
    startYear: Number,
    endYear: Number
});

// Resume Schema
const resumeSchema = mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    location: String,
    linkedIn: String,
    suammary: String,
    skill: [String],
    experience: [expSchema],
    education: {
        shool: { type: String, required: true },
        location: String,
        degree: String,
        major: String
    },
    created: { type: Date, Default: Date.now },
    updated: { type: Date, Default: Date.now },
    submitter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: String
});

resumeSchema.pre('findOne', function(next){
    this.populate('user');
    next();
});

const Resume = mongoose.model('Resume', resumeSchema);  // collections = resumes
module.exports = { Resume };