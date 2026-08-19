async function login(){


let username =
document.getElementById("loginUsername")
.value
.trim();



let password =
document.getElementById("loginPassword")
.value;



if(!username || !password){

alert("اطلاعات را کامل کنید");
return;

}




username =
username.replace("@","");



let res =
await fetch(
"http://localhost:5000/login",
{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

username,
password

})

});



let data =
await res.json();



if(data.success){


localStorage.setItem(
"token",
data.token
);


localStorage.setItem(
"user",
JSON.stringify(data.user)
);



window.location.href="profile.html";


}
else{


alert(data.message);


}


}