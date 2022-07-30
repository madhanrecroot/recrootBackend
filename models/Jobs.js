const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
// Create Schema
const JobsSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    jobTitle: {
      type: String,
      required: true,
    },
    jobType: {
      type: String,
      required: true,
    },
    applicationDeadline: {
      type: String,
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    requiredSkill:[],
    referredBy: {
      type: String,
      default: null,
    },
    jobApplyType: {
      type: String,
      default: null,
    },
    salary: {
      salaryType: String,
      minSalary: Number,
      maxSalary: Number,
      salaryCrrancy: String,
    },
    essentialInformation: {
      careerLevel: String,
      experience: String,
      qualification: String,
      // preferdCandidateLocation: String,
      typeWorks: String,
    },
    // quistion: [
    //   {
    //     question: String,
    //     quizType: String,
    //     answer: {
    //       first: String,
    //     },
    //   },
    // ],
    address: {
      country: String,
      state: String,
      city: String,
      pincode: String,
      address: String,
      // latitute: String,
      // longatute: String,
    },
  },
  { strict: false }
);
module.exports = mongoose.model("Job", JobsSchema);
