function onlyPersian(input){

input.value =
input.value.replace(
/[^\u0600-\u06FF\s]/g,
""
);

}







async function register(){


let firstname =
document.getElementById("firstname")
.value.trim();



let lastname =
document.getElementById("lastname")
.value.trim();



let username =
document.getElementById("username")
.value.trim();



let phone =
document.getElementById("phone")
.value.trim();



let password =
document.getElementById("password")
.value;



let confirmPassword =
document.getElementById("confirmPassword")
.value;






if(
!firstname ||
!lastname ||
!username ||
!phone ||
!password ||
!confirmPassword
){

alert("همه فیلدها را پر کنید");

return;

}






// جلوگیری از username فارسی


if(
!/^[a-zA-Z0-9_]{4,20}$/.test(username)
){

alert(
"نام کاربری فقط انگلیسی، عدد و _ باشد"
);

return;

}







// جلوگیری از رمز فارسی


if(
/[^\x00-\x7F]/.test(password)
){

alert(
"رمز عبور فقط باید انگلیسی باشد"
);

return;

}






if(
password !== confirmPassword
){

alert(
"رمزها یکسان نیستند"
);

return;

}







if(
!/^09\d{9}$/.test(phone)
){

alert(
"شماره موبایل صحیح نیست"
);

return;

}








let res =
await fetch(
"http://localhost:5000/register",
{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

firstname,

lastname,

username,

phone,

password,

confirmPassword

})

});







let data =
await res.json();






if(data.success){


alert(
"ثبت نام موفق بود"
);



window.location.href=
"login.html";


}
else{


alert(data.message);


}



}