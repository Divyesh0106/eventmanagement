const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const func = require('../../config/functions');
const functions = func.func();
const userModel = require('../../models/user');
let response = {};
/** Signup for New User
 * @requires email,password
 * @returns userObject
 */
router.post("/signup",(req,res) => {
    var post = req.body;
    var required_params = ['email','password'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0 && elem.invalid.length == 0;
    if(valid){
        userModel.checkUserExists(post['email'],(err,userObjects)=>{
            if(err){
                response = { status : false, message : "Oops! Something went wrong."}
                res.send(response);

            }else{
                if(userObjects.length > 0){
                    response = { status : false, message : "User already exist."}
                    res.send(response);

                }else{
                    bcrypt.genSalt(10, function (err, salt) {
                        if (err) {
                            response = { status : false, message : "Oops! Something went wrong."}
                            res.send(response);

                        } else {
                            bcrypt.hash(post['password'], salt, function (err, hash) {
                                if (err) {                                    
                                    response = { status : false, message : "Oops! Something went wrong."}
                                    res.send(response);

                                } else {
                                    let userObj = { 'email' : post['email'], 'password' : hash }
                                    let instanceUserSchema = new userModel(userObj)
                                    userModel.insertNewUser(instanceUserSchema,(err,userObject)=>{
                                        if(err){
                                            response = { status : false, message : "Oops! Something went wrong."}
                                            res.send(response);

                                        }else{
                                            if(userObject){
                                                response = { status : true, message : "User created successfully.", data : userObject}
                                                res.send(response);
                                            }else{
                                                response = { status : false, message : "Oops! Something went wrong."}
                                                res.send(response);
                                            }
                                        }
                                    })
                                }
                            })
                        }
                    })                    
                }
            }
        })
    }else{
        var str = functions.loadErrorTemplate(elem);        
        response = {
            status : false,
            message : "Invalid request: "+ str
        }
        res.json(response);
    }
})

/** Login User
 * @requires email,password
 * @returns userObject
 */
router.post("/login",(req,res)=>{
    var post = req.body;
    var required_params = ['email','password'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0 && elem.invalid.length == 0;
    if(valid){
        userModel.checkUserExists(post['email'],(err,userObjects)=>{
            if(userObjects.length > 0){
                bcrypt.compare(post['password'], userObjects[0].password, (err,result) => {
                    console.log("Err",err,result,post,post['password'], userObjects[0].password)
                    if (result) { 
                        response = { status : true, message : "Login successfully.", data: userObjects[0]}
                        res.send(response);
                    }else{
                        response = { status : false, message : "Invalid User Or Password."}
                        res.send(response);
                    }
                })
            }else{
                response = { status : false, message : "User not registered."}
                res.send(response);
            }
        })
    }else{
        var str = functions.loadErrorTemplate(elem);        
        response = {
            status : false,
            message : "Invalid request: "+ str
        }
        res.json(response);
    }
})

/** Update User Profile
 * @requires (optional) firtName,lastName,gender,dateOfBirth
 * @returns userObject
 */
router.post("/updateprofile",(req,res)=>{  
    let post = req.body;  
    let updateObject = { status : 1 }
    if(typeof(post.firstName) !== "undefined" && post.firstName !== ""){
        updateObject['firstName'] = post.firstName;
    }
    if(typeof(post.lastName) !== "undefined" && post.lastName !== ""){
        updateObject['lastName'] = post.lastName;
    }
    if(typeof(post.gender) !== "undefined" && post.gender !== ""){
        updateObject['gender'] = post.gender;
    }
    if(typeof(post.dateOfBirth) !== "undefined" && post.dateOfBirth !== ""){
        if(new Date(post.dateOfBirth) !== "Invalid Date"){
            updateObject['dateOfBirth'] = new Date(post.dateOfBirth);
        }
    }    
    var required_params = ['userId'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0 && elem.invalid.length == 0;
    console.log('eleme',updateObject)
    if(valid){
        userModel.updateUser(post.userId,updateObject,(err,userObj)=>{
            if(err){
                response = { status : false, message : "Oops! Something went wrong."}
                res.send(response);
            }else{
                response = { status : true, message : "User Profile Updated Successfully.", data: userObj}
                res.send(response);
            }
        })
    }else{
        var str = functions.loadErrorTemplate(elem);        
        response = {
            status : false,
            message : "Invalid request: "+ str
        }
        res.json(response);
    }    
})

/** Update User Profile
 * @requires userId
 * @returns userObject
 */
router.post("/getuserdetail",(req,res)=>{
    var post = req.body;
    var required_params = ['userId'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0 && elem.invalid.length == 0;
    if(valid){
        userModel.getUser(post['userId'],(err,userObjects)=>{
            if(err){                                
                response = { status : false, message : "Oops! Something went wrong."}
                res.send(response);
            }else{
                if(userObjects.length > 0){
                    response = { status : true, message : "Success.", data: userObjects[0]}
                    res.send(response); 
                }else{
                    response = { status : false, message : "Oops! Something went wrong."}
                    res.send(response);
                }
            }
        })
    }else{
        var str = functions.loadErrorTemplate(elem);        
        response = {
            status : false,
            message : "Invalid request: "+ str
        }
        res.json(response);
    }
})

module.exports = router;