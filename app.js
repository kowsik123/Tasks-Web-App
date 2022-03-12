const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser")

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/task_manager');
}
main().catch(err => console.log(err))

const User = require("./models/User")

async function auth(req){
    const cid = req.cookies.credentialId;
    return ( await User.findById( cid ) );
}
function send(res,success,obj) {
    if (success === undefined) res.send( JSON.stringify( obj ) );
    else {
        obj.success=success;
        res.send( JSON.stringify( obj ) );
    }
}

app.post('/api', async function (req, res) {
    if (req.body.type === "ADD USER") {
        const userObj = req.body.user;
        if (!userObj) return send(res , false,{});
        if (!userObj.email) return send(res , false,{});
        if (!userObj.password) return send(res , false,{});
        if (!userObj.name) return send(res , false,{});

        if ( await User.exists({ email: userObj.email }) ) return send( res , false , {status: "EMAIL ALREADY EXISTS"});

        try {
            const user = new User(userObj);
            const userSaved = (await user.save());

            res.cookie('name', userSaved.name)
            res.cookie('credentialId', userSaved._id.toString())
            send(res,true,{});
        } catch (e) {
            if (e.errors && e.errors.email) return send(res,false,{status: "INVALID EMAIL ADDRESS"} );
        }
    }
    else if (req.body.type === "CHECK USER") {
        const userObj = req.body.user;
        if (!userObj) return send( res, false, {} );
        if (!userObj.email) return send( res, false, {} );
        if (!userObj.password) return send( res, false, {} );
        const email = await User.exists({email: userObj.email})
        if (email) {
            const user = await User.findOne({email: userObj.email, password: userObj.password}, "_id name")
            if (user === null) res.send(JSON.stringify({success: false, status: "INCORRECT PASSWORD"}))
            else {
                res.cookie('name', user.name)
                res.cookie('credentialId', user._id.toString())
                res.send(JSON.stringify({success: true}))
            }
        } else {
            res.send(JSON.stringify({success: false, status: "EMAIL NOT FOUND"}))
        }
    }
    else if (req.body.type === "ADD TASK_GROUP") {
        if(!await auth(req)) return send(res ,false ,{} );

        const taskGroupName = req.body.name
        if (!taskGroupName) return send( res , false, {} );
        const user = await User.findById(req.cookies.credentialId);

        const taskGroup = await user.addTaskGroup( taskGroupName );

        if( taskGroup.taskGroup ) return send( res , true, taskGroup.taskGroup );
        return send( res ,false , taskGroup );
    }
    else if(req.body.type === "DELETE TASK_GROUP"){
        if(!await auth(req)) return send(res ,false ,{} );

        const taskGroupId = req.body.id;
        if(! taskGroupId ) return send( res ,false ,{} );
        const user = await User.findById( req.cookies.credentialId );

        return send( res,undefined, await user.deleteTaskGroup( taskGroupId ) );
    }
    else if(req.body.type === "ADD TASK"){
        const user = await auth(req)
        if(!user) return send(res ,false ,{} )

        const taskGroupId= req.body.taskGroupId;
        if(! taskGroupId) return send( res,false,{} )
        const taskObj = req.body.task
        if(! taskObj) return send( res,false,{} )
        if(! taskObj.name) return send( res,false,{} )

        if ( taskGroupId === "daily" ) return send( res , undefined , await user.addDailyTask( taskObj ) )
        else return send( res , undefined , await user.addTask( taskGroupId , taskObj ) )
    }
    else if(req.body.type === "GET TASK_GROUP_LIST"){
        const user = await auth(req);
        if(! user) return send(res ,false ,{} );

        return send( res, true , { taskGroupList : user.getUserData() });
    }
    else if(req.body.type === "GET DAILY_TASK_LIST"){
        const user = await auth(req);
        if(!user) return send(res ,false ,{} );

        return send(res ,true ,{ taskList : user.getDailyTaskList() } );
    }
    else if(req.body.type === "COMPLETE TASK"){
        const user = await auth(req);
        if(!user) return send(res ,false ,{} );

        const taskGroupId = req.body.taskGroupId
        const taskId = req.body.taskId;
        if( !taskGroupId || !taskId ) return send(res ,false ,{} );

        if( taskGroupId === "daily" ) return send( res , await user.completeDailyTask( taskId ) , {} );
        return send( res , await user.completeTask( taskGroupId , taskId ) , {} )
    }
    else if(req.body.type === "DELETE TASK"){
        const user = await auth(req);
        if(!user) return send(res ,false ,{} );

        const taskGroupId = req.body.taskGroupId;
        const taskId = req.body.taskId;

        if( !taskId ) return send( res , false , {} );

        if ( taskGroupId === "daily" ) return send(res,await user.deleteDailyTask( taskId ),{});
        else return send( res ,await user.deleteTask( taskGroupId , taskId ) , {} )
    }
    else {
        return send(res,false,{status: "NO TYPE"})
    }
})

app.listen(3000);