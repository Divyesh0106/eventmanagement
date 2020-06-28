# Event Management REST APIs

Event Management REST APIs include basic APIs for user and event related operations.


## Installation

Use npm to install dependencies:

```bash
cd ./PROJECT_ROOT/
npm i

Run Project For development:
npm start 

Run Project For staging environment:
npm run staging

Run Project For production environment:
npm run production
```

## Usage

```
User APIs:
    - /user/signup @require email,password
    - /user/login @require email,password
    - /user/updateprofile @optional userId,firstName,lastName,gender,dateOfBirth
    - /user/getuserdetail @require userId
Event APIs:
    - /event/listevents @require userId
    - /event/listparticipants @require eventId
<<<<<<< HEAD
    - /event/newevent @require userId,title,description,date(YYYY-MM-DD),time(HH:mm),place,maxParticipants(>0)
=======
    - /event/newevent @require userId,title,description,date,time,place,maxParticipants(>0)
>>>>>>> baa3d043a3e8c40fc0fd7823754150d71a88b4b7
    - /event/joinevent @require userId,eventId
    - /event/leaveevent @require userId,eventId
```
