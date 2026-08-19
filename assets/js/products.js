/* =================================
   Adineh Sahand Sazeh
   Products System
================================= */


document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadProducts();

    }
);





async function loadProducts(){


    const container =
    document.querySelector(
        ".product-grid"
    );


    if(!container)
        return;



    try{


        const response =
        await fetch(
            "data/products.json"
        );



        const products =
        await response.json();



        container.innerHTML="";



        products.forEach(product=>{


            const card =
            document.createElement(
                "div"
            );



            card.className =
            "product-card";



            card.innerHTML = `

                <h3>
                    ${product.name}
                </h3>


                <p>
                    ${product.description}
                </p>


                <div class="product-info">

                    <span>
                    ابعاد:
                    ${product.size}
                    </span>


                    <span>
                    جنس:
                    ${product.material}
                    </span>

                </div>


                <button onclick="openProduct(${product.id})">

                    مشاهده جزئیات

                </button>


            `;



            container.appendChild(card);



        });



    }

    catch(error){


        console.error(
            "Products loading error:",
            error
        );


    }


}






function openProduct(id){


    console.log(
        "Product ID:",
        id
    );


    alert(
        "جزئیات محصول شماره " + id
    );


}