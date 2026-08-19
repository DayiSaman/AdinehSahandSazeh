const express = require("express");
const cors = require("cors");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();


const app = express();


app.use(cors());
app.use(express.json());



const USERS_FILE="./users.json";

const SECRET="adineh_secret_key";





function getUsers(){

    if(!fs.existsSync(USERS_FILE)){

        fs.writeFileSync(
            USERS_FILE,
            "[]"
        );

    }


    return JSON.parse(
        fs.readFileSync(
            USERS_FILE,
            "utf8"
        )
    );

}




function saveUsers(users){

    fs.writeFileSync(
        USERS_FILE,
        JSON.stringify(
            users,
            null,
            4
        )
    );

}







// ================= REGISTER =================


app.post("/register", async(req,res)=>{


const {

firstname,
lastname,
username,
phone,
password,
confirmPassword

}=req.body;





if(
!firstname ||
!lastname ||
!username ||
!phone ||
!password ||
!confirmPassword
){

return res.json({

success:false,

message:"همه فیلدها الزامی هستند"

});

}






// فقط فارسی برای نام


const persianRule =
/^[\u0600-\u06FF\s]+$/;



if(
!persianRule.test(firstname) ||
!persianRule.test(lastname)
){

return res.json({

success:false,

message:"نام و نام خانوادگی فقط باید فارسی باشد"

});

}






// شماره موبایل


if(
!/^09\d{9}$/.test(phone)
){

return res.json({

success:false,

message:"شماره موبایل صحیح نیست"

});

}







// username فقط انگلیسی


const usernameRule =
/^[a-zA-Z0-9_]{4,20}$/;



if(
!usernameRule.test(username)
){

return res.json({

success:false,

message:
"نام کاربری فقط انگلیسی، عدد و _ باشد"

});

}







// تکرار رمز


if(
password !== confirmPassword
){

return res.json({

success:false,

message:"رمز عبور یکسان نیست"

});

}






// رمز فقط انگلیسی


const passwordRule =
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]{8,}$/;





if(
!passwordRule.test(password)
){

return res.json({

success:false,

message:
"رمز باید حداقل ۸ کاراکتر، حروف بزرگ و کوچک انگلیسی، عدد و علامت داشته باشد"

});

}







let users=getUsers();



let finalUsername="@"+username;





const exists =
users.find(
u =>
u.username===finalUsername ||
u.phone===phone
);





if(exists){

return res.json({

success:false,

message:
"نام کاربری یا شماره موبایل قبلا ثبت شده"

});

}







const hashedPassword =
await bcrypt.hash(password,10);






const user={


id:Date.now(),


firstname,


lastname,


username:finalUsername,


phone,


password:hashedPassword,


createdAt:new Date().toISOString()


};






users.push(user);


saveUsers(users);





res.json({

success:true,

message:"ثبت نام موفق بود"

});



});









// ================= LOGIN =================



app.post("/login",async(req,res)=>{


const {

username,

password

}=req.body;





let users=getUsers();





let cleanUsername =
username.replace("@","");





let user =
users.find(
u=>u.username==="@"+cleanUsername
);





if(!user){

return res.json({

success:false,

message:"کاربر پیدا نشد"

});

}







const ok =
await bcrypt.compare(
password,
user.password
);





if(!ok){

return res.json({

success:false,

message:"رمز اشتباه است"

});

}






const token =
jwt.sign(

{

id:user.id,

username:user.username

},

SECRET,

{

expiresIn:"7d"

}

);







res.json({

success:true,

token,

user:{

id:user.id,

firstname:user.firstname,

lastname:user.lastname,

username:user.username,

phone:user.phone,

createdAt:user.createdAt

}

});



});



app.get("/users",(req,res)=>{


res.json(
getUsers()
);


});


// آخر فایل

app.listen(
5000,
()=>{
console.log(
"Server running on port 5000"
);
});
