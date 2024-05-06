const Tracker = require("../model/tracker.model");
const { User } = require("../model/user.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");

//create a tracker
const projectDetails = asyncHandler(async(req, res, next)=>{
    const {title} = req.body ;
    const {sponsor , manager , report , 
        report_Number , RAG_status, headline, tasks, comment , 
        completion_date_plan , completion_date_actual ,add_more, risk} = req.body;

    if(!title) throw new ApiError(400 , "Please provide title of the project");

     const project = await Tracker.create({title});
     
    if(!project) throw new ApiError(500 , "Error while creating project in db");
     if(sponsor) project.sponsor = sponsor;
     if(manager) project.manager = manger;
     if(report) project.report  = report;
     if(report_Number) project.report_Number = report_Number;
     if(RAG_status) project.RAG_status = RAG_status;
     if(headline) project.headline = headline;
     if(tasks) project.tasks = tasks;
     if(comment) project.comment  = comment;
     if(completion_date_actual) project.completion_date_acutal = completion_date_actual;
     if(completion_date_plan) project.completion_date_plan = completion_date_plan;
     if(add_more) project.add_more = add_more;
     if(risk) project.risk = risk;

     await project.save({validateBeforeSave : false});

    res.status(201).json(new ApiResponse(201, "Tracker createdd", {success : true, project}));
});


//update the tracker
const updateProject = asyncHandler(async(req, res, next)=>{
    const {title} = req.body;

    const project = await Tracker.findOne({title});

    if(!project) throw new ApiError(404, "Project with the title not found");

    const {sponsor , manager , report , 
        report_Number , RAG_status, headline, tasks, comment , 
        completion_date_plan , completion_date_actual ,add_more, risk} = req.body;

        if(sponsor) project.sponsor = sponsor;
        if(manager) project.manager = manger;
        if(report) project.report  = report;
        if(report_Number) project.report_Number = report_Number;
        if(RAG_status) project.RAG_status = RAG_status;
        if(headline) project.headline = headline;
        if(tasks) project.tasks = tasks;
        if(comment) project.comment  = comment;
        if(completion_date_actual) project.completion_date_acutal = completion_date_actual;
        if(completion_date_plan) project.completion_date_plan = completion_date_plan;
        if(add_more) project.add_more = add_more;
        if(risk) project.risk = risk;

         await project.save({validateBeforeSave : false});

        res.status(201).json(new ApiResponse(201, "Tracker updated", {success : true, project}));

})

const deleteProject = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    //now we have id of the project we have to delete

    if(!id) throw new ApiError(404, "unable to find the project with id");

    const deleted  =await Tracker.findByIdAndDelete(id);

    if(!deleted) throw new ApiError(500 , "unable to delete the project with id");

    res.status(200).json(new ApiResponse(200 , "Project deleted" , {sucess : true}));

})

const getProject = asyncHandler((async(req,res)=>{
    const {id} = req.params;
    if(!id) throw new ApiError(404, "unable to find the project with id");
    const project  =await Tracker.findById(id);
    if(!project) throw new ApiError(500 , "unable to find the project with id");
    res.status(200).json(new ApiResponse(200 , "Project deleted" , {sucess : true, project}));
    
}));


const getAllProjects = asyncHandler(async(req, res)=>{
   ////we need to give the user all the project they have put in the database so we need the user id
   const {email} = req.user.email;
   if(!email) throw new ApiError(400 , "Please login in first ");
   //now we have the email find the user id
   const  user = await User.find({email});
   //now we have the id of the user
   const projects = await Tracker.find({owner : user._id});
   //now we have the projects 
   if(!projects) throw new ApiError(500 , "Unable to get projects from the database");
   res.status(200).json(new ApiResponse(200 , "Projects fetched" , projects));
})

module.exports = {updateProject , projectDetails, deleteProject, getProject, getAllProjects};