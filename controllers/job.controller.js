const ObjectId = require("mongodb").ObjectId;

const moment = require("moment");
const jobDb = require("../models/Jobs");
const applyJobDb = require("../models/appliedJobs");

exports.addJobs = (req, res) => {
  
  const company = req.params.id
  const{ 
    jobTitle,
    jobType,
    applicationDeadline,
    jobDescription,
    requiredSkill,
    // referredBy,
    jobApplyType,
    salary}=req.body.details
    const essentialInformation = req.body.essential
    // quistion,
  const address =req.body.location


  const user = new jobDb({
    company:company,
    jobTitle: jobTitle,
    jobType: jobType,
    applicationDeadline: applicationDeadline,
    jobDescription: jobDescription,
    requiredSkill: requiredSkill,
    // referredBy: referredBy,
    jobApplyType: jobApplyType,
    salary: salary,
    essentialInformation: essentialInformation,
    // quistion: quistion,
    address: address,
  });
  user
    .save()
    .then(() => {
      return res.send("jobs save succesffuly");
    })
    .catch((err) => console.log(err.message));
};

exports.applyJobs = (req, res) => {

  const {
    resumeId,
    coverId,
    candidateId,
    jobId,
    companyId
  }=req.body
  const jobs =new applyJobDb({
    resumeId:resumeId,
    coverId:coverId,
    candidateId:candidateId,
    jobId:jobId,
    companyId:companyId
  });
  jobs
  .save()
  .then(()=>{
    return res.send("jobs applied succesffuly");
  })
  .catch((err) => console.log(err.message));
}