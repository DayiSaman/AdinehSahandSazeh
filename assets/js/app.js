/* =================================
   Adineh Sahand Sazeh
   Main Application JS
================================= */


/* ===============================
   DOM READY
================================ */

document.addEventListener("DOMContentLoaded", () => {


    console.log(
        "Adineh Sahand Sazeh Website Loaded"
    );


    createNavbar();


    initSmoothScroll();


    initRevealAnimation();


    initConsultForm();


});







/* ===============================
   NAVBAR
================================ */


function createNavbar(){


    const header =
    document.querySelector("#header");


    if(!header)
        return;



    header.innerHTML = `

    <div class="container navbar">


        <div class="logo">

            آدینه

            <span>
                سهند سازه
            </span>

        </div>




        <nav>


            <a href="#header">
                خانه
            </a>


            <a href="#products">
             محصولات
             </a>


            <a href="#projects">
                پروژه‌ها
            </a>


            <a href="#about">
                درباره ما
            </a>


            <a href="#contact">
                تماس
            </a>


        </nav>




        <<a
        href="pages/login.html"
        class="btn primary">

        ورود / ثبت‌نام

</a>



    </div>

    `;


}









/* ===============================
   SMOOTH SCROLL
================================ */


function initSmoothScroll(){


    const links =
    document.querySelectorAll(
        'a[href^="#"]'
    );



    links.forEach(link=>{


        link.addEventListener(
            "click",
            function(e){



                const target =
                document.querySelector(
                    this.getAttribute("href")
                );



                if(target){


                    e.preventDefault();



                    target.scrollIntoView({

                        behavior:"smooth",

                        block:"start"

                    });


                }


            }
        );


    });


}









/* ===============================
   SECTION REVEAL ANIMATION
================================ */


function initRevealAnimation(){


    const sections =
    document.querySelectorAll(
        "section"
    );



    sections.forEach(section=>{


        section.style.opacity="0";


        section.style.transform =
        "translateY(40px)";


        section.style.transition =
        "all .7s ease";


    });





    const observer =
    new IntersectionObserver(
        entries=>{


            entries.forEach(entry=>{


                if(entry.isIntersecting){


                    entry.target.style.opacity="1";


                    entry.target.style.transform =
                    "translateY(0)";


                }


            });


        },
        {

            threshold:.15

        }
    );





    sections.forEach(section=>{


        observer.observe(section);


    });



}









/* ===============================
   CONSULT FORM
================================ */


function initConsultForm(){


    const form =
    document.querySelector(
        "#consult form"
    );



    if(!form)
        return;





    form.addEventListener(
        "submit",
        function(e){


            e.preventDefault();




            const inputs =
            form.querySelectorAll(
                "input"
            );




            let empty=false;




            inputs.forEach(input=>{


                if(
                    input.value.trim()===""
                ){

                    empty=true;

                }


            });






            if(empty){


                showMessage(
                    "لطفاً همه فیلدها را کامل کنید",
                    "error"
                );


                return;

            }





            const data = {


                name:
                inputs[0].value,


                phone:
                inputs[1].value,


                area:
                inputs[2].value


            };






            console.log(
                "Consult Request:",
                data
            );






            showMessage(
                "درخواست شما ثبت شد. کارشناسان ما تماس می‌گیرند.",
                "success"
            );





            form.reset();



        }

    );


}









/* ===============================
   MESSAGE SYSTEM
================================ */


function showMessage(text,type){


    const box =
    document.createElement(
        "div"
    );



    box.innerText = text;



    box.className =
    "site-message " + type;





    document.body.appendChild(box);






    setTimeout(()=>{


        box.classList.add(
            "show"
        );


    },50);






    setTimeout(()=>{


        box.classList.remove(
            "show"
        );



        setTimeout(()=>{


            box.remove();


        },300);



    },3500);



}