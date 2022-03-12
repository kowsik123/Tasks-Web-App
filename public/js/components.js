function Login(){
    React.useEffect( ()=>{
        $("#login-form").submit(function(e) {
            e.preventDefault();
            doAjax( { type: "CHECK USER" , user: { email: $("#login-email-input").val() , password: $("#login-password-input").val() } } , (res)=>{
                if( res.success ) window.location.reload()
                else {
                    if (res.status === "INCORRECT PASSWORD") $("#error-message").html( `<div class="alert alert-danger alert-dismissible">
                            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                            <strong>Wrong Password</strong>
                        </div>` )
                    else if( res.status === "EMAIL NOT FOUND" ) $("#error-message").html( `<div class="alert alert-danger alert-dismissible">
                            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                            <strong>Email Not Found</strong>
                        </div>` )
                }
            } )
        });
        $("#register-form").submit(function(e) {
            e.preventDefault();
            doAjax( { type: "ADD USER" , user: {
                    name: $("#register-name-input").val() ,
                    email: $("#register-email-input").val() ,
                    password: $("#register-password-input").val()
                }
            } , (res)=>{
                if( res.success ) window.location.reload()
                else {
                    if (res.status === "EMAIL ALREADY EXISTS") $("#error-message2").html( `<div class="alert alert-danger alert-dismissible">
                            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                            <strong>Email Already Exists</strong>
                        </div>` )
                    else if( res.status === "EMAIL NOT VALID" ) $("#error-message2").html( `<div class="alert alert-danger alert-dismissible">
                            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                            <strong>Email Not Valid</strong>
                        </div>` )
                }
            } )
        });
    } )
    return (
        <div className="container login_cont position-relative">
            <div className="float-left w-50 h-100 bg-white d-flex justify-content-center align-items-center" id="login-page" style={ { position: "relative" } }>
                <form id="login-form">
                    <h2 className="mx-auto text-center mb-5" >Login Page</h2>
                    <div className="input-group mb-4 mx-auto" style={ { width: "80%" } }>
                        <span className="input-group-text"><i className="bi bi-envelope" /></span>
                        <input id="login-email-input" type="email" className="form-control my-input" placeholder="Email Address" required />
                    </div>
                    <div className="input-group mb-4 mx-auto" style={ { width: "80%" } }>
                        <span className="input-group-text"><i className="bi bi-shield-lock" /></span>
                        <input id="login-password-input" type="password" className="form-control my-input" placeholder="Password" required />
                    </div>
                    <button type="submit" className="btn btn-danger btn-block gradient-custom-2 mx-auto d-block mt-5" style={ { border: "none", width: "80%" } }>Login</button>
                    <div className="d-flex align-items-center justify-content-center pb-3 mt-4">
                        <p className="mb-0 me-2">Don't have an account?</p>
                        <button type="button" className="btn btn-sm btn-outline-danger gradient-hover" onClick={()=>{document.getElementById("rk-task-des").style.left="0"}}>Create New</button>
                    </div>
                    <div className="d-flex align-items-center justify-content-center pb-3">
                        <p className="mb-0 me-2">Login without account?</p>
                        <button type="button" className="btn btn-outline-danger btn-sm gradient-hover" onClick={ ()=>{ cookieStore.set( "credentialId","guest" );window.location.reload(); } }>Guest Login</button>
                    </div>
                </form>
                <div className="container" id="error-message" style={ { position: "absolute",bottom: "10px" } }></div>
            </div>
            <div className="float-left w-50 h-100 bg-white d-flex justify-content-center align-items-center" id="register-page" style={ { position: "relative" } }>
                <form id="register-form">
                    <h2 className="mx-auto text-center mb-5" >Register Page</h2>
                    <div className="input-group mb-4 mx-auto" style={ { width: "80%" } }>
                        <span className="input-group-text"><i className="bi bi-person" /></span>
                        <input id="register-name-input" required type="text" className="form-control my-input" placeholder="Full Name"/>
                    </div>
                    <div className="input-group mb-4 mx-auto" style={ { width: "80%" } }>
                        <span className="input-group-text"><i className="bi bi-envelope" /></span>
                        <input id="register-email-input" required type="email" className="form-control my-input" placeholder="Email Address"/>
                    </div>
                    <div className="input-group mb-4 mx-auto" style={ { width: "80%" } }>
                        <span className="input-group-text"><i className="bi bi-shield-lock" /></span>
                        <input id="register-password-input" required type="password" className="form-control my-input" placeholder="Password" />
                    </div>
                    <button type="submit" className="btn btn-danger btn-block gradient-custom-2 mx-auto d-block mt-5" style={ { border: "none", width: "80%" } }>Register</button>
                    <div className="d-flex align-items-center justify-content-center pb-4 mt-4">
                        <p className="mb-0 me-2">Already have an account?</p>
                        <button type="button" className="btn btn-outline-danger gradient-hover" onClick={()=>{document.getElementById("rk-task-des").style.left="50%"}} >Login</button>
                    </div>
                </form>
                <div className="container" id="error-message2" style={ { position: "absolute",bottom: "10px" } }></div>
            </div>
            <div className="w-50 h-100 gradient-custom px-5 d-flex justify-content-center align-items-center" id="rk-task-des" >
                <div className="h-fit-content">
                    <h2>RK Tasks</h2>
                    <p>RK Tasks App is a kind of app that generally used to maintain our day-to-day tasks or list everything that we have to do. It is helpful in planning our daily schedules. We can add more tasks at any time and delete a task that is completed.</p>
                </div>
            </div>
            <style>{`
            body{
                background-color: #afafaf;
            }
            `}</style>
        </div>
    )
}

function TitleBar() {
    return (
        <nav>
            <div className="h3 text-center fw-normal" style={{ letterSpacing: "2px" }}>RK Tasks</div>
            <button onClick={ ()=>{ window.cookieStore.delete("credentialId");window.cookieStore.delete("name");window.location.reload(); } } type="button" className="btn btn-danger" style={ { position: "fixed", top : "12.5px" , right: "12.5px" } }>Logout</button>
        </nav>
    )
}

function TaskGroupLink({ taskGroup }) {
    return (
        <li className="nav-item">
            <a className="nav-link" href={"#" +"TG"+taskGroup.getId()} data-bs-toggle="tab">{taskGroup.getName()}</a>
        </li>
    )
}

function TaskUI( { task }) {
    const handleDelete=()=>{
        task.delete()
    }
    let clicked=false;
    const clickHandler=()=>{
        const ele=document.getElementById(task.getId())
        const eleBody=ele.getElementsByClassName("card-body")[0]
        const arrow=ele.getElementsByClassName("arrow_i")[0].style
        if(!clicked){
            ele.style.height="58px"
            ele.style.height=eleBody.clientHeight-5 +"px"
            arrow.transform="rotateX(180deg)"
            clicked=true;
        }
        else{
            ele.style.height="58px"
            arrow.transform="rotateX(0deg)"
            clicked=false;
        }
    }
    let status_bg = "";
    switch (task.getStatus()) {
        case "COMPLETED": status_bg = " bg-success";
            break;
        case "TODAY": status_bg = " bg-warning";
            break;
        case "MISSING": status_bg = " bg-danger";
            break;
        default: status_bg = "";
            break;
    }
    return (
        <div className={"card my-4 bg-opacity-25 task-card task-expanded" + (status_bg) } id={task.getId()}>
            <div className="card-body">
                <h4 className="card-title">{task.getName()}</h4>
                <div className="card-text">
                    {task.getDetail()}
                </div>
                <div className="mt-3 mb-1">
                    {( task.getDate() )? <button className="btn btn-light border rounded-pill me-2">{task.getDate()}</button>:<></>}
                    {( task.getTime() )? <button className="btn btn-light border rounded-pill ms-2">{task.getTime()}</button>:<></>}
                </div>
                <div className="d-flex justify-content-end task-button-group">
                    <div className="">
                        <button className={"btn btn-primary m-2"+ ( task.hasOnlyName() ? " d-none":"" ) } onClick={ clickHandler }><i className="bi bi-chevron-double-down d-block arrow_i" /></button>
                        <button className="btn btn-danger m-2" onClick={handleDelete}>Delete</button>
                        <button className={"btn m-2" + ((task.getStatus() === "COMPLETED") ? " disabled btn-outline-secondary cursor-default" : " btn-success")} onClick={ ()=> { task.completed() } } >Completed</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function TaskGroupPane({ taskGroup, active }) {
    return (
        <div className={"container py-2 tab-pane task_group_pane" + ((active) ? " active" : "")} id={"TG"+taskGroup.getId()}>
            { (taskGroup.getTaskList().length===0)? <><img alt="empty" src="../img/empty_img.jpg" className="empty_img" /><h3 className="empty_img_text">No Task</h3></>: <></> }
            { taskGroup.getTaskList().map( task => {
                let NewTaskUI= task.getTaskUI();
                return <NewTaskUI key={Math.random().toString()} />
            } )}
        </div>
    )
}

class Content extends React.Component {
    constructor() {
        super()
        this.state={}
        window.reRenderContent=()=>{this.setState({})};
    }
    handler() { // new taskGroup adder handler
        const new_list = document.getElementById("new_list")
        if (new_list.value.length <= 0) new_list.focus()
        else {
            const taskGroupName = new_list.value
            new_list.value = "";
            taskGroupManager.addTaskGroup({ name: taskGroupName }).then( taskGroup => {
                if(!taskGroup) return;
                this.setState({},()=>{
                    document.querySelector(".nav-link[href='#TG"+taskGroup.getId()+"']").addEventListener("click",()=>{
                        if(taskGroupManager.isDailyActive()) document.getElementById("cont_date_button").classList.add("d-none")
                        else document.getElementById("cont_date_button").classList.remove("d-none")
                    })
                    taskGroup.focus()
                })
            })
        }
    }
    render() {
        return (
            <>
                <ul className="nav nav-tabs" id="nav_ul">
                    {taskGroupManager.getList().map(taskGroup => <TaskGroupLink taskGroup={taskGroup} key={taskGroup.getId()} /> )}

                    <li className="nav-item" key={"daily"}>
                        <a className="nav-link active" href="#TGdaily" data-bs-toggle="tab">Daily</a>
                    </li>
                    <li className="nav-item" key={"newList"}>
                        <div className="nav-link text-secondary" href="#"><div id="hover_effect" onClick={()=> this.handler()} className="btn"><i className="bi bi-plus-square"></i></div><input id="new_list" autoComplete="off" onKeyUp={(event) => { if (event.keyCode === 13) this.handler() }} className="entry" type="text" placeholder="New List" style={{ all: "unset", width: "70px", marginLeft: "30px", color: "var(--bs-gray-700)" }} /></div>
                    </li>
                </ul>
                <div className="tab-content" id="tab_content">
                    {taskGroupManager.getList().map(taskGroup => (<TaskGroupPane taskGroup={taskGroup} key={taskGroup.getId()} />))}

                    <TaskGroupPane taskGroup={taskGroupManager.getDailyTaskGroup()} active />
                </div>
            </>
        )
    }
}

class DateTimeButtons extends React.Component{
    constructor(){
        super()
        this.state={
            date: false,
            time: false
        }
        window.reRenderDateTime=()=>{ this.setState({ date: false, time: false }) }
    }
    getRelativeTime(){
        let times=this.state.time.toLocaleTimeString().split(":")
        if (times[0]>=12) {
            if( times[0]!=12 ) times[0]=times[0]-12
            return times[0]+":"+times[1]+" PM"
        }
        else if(times[0]==0) return "12:"+times[1]+" AM"
        return times[0]+":"+times[1]+" AM"
    }
    inputChanged() {
        const hms = document.getElementById("time_input").value;
        let now = new Date();
        const date_sel = document.getElementById("date_input").value;
        const task_time = (hms !== "") ? new Date(now.getFullYear(), now.getMonth(), now.getDate(), ...hms.split(':')) : false;
        const task_date = (date_sel !== "") ? new Date(date_sel) : false;
        this.setState( {
            date: task_date,
            time: task_time
        } )
    }
    closeDateButton(){
        document.getElementById("date_input").value=""
        this.setState( {
            date: false,
            time: this.state.time
        } )
    }
    closeTimeButton(){
        document.getElementById("time_input").value=""
        this.setState( {
            date: this.state.date,
            time: false
        } )
    }
    render(){
        try{
            document.getElementById("date_input").addEventListener("input", ()=>{this.inputChanged() } )
            document.getElementById("time_input").addEventListener("input", ()=>{this.inputChanged() } )
        }catch(err){}
        return (
            <>
                <button className={"btn btn-sm btn-light rounded-pill me-4 text-primary b_w_c"+( (this.state.date )? "":" d-none" )}><div style={{float:"left"}} id="task_adder_date_button"> {(this.state.date )? this.state.date.toDateString():""} </div><input type="button" onClick={()=>this.closeDateButton()} className="btn-close btn-close-end" /> </button>
                <button className={"btn btn-sm btn-light rounded-pill me-4 text-primary b_w_c"+( (this.state.time )? "":" d-none" )}><div style={{float:"left"}} id="task_adder_time_button"> {(this.state.time )? this.getRelativeTime():""} </div><input type="button" onClick={()=>this.closeTimeButton()} className="btn-close btn-close-end" /> </button>
            </>
        )
    }
}

function ServerError2(){
    return (
        <div className="w-100 d-flex justify-content-center align-items-center" style={{height:"100vh"}}>
            <div className="container text-white w-75" style={{backgroundColor: "#121212",borderRadius:"10px"}}>
                <img src="img/error.jpg" className="d-block mx-auto mt-4" style={{height: "180px",width: "130px"}} />
                <h3 className="text-center">Sorry, Something went wrong</h3>
                <h4 className="text-center">Try Again Later</h4>
                <button className="btn btn-light d-block my-4 mx-auto" onClick={()=>{ window.location.reload() }}>Reload</button>
            </div>
        </div>
    )
}

function ServerError(){
    // return ( <ServerError2 /> );
    return (
        <div className="w-100 d-flex justify-content-center align-items-center" style={{height:"100vh"}}>
            <div className="container text-dark" style={{backgroundColor: "",borderRadius:"10px"}}>
                <img src="img/error2.jpg" className="d-block mx-auto mt-4" style={{height: "180px",width: "290px"}} />
                <h3 className="text-center mt-2">Sorry, Something went wrong</h3>
                <h4 className="text-center">Try Again Later</h4>
                <button className="btn btn-primary d-block my-4 mx-auto btn-focus-style" style={{backgroundColor: "rgb(108, 82, 190)",borderColor: "rgb(100, 80, 180)"}} onClick={()=>{ window.location.reload() }}>Reload</button>
            </div>
        </div>
    )
}

function FloatingButton() {
    const [clicked, setClicked] = React.useState(false)
    let isWorking = false;
    let handler
    function clear(){
        document.getElementById("task_name_input").value=""
        input_handler()
        document.getElementById("task_details").value=""
        document.getElementById("details_adder").classList.add("d-none")
        window.reRenderDateTime()
    }
    function hide() {
        const fb = document.getElementById("floating_button")
        const fib = document.getElementById("floating_inner_btn")
        fb.style.width = "50px";
        fb.style.height = "50px";
        fb.style.right = "20px";
        fb.style.bottom = "20px";
        // fb.style.backdropFilter="unset";
        fb.classList.toggle("bg-primary")
        fib.classList.toggle("btn-primary")
        fib.classList.toggle("btn-light")
        document.getElementById("task_adder_cont").classList.remove("show")
        document.getElementById("task_adder_cont").classList.add("fade")

        clear()
        document.getElementById("floating_button_i").style.transform="rotate(0deg)"
    }
    function show() {
        const fb = document.getElementById("floating_button")
        const fib = document.getElementById("floating_inner_btn")
        input_handler()
        fb.style.width = "calc(100vw - 20px)";
        fb.style.height = (window.innerHeight*0.40).toFixed(0)+"px";
        fb.style.right = "10px";
        fb.style.bottom = "10px";
        // fb.style.backdropFilter="blur(2px)";
        if(taskGroupManager.isDailyActive()) document.getElementById("cont_date_button").classList.add("d-none")
        else document.getElementById("cont_date_button").classList.remove("d-none")

        document.getElementById("task_adder_cont").classList.add("show")
        document.getElementById("task_adder_cont").classList.remove("fade")
        fb.classList.toggle("bg-primary")
        fib.classList.toggle("btn-primary")
        fib.classList.toggle("btn-light")
        document.getElementById("task_name_input").focus()
    }
    if (!clicked) handler = () => {
        show()
        setClicked(true)
    }
    else handler = () => {
        const taskNameInput = document.getElementById("task_name_input")

        if (isWorking) return;
        if (taskNameInput.value.length > 0) {
            document.getElementsByTagName("html")[0].classList.add("wait")
            isWorking = true;
            document.getElementsByTagName("html")[0].classList.remove("wait")
            isWorking = false;
            let taskObj={ name: taskNameInput.value }
            const task_detail=document.getElementById("task_details").value
            const task_date=document.getElementById("task_adder_date_button").innerText.trim()
            const task_time=document.getElementById("task_adder_time_button").innerText.trim().split(" ")[0]
            if(task_detail.length>0) taskObj.detail=task_detail
            if(task_date.length>0) taskObj.date=task_date
            const now = new Date()
            if(task_time.length>0){
                window.dt = new Date(now.getFullYear(), now.getMonth(), now.getDate(), ...task_time.split(':'));
                taskObj.time= dt.toString();
            }
            taskGroupManager.getActiveTaskGroup().addTask(taskObj)
            hide()
            setClicked(false)
        }
        else {
            hide()
            setClicked(false)
        }
    }
    const enterHandler=()=>{
        if (document.getElementById("details_adder").classList.contains("d-none")) handler();
        else {document.getElementById("task_details").focus()}
    }
    const input_handler=()=> { document.getElementById("floating_button_i").style.transform= (document.getElementById("task_name_input") .value.length>0 ? "rotate(0deg)": "rotate(45deg)") }
    
    React.useEffect(()=>{
        const arr=document.getElementsByClassName("nav-link");
        for(let i=0;i<arr.length-1;i++){
            arr[i].addEventListener("click",()=>{
                if(taskGroupManager.isDailyActive()) document.getElementById("cont_date_button").classList.add("d-none")
                else document.getElementById("cont_date_button").classList.remove("d-none")
            })
        }
    }, [] )
    
    return (
        <div id="floating_button" className="border">
            <div id="task_adder_cont" className="container-fluid text-light">
                <div><i className="bi bi-bookmark-check-fill fs-5 me-2"></i> <input id="task_name_input" autoComplete="off" placeholder="New task" onKeyUp={(event) => { if (event.keyCode === 13) enterHandler() } } onInput={ input_handler } /></div>
                <div className="mt-3 d-none" id="details_adder"><i className="bi bi-justify-left fs-4 me-2"></i><input id="task_details" onKeyUp={(event) => { if (event.keyCode === 13) handler(); } } autoComplete="off" type="textarea" placeholder="Add Details" /></div>
                <div className="mt-3" id="date_time_cont">
                    <DateTimeButtons />
                </div>
                <div id="task_option_adder">
                    <button onClick={()=>{ document.getElementById("details_adder").classList.remove("d-none") }}><i className="bi bi-justify-left"></i></button>
                    <button id="cont_date_button" ><i className="bi bi-calendar-check"></i><input type="date" id="date_input" style={{all:"unset",position: "absolute"}} /></button>
                    <button><i className="bi bi-clock-history"></i><input type="time" id="time_input" /></button>
                    <button onClick={ clear }><i className="bi bi-trash"></i></button>
                </div>
            </div>
            <button type="submit" id="floating_inner_btn" onClick={handler} className="btn btn-primary btn-shadow rounded-pill d-flex justify-content-center align-items-center"><i className="bi bi-plus-lg fs-4" id="floating_button_i"> </i></button>
        </div>
    )
}