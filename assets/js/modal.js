/* =================================
   Adineh Sahand Sazeh
   Product Modal System
================================= */



let currentProduct = null;



function openProduct(id){


    fetch("data/products.json")

    .then(response => response.json())

    .then(products => {


        currentProduct =
        products.find(
            product => product.id === id
        );



        if(!currentProduct)
            return;



        createProductModal();



    })

    .catch(error=>{


        console.error(
            "Modal Error:",
            error
        );


    });


}







function createProductModal(){


    const oldModal =
    document.querySelector(
        ".product-modal"
    );


    if(oldModal)
        oldModal.remove();




    const modal =
    document.createElement(
        "div"
    );



    modal.className =
    "product-modal";



    modal.innerHTML = `


        <div class="modal-box">


            <button class="close-modal">

                ×

            </button>



            <h2>

                ${currentProduct.name}

            </h2>



            <p>

                ${currentProduct.description}

            </p>



            <div class="modal-info">


                <div>

                    <strong>
                    ابعاد:
                    </strong>

                    ${currentProduct.size}

                </div>



                <div>

                    <strong>
                    جنس:
                    </strong>

                    ${currentProduct.material}

                </div>



            </div>





            <button class="btn primary">

                درخواست خرید و مشاوره

            </button>



        </div>


    `;




    document.body.appendChild(modal);





    setTimeout(()=>{


        modal.classList.add(
            "active"
        );


    },50);







    modal
    .querySelector(
        ".close-modal"
    )
    .onclick=function(){


        closeModal();


    };



    modal.onclick=function(e){


        if(e.target===modal){

            closeModal();

        }


    };


}








function closeModal(){


    const modal =
    document.querySelector(
        ".product-modal"
    );


    if(!modal)
        return;



    modal.classList.remove(
        "active"
    );



    setTimeout(()=>{


        modal.remove();


    },300);


}