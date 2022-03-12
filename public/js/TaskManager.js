class Task{
    taskGroup
    taskObj
    taskUI
    constructor(taskObj,taskGroup){
        this.taskObj=taskObj
        this.taskGroup=taskGroup
        this.taskUI=<TaskUI task={this} />
    }
    getName(){ return this.taskObj.name }
    getStatus(){ return this.taskObj.status }
    getId(){ return this.taskObj.id }
    getTaskGroup(){ return this.taskGroup }
    getDetail(){ return this.taskObj.detail }
    getDate(){ return this.taskObj.date }
    getTime(){ return this.taskObj.time }
    getTaskUI(){ return ()=> {return (this.taskUI) } }
    hasOnlyName(){ return !(this.getDetail() || this.getDate() || this.getTime()) }
    async delete(){
        let res;
        if( !isGuest ) res = JSON.parse( await doAjax( {
            type: "DELETE TASK" ,
            taskId: this.getId() ,
            taskGroupId: this.taskGroup.getId()
        }));
        else res={ success: true };
        if(!res.success) return;
        this.taskGroup.taskList.splice(  this.taskGroup.taskList.indexOf(this) ,1)
        window.reRenderContent()
    } // using api
    async completed(){
        if(!isGuest) await doAjax( {
            type: "COMPLETE TASK" ,
            taskGroupId: this.taskGroup.getId() ,
            taskId : this.getId()
        }, (res)=>{
            if( ! res.success ) return;
            this.taskObj.status="COMPLETED";
            this.taskGroup.taskList.splice( this.taskGroup.taskList.indexOf(this) ,1 )
            this.taskGroup.taskList.push( this )
            window.reRenderContent()
        } )
        else {
            this.taskObj.status="COMPLETED";
            this.taskGroup.taskList.splice( this.taskGroup.taskList.indexOf(this) ,1 )
            this.taskGroup.taskList.push( this )
            window.reRenderContent()
        }
    } // using api
}

class MethodsForGuest{
    static getRelativeTime(time){
        let times = time.toLocaleTimeString().split(":");
        if (times[0]>=12) {
            if( times[0]!=12 ) times[0]=times[0]-12
            return times[0]+":"+times[1]+" PM"
        }
        else if(times[0]==0) return "12:"+times[1]+" AM"
        return times[0]+":"+times[1]+" AM"
    }
    static getStatus(date,time) {
        if (!date && !time) return "NOT_COMPLETED";
        const e=new Date();

        console.log(date)

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
    static getGuestTaskObj( taskObj ){
        const savableTaskObj = { name: taskObj.name }
        let date = undefined
        let time = undefined
        if(taskObj.detail) savableTaskObj.detail=taskObj.detail;
        if(taskObj.date) {
            date=new Date(taskObj.date);
            if(date.getDate()) savableTaskObj.date=date.toDateString();
        }
        if(taskObj.time) {
            time=new Date(taskObj.time);
            if(time.getTime()) savableTaskObj.time= this.getRelativeTime( time );
        }
        savableTaskObj.status = this.getStatus( taskObj.date,taskObj.time )
        savableTaskObj.id = Math.random()*(10 ** 17).toFixed(0).toString()
        return savableTaskObj;
    }
}

class TaskGroup{
    taskGroupObj
    taskList
    constructor(taskGroupObj){
        this.taskList=taskGroupObj.taskList.map( (task)=> new Task(task , this) )
        this.taskGroupObj={ name:taskGroupObj.name, id: taskGroupObj.id }
    }
    getName(){ return this.taskGroupObj.name }
    focus(){
        document.querySelector(".nav-link[href='#TG"+this.getId()+"']").click()
    }
    getId(){ return this.taskGroupObj.id }
    getTaskList(){ return this.taskList; }
    async addTask(taskObj){
        let res;
        if( !isGuest ) res = JSON.parse(await doAjax( { type: "ADD TASK" , taskGroupId: this.getId() , task: taskObj } ))
        else res = { task: MethodsForGuest.getGuestTaskObj( taskObj ) , success: true };
        if ( res.success ){
            const task=new Task(res.task,this)
            this.taskList.splice(0,0,task)
            window.reRenderContent()
        }
    } // using api
}

class TaskGroupManager{
    taskGroupList
    dailyTaskGroup
    constructor(){
        this.taskGroupList=[]
        this.dailyTaskGroup=new TaskGroup({ name: "Daily", id:"daily" ,taskList: [] } );
        if(!isGuest) doAjax( { type: "GET TASK_GROUP_LIST" } ,
            (result) => {
                this.taskGroupList=result.taskGroupList.map( taskGroupObj => new TaskGroup(taskGroupObj) )
                this.reRenderApp()
            }
        )
        if(!isGuest) doAjax( { type: "GET DAILY_TASK_LIST" } , (result)=>{
            this.dailyTaskGroup.taskList=result.taskList.map( (task)=> new Task(task , this.dailyTaskGroup) )
            this.reRenderApp()
        })
    } // using api
    getList(){ return this.taskGroupList }
    getDailyTaskGroup(){
        return this.dailyTaskGroup
    }
    reRenderApp(){
        ReactDOM.render(<App />, document.getElementById('root'))
    }
    isDailyActive(){
        var id=document.querySelector(".tab-pane.active")
        return id.id === "daily"
    }
    getActiveTaskGroup(){
        const id=document.querySelector(".tab-pane.active").id.substring( 2 )
        if( id === "daily" ) return this.getDailyTaskGroup();
        return this.taskGroupList.find( (taskGroup)=>{ return taskGroup.getId()==id } )
    }
    async addTaskGroup(taskGroupObj){
        if(!isGuest) taskGroupObj = JSON.parse(await doAjax( { type: "ADD TASK_GROUP", name: taskGroupObj.name } ));
        else taskGroupObj = { id: Math.random()*(10 ** 17).toFixed(0).toString() , name: taskGroupObj.name , taskList: [] , success: true}
        if( taskGroupObj.success ) {
            taskGroupObj.taskList = []
            let taskGroup = new TaskGroup(taskGroupObj)
            this.taskGroupList.push(taskGroup)
            return taskGroup;
        }
        return null;
    } // using api
    async delete(taskGroup){
        let res
        if( !isGuest ) res = JSON.parse(await doAjax( { type: "DELETE TASK_GROUP" , id: taskGroup.getId() } ));
        else res={ success: true };
        if( res.success ) this.taskGroupList.splice( this.taskGroupList.indexOf(taskGroup) ,1);
        return res.success;
    } // using api
}