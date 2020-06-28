const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const func = require('../../config/functions');
const functions = func.func();
const eventModel = require('../../models/event');
let response = {};
/** List Events
 * @requires userId
 * @returns  Array of Events
 */
router.post("/listevents",(req,res)=>{
    var post = req.body;
    var required_params = ['userId'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0 && elem.invalid.length == 0;
    if(valid){
        eventModel.showEventList(post.userId,(err,events)=>{
            if(err){
                response = { status : false, message : "Oops! Something went wrong."}
                res.send(response);
            }else{
                response = { status : true, message : "Success.", data : events}
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

/** List Event Participants
 * @requires eventId
 * @returns  Array of Users
 */
router.post("/listparticipants",(req,res)=>{
    var post = req.body;
    var required_params = ['eventId'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0 && elem.invalid.length == 0;
    if(valid){        
        eventModel.getEventParticipants(post.eventId,(err,participants)=>{
            if(err){
                response = { status : false, message : "Oops! Something went wrong."}
                res.send(response);
            }else{
                response = { status : true, message : "Success.", data : participants}
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


/** Create New Event
 * @requires title,description,date,time,place,maxParticipants
 * @returns  eventObject
 */
router.post("/newevent",(req,res)=>{
    var post = req.body;
    var required_params = ['userId','title','description','date','time','place','maxParticipants'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0 && elem.invalid.length == 0;
    if(valid){
        let createEventObject = { 
            organizerId : mongoose.Types.ObjectId(post.userId),
            title : post.title,
            description : post.description,            
            place : post.place,
            maxParticipants : post.maxParticipants,
        }
        let instanceEventSchema =new  eventModel(createEventObject);
        instanceEventSchema.save((err,newEvents)=>{
            if(err){
                response = { status : false, message : "Oops! Something went wrong."}
                res.send(response);
            }else{
                response = { status : true, message : "Event created successfully.", data : newEvents}
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


/**
 * @requires userId,eventId
 * 
 */
router.post("/joinevent",async(req,res)=>{
    var post = req.body;
    var required_params = ['userId','eventId'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0 && elem.invalid.length == 0;
    if(valid){
        /** Use Async Await for Practice purpose */
        const eventdetails = await eventModel.getEventDetails(post['eventId'])        
        if(eventdetails.length  > 0 && eventdetails[0].maxParticipants > eventdetails[0].participants.length){
            eventModel.joinEvent(post['eventId'],post['userId'],(err,updateEvent)=>{
                if(err){
                    response = { status : false, message : "Oops! Something went wrong."}
                    res.send(response);
                }else{
                    if(updateEvent){
                        response = { status : true, message : "Participated in Event successful.", data : updateEvent}
                        res.send(response);
                    }else{
                        response = { status : false, message : "Oops! Something went wrong."}
                        res.send(response);
                    }
                }
            })
        }else{
            response = { status : false, message : "Event participation limit ful-filled."}
            res.send(response);
        }
    }else{
        var str = functions.loadErrorTemplate(elem);        
        response = {
            status : false,
            message : "Invalid request: "+ str
        }
        res.json(response);
    }
})


/**
 * @requires userId,eventId
 * 
 */
router.post("/leaveevent",(req,res)=>{
    var post = req.body;
    var required_params = ['userId','eventId'];
    var elem = functions.validateReqParam(post, required_params);
    var valid = elem.missing.length == 0 && elem.blank.length == 0 && elem.invalid.length == 0;
    if(valid){
        eventModel.leaveEvent(post['eventId'],post['userId'],(err,updateEvent)=>{
            if(err){
                response = { status : false, message : "Oops! Something went wrong."}
                res.send(response);
            }else{
                if(updateEvent){
                    response = { status : true, message : "Participation removed from Event successful.", data : updateEvent}
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