const mongoose = require('mongoose');
const TaskGroup = require('./TaskGroup')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
        validate: [ email => {
            const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return re.test(email);
        }, 'INVALID EMAIL']
    },
    password: {
        type: String,
        required: true
    },
    taskGroupList: [ TaskGroup ],
    dailyTaskGroup: {
        type: TaskGroup,
        default: { name: "daily" }
    }
});

function getRelativeTime(time){
    let times = time.toLocaleTimeString().split(":");
    if (times[0]>=12) {
        if( times[0]!=12 ) times[0]=times[0]-12
        return times[0]+":"+times[1]+" PM"
    }
    else if(times[0]==0) return "12:"+times[1]+" AM"
    return times[0]+":"+times[1]+" AM"
}
function getStatus(date,time) {
    if (!date && !time) return "NOT_COMPLETED";
    const e=new Date();

    if( date && time ) {
        const newDate = new Date( date.getFullYear() , date.getMonth() , date.getDate() , time.getHours() , time.getMinutes() )
        if ( newDate < e ) return "MISSING"
        return "NOT_COMPLETED"
    }

    if( date ){
        if( date.getDate() === e.getDate() && date.getMonth()===e.getMonth() && date.getFullYear()===e.getFullYear() )
            return "TODAY";
        else if( date < e )
            return "MISSING";
        else return "NOT_COMPLETED"
    }
    else{
        const newTime = new Date( e.getFullYear() , e.getMonth() , e.getDate() , time.getHours() , time.getMinutes() )
        if(newTime<e) return "MISSING";
        return "NOT_COMPLETED"
    }
}
function getTask( task ){
    const taskObj = {
        name: task.name,
        id: task._id.toString(),
        status: (task.completed)? "COMPLETED" : getStatus( task.date,task.time )
    }
    if( task.detail ) taskObj.detail = task.detail
    if( task.date ) taskObj.date = task.date.toDateString()
    if( task.time ) taskObj.time = getRelativeTime(task.time)
    return taskObj;
}

UserSchema.methods.getUserData = function(){
    return this.taskGroupList.map( item => { return { name: item.name, id: item._id.toString(), taskList: item.taskList.map( task => getTask(task) ) } } )
}
UserSchema.methods.getTaskGroupList = function(){
    return this.taskGroupList.map( item => { return { name: item.name, id: item._id.toString()} } )
}
UserSchema.methods.addTaskGroup = async function ( name ){
    this.taskGroupList.forEach( ( taskGroup )=>{ if(taskGroup.name === name ) return { status: "NAME_EXIST" } } )
    const len = this.taskGroupList.push( { name: name } )
    try{
        await this.save();
        return { taskGroup: { name: name, id: this.taskGroupList[len-1]._id.toString() } }
    } catch (e) {
        return {};
    }
}
UserSchema.methods.deleteTaskGroup = async function ( id ){
    let isThere = false;
    this.taskGroupList = this.taskGroupList.filter( (taskgroup)=> {
        let flag = taskgroup._id.toString()===id;
        if( flag ) isThere = true;
        return !flag;
    } )
    if (!isThere) return { success: false , status: "TASK_GROUP NOT_EXIST" }
    await this.save()
    return { success: true }
}

UserSchema.methods.getTaskList = function( taskGroupId ){
    if (!taskGroupId ) return;
    const taskGroup = this.taskGroupList.find( item => item._id.toString() === taskGroupId )

    return taskGroup.taskList.map( task => getTask( task ) )
}
UserSchema.methods.addTask = async function( taskGroupId , taskObj ){
    if (!taskGroupId || !taskObj) return { success: false };
    const savableTaskObj = { name: taskObj.name }
    if(taskObj.detail) savableTaskObj.detail=taskObj.detail;
    if(taskObj.date) {
        const date=new Date(taskObj.date);
        if(date.getDate()) savableTaskObj.date=date;
    }
    if(taskObj.time) {
        const time=new Date(taskObj.time);
        if(time.getTime()) savableTaskObj.time=time;
    }

    const taskGroup = this.taskGroupList.find( item => item._id.toString() === taskGroupId )
    const len = taskGroup.taskList.push( savableTaskObj )
    await this.save()
    const taskFromDB = taskGroup.taskList[ len - 1 ];
    return { success: true, task: getTask( taskFromDB ) };
}
UserSchema.methods.deleteTask = async function( taskGroupId , taskId ) {
    if (!taskGroupId || !taskId ) return false;
    const taskGroup = this.taskGroupList.find( item => item._id.toString() === taskGroupId )
    taskGroup.taskList = taskGroup.taskList.filter( task => task._id.toString() !== taskId )
    try{ await this.save();return true; } catch (e) { return false; }
}
UserSchema.methods.completeTask = async function( taskGroupId , taskId ) {
    if (!taskGroupId || !taskId ) return false;
    const taskGroup = this.taskGroupList.find( item => item._id.toString() === taskGroupId )
    const task = taskGroup.taskList.find( task => task._id.toString() === taskId )
    task.completed = true
    await this.save()
    return true;
}

UserSchema.methods.getDailyTaskList = function(){
    return this.dailyTaskGroup.taskList.map( task => getTask( task ) );
}
UserSchema.methods.addDailyTask = async function ( taskObj ) {
    if ( !taskObj ) return { success: false };
    const savableTaskObj = { name: taskObj.name }
    if(taskObj.detail) savableTaskObj.detail=taskObj.detail;
    if(taskObj.time) {
        const time=new Date(taskObj.time);
        if(time.getTime()) savableTaskObj.time=time;
    }
    const taskGroup = this.dailyTaskGroup
    const len = taskGroup.taskList.push( savableTaskObj )
    await this.save()
    const taskFromDB = taskGroup.taskList[ len - 1 ];
    return { success: true, task: getTask( taskFromDB ) };
}
UserSchema.methods.deleteDailyTask = async function( taskId ) {
    if ( !taskId ) return false;
    const taskGroup = this.dailyTaskGroup
    taskGroup.taskList = taskGroup.taskList.filter( task => task._id.toString() !== taskId )
    try{
        await this.save()
        return true;
    } catch (e) { return false; }
}
UserSchema.methods.completeDailyTask = async function(taskId){
    if (!taskId ) return false;
    const task = this.dailyTaskGroup.taskList.find( task => task._id.toString() == taskId )
    task.completed = true
    await this.save( )
    return true;
}

const User = mongoose.model('User', UserSchema )

module.exports=User