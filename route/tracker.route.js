const express = require('express');
const { projectDetails, updateProject } = require('../controller/tracker.controller');
const router = express.Router();

router.post('/createProject' , projectDetails);
router.patch('/updateProject' , updateProject);

module.exports = {router};