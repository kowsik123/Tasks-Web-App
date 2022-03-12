$.ajaxSetup({
    url: "api",
    method: "post",
    error: ()=>{ ReactDOM.render(<ServerError />, document.getElementById('root') ) }
});

let isGuest = false;
let taskGroupManager = false;
if( document.cookie.includes( "credentialId" ) ) {
    const credentialId = document.cookie.substr( document.cookie.indexOf( "credentialId" )+13 , 5)
    if ( credentialId==="guest" ) isGuest=true;
    taskGroupManager = new TaskGroupManager()
    ReactDOM.render(<App />, document.getElementById('root'))
}
else ReactDOM.render( <Login /> , document.getElementById('root') )

function App() {
    console.log("app rendered");
    return (
        <>
            <TitleBar />
            <Content />
            <FloatingButton />
        </>
    )
}