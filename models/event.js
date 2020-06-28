const mongoose =  require('mongoose');

const eventsSchema = new mongoose.Schema({
    title : { type : String ,default: ""},
    description : { type : String ,default: ""},
    organizerId : { type : mongoose.Types.ObjectId , ref : 'users'},
    date : { type : Date },
    time : { type : Date },
    place : { type: String , default: "" },
    participants : [{ type: mongoose.Types.ObjectId, ref : 'users' }],
    maxParticipants : { type : Number , default : 0 },
    status : { type: Number , default: 1 } // 0 - Inactive, 1 - Active, 2- Delete
},{
    timestamps: true
})


/** SHOW EVENTS LIST*/
eventsSchema.statics.showEventList =  function(userId,cb){
    return this.find({        
        status : 1,
        organizerId: {
            $ne: mongoose.Types.ObjectId(userId)
        },
        participants: {
            $ne: mongoose.Types.ObjectId(userId)
        }
    }, cb);
}

/** INSERT EVENT IN EVENT COLLECTION (not in use) */
eventsSchema.statics.insertNewEvent = function(eventObject,cb){    
    eventObject.save((err,newEvent)=>{        
        cb(err,newEvent)    
    })
}


/** JOIN/PARTICIPATE EVENT*/
eventsSchema.statics.getEventDetails = function(eventId,cb){
    return this.find({
        _id : mongoose.Types.ObjectId(eventId)       
    })
}

/** JOIN/PARTICIPATE EVENT*/
eventsSchema.statics.joinEvent = function(eventId,userID,cb){
    return this.findOneAndUpdate({
        _id : mongoose.Types.ObjectId(eventId),
        organizerId : {
            $ne : mongoose.Types.ObjectId(userID)
        }
    },{
        $addToSet: { participants : mongoose.Types.ObjectId(userID) }
    },{
        new : true
    },cb)
}


/** LEAVE EVENT*/
eventsSchema.statics.leaveEvent =  function(eventId,userID,cb){
    return this.findOneAndUpdate({
        _id : mongoose.Types.ObjectId(eventId)
    },{
        $pull: { participants : mongoose.Types.ObjectId(userID) }
    },{
        new : true
    },cb);
}


/**PARTICIPANTS LIST*/
eventsSchema.statics.getEventParticipants = function(eventId,cb){
    return this.aggregate([{
        $match : {_id : mongoose.Types.ObjectId(eventId) }
    },{
        $lookup : {
            from : "users",
            localField: "participants",
            foreignField: "_id",
            as: "participants"
        }
    },{
        $project : {
            participants : { password : 0 }
        }
    }],cb)
}

module.exports = mongoose.model('events', eventsSchema);