function doAjax(data,success){
    return $.ajax({
        data: data,
        success: (success)? (res)=>{ success( JSON.parse(res) ) } : undefined
    });
}