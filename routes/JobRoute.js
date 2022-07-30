const jobController = require("../controllers/job.controller");
const router = require("express").Router();
const { body, validationResult } = require("express-validator");

const userValidationRules = () => {
  return [
    // username must be an email
    body("username").isEmail().not(),
    // password must be at least 5 chars long
    body("password").isLength({ min: 5 }),
  ];
};

module.exports = (app) => {
  router.post("/addJob/:id", 
  // userValidationRules,
   jobController.addJobs);
  router.post("/applyJob", 
  // userValidationRules,
   jobController.applyJobs);
  app.use("/api", router);
};

