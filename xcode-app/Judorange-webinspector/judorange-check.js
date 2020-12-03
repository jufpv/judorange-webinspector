window.onerror = function(error) {
    
    error_str = error.toString().toLowerCase();
    
    if( error_str.includes("eruda") ){
        alert("⚠️ Web Inspector Error ⚠️\n\nInspector can't be load due to Content-Security-Policy response headers sent by the server");
    }
    
};
