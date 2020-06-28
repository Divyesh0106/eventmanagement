const mongoose =  require('mongoose');

const userSchema = new mongoose.Schema({
    email : { type : String ,default: ""},
    password : { type : String ,default: ""},
    firstName : { type : String ,default: ""},
    lastName : { type : String ,default: ""},
    gender : { type : Number },
    dateOfBirth : { type : Date , default: null },
    status : { type: Number , default: 1 } // 0 - Inactive, 1 - Active, 2- Delete
},{
    timestamps: true
})

/** CHECK FOR EMAIL/USER ALREADY EXISTS */
userSchema.statics.checkUserExists =  function(email,cb){
    return this.find({
        email: email,
        status: {
            $ne: 2
        }
    }, cb);
}


/** INSERT USER IN USER COLLECTION */
userSchema.statics.insertNewUser = function(userObject,cb){    
    userObject.save((err,newUser)=>{        
        cb(err,newUser)    
    })
}

/** UPDATE USER DATA */
userSchema.statics.updateUser = function(userId,userData,cb){
    return this.findOneAndUpdate({
        _id : mongoose.Types.ObjectId(userId)
    },userData,{
        new : true
    },cb)
}

/** CHECK FOR EMAIL/USER ALREADY EXISTS */
userSchema.statics.getUser =  function(id,cb){
    return this.aggregate([
     {
        $match:{
            _id : mongoose.Types.ObjectId(id),
            status: {
                $ne: 2
            }
        }
    },{
        $project: {
            email : 1 ,            
            firstName : 1,
            lastName : 1,
            gender : 1,
            dateOfBirth : 1
        }
    }],cb);
}

module.exports = mongoose.model('users', userSchema);