console.log("hi")

let newpass=document.getElementById("newpass")
let confirm=document.getElementById("confirm")
const btn=document.querySelector(".btn")
const errorThrow= document.querySelector(".error")        

function myfunc(){
    btn.disabled=true;
    errorThrow.innerHTML=""
    if(newpass.value == confirm.value){
        btn.disabled=false;
        errorThrow.innerHTML=""
    }else{
        errorThrow.innerHTML="both are not same"
    }
}