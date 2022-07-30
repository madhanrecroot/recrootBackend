const express = require("express");
const mongoose = require("mongoose");

const ObjectId = require("mongodb").ObjectId;

const UserResumeProfile = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    userID: {
      type: String,
      required: true,
    },
    eMail: {
      type: String,
      required: true,
    },
    resume:{
      resumeFileLocation: String,
      coverLetterFileLocation: String,
      desiredJobField: String,
      resumeFirstName: String,
      resumeLastName: String,
      mobileNumber: String,
      carearLevel: String,
      totalWorkExperience: String,
      jobsPreference: [],
      expectedSalary: String,
      skills: [],
      education: [
        {
          collegeName: String,
          country: String,
          degreeName: String,
          duration: String,
          experience: String,
          graduate: String,
          logo: String,
          state: String,
          fromDate: String,
          toDate: String,
        },
      ],
      gender: String,
      languages: [],
      cvSetting: String,
      country: [],
      nationality: [],
      countrieswithworkingRights: [],
      countrieswithworkingRights: {
        days: Number,
        time: String,
      },
      workExperience: [
        {
          companyName: String,
          experience: String,
          duration: String,
          location: String,
          role: String,
          fromDate: String,
          toDate: String,
        },
      ],
      skils: [
        {
          skillName: String,
          Experience: String,
          Compitance: String,
        },
      ],
      projects: [
        {
          portafolioLink: String,
          ProjectName: String,
          Organization: String,
          Description: String,
        },
      ],
      traning: [
        {
          title: String,
          instituete: String,
          date: String,
        },
      ],
      socialMediaLink: [
        {
          title: String,
          socialMediaLink: String,
        },
      ],
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("UserResumeProfile", UserResumeProfile);
