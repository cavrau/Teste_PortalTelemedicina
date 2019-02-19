/*jshint esversion: 6 */ 
// this function deletesan registered product
function deleteItem(name) {
    if(confirm("Do you really want to delete the product : "+name)){
        localStorage.removeItem(name);
        createTable();
        productList();
    }

}

// this function formats a number t be a valid float
function formatNumber(price){
    let number = price.split(",",2);
    price = number[0]+"."+number[1];
    price = price.trim();
    price = parseFloat(price);
    return price;
}

// this function returns a list with all the products
function searchProducts(){
    let list =[];
    for (let  i= 0; i < localStorage.length; i++) {
        let name = localStorage.key(i);
        let item = localStorage.getItem(name);
        if(item!=null){

            let p = JSON.parse(item);
            if(p.type == "p"){
                list.push(p);
            }
        }
    }
    return list;
}

// this function returns a list with the wanted orders
function searchOrders(selector){
    let list =[];
    for (let  i= 0; i < localStorage.length; i++) {
        let name = localStorage.key(i);
        let item = localStorage.getItem(name);
        if(item!=null){
            let p = JSON.parse(item);
            if(p.type == "o"){
                if(selector===null||selector===undefined){
                    list.push(p);
                }else{
                    if (p.tPrice>=selector.minPrice) {
                        if (selector.maxPrice===null) {
                            if(selector.minDate===null){
                                if (selector.maxDate===null) {
                                    list.push(p);
                                }else{
                                    if (Date.parse(p.date).valueOf()<selector.maxDate) {
                                        list.push(p);
                                    }
                                }
                            }else{
                                if (selector.minDate<Date.parse(p.date).valueOf()) {
                                    if (selector.maxDate===null) {
                                        list.push(p);
                                    }else{
                                        if (Date.parse(p.date).valueOf()<selector.maxDate) {
                                            list.push(p);
                                        }
                                    }
                                }
                            }
                        }else if(p.tPrice<=selector.maxPrice){
                            if(selector.minDate===null){
                                if (selector.maxDate===null) {
                                    list.push(p);
                                }else{
                                    if (Date.parse(p.date).valueOf()<selector.maxDate) {
                                        list.push(p);
                                    }
                                }
                            }else{
                                if (selector.minDate<Date.parse(p.date).valueOf()) {
                                    if (selector.maxDate===null) {
                                        list.push(p);
                                    }else{
                                        if (Date.parse(p.date).valueOf()<selector.maxDate) {
                                            list.push(p);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } 
    }
    return list;
}

// this function creates a new table with products registered
function createTable() {
    let table = document.getElementById("productBody");
    let list= searchProducts();
    
    let html = "";
    if(list.length > 0){
        for (let i = 0; i < list.length; i++) {
            html+= "<tr><th scope='row'>"+list[i].name+"</th>"+
            "<td>"+list[i].price+"</td>"+
            "<td><button type='button' class='btn btn-info' data-toggle='modal' data-target='#update_modal' onclick='updateModal(\""+list[i].name+"\")'>Update</button></td>"+
            "<td><button type='button' class='btn btn-danger' onclick='deleteItem(\""+list[i].name+"\")'>Delete</button></td>"+   
            "</tr>";
        }
    }else{
        html += "<tr><th colspan='4' scope='row'style='width:100%'><h4>No products registered yet!!</h4></th></tr>";
    }
    table.innerHTML=html;
}

// This function updates the modal with the updated object info
function updateModal(name) {
    let list = searchProducts();
    let obj;
    for (let i = 0; i < list.length; i++) {
        if(name=== list[i].name){
            obj = list[i];
        }
    }
    document.getElementById("hd_name").value = obj.name; 
    document.getElementById("txt_up_name").value = obj.name;
    document.getElementById("txt_up_price").value = obj.price;
}

function recreateProduct(){
    let old_name = document.getElementById("hd_name").value;
    let name =  document.getElementById("txt_up_name").value;
    let price = document.getElementById("txt_up_price").value;
    fprice = formatNumber(price);
    if(productValidation(name,fprice)){
        localStorage.removeItem(old_name);
        let p = {
            type:"p",
            name:name,
            price:fprice
        };
        localStorage.setItem(p.name,JSON.stringify(p));
        alert("Product updated");
        createTable();
        productList();
    }
}

// this function creates a new table with orders registered
function createTableOrders(selector) {
    let table = document.getElementById("OrdersBody");
    let list= searchOrders(selector);
    let html = "";
    if(list.length > 0){
        for (let i = 0; i < list.length; i++) {
            html+= "<tr><td scope='row'>"+list[i].product+"</td>"+
            "<td>"+list[i].quantity+"</td>"+
            "<td>"+list[i].uPrice+"</td>"+
            "<td>"+list[i].tPrice+"</td>"+
            "<td>"+list[i].day+"/"+list[i].month+"/"+list[i].year+"</td>"+   
            "</tr>";
        }
    }else{
        html += "<tr><td colspan='5' style='width:100%'><h3>No orders found</h3></td></tr>";
    }
    table.innerHTML=html;
} 


// This function creates the list of products to be selected at an order
function productList(){
    let dl = document.getElementById("dlProducts");
    let list = searchProducts();
    let html = "";
    if(list.length > 0){
        for (let i = 0; i < list.length; i++) {
            html+= "<option value='"+list[i].name+"'>";
        }
    }else{
        html += "<option value='No products registred yet'>";
    }
    dl.innerHTML=html;
    
    
}
productList();

// this function creates and stores a new project
function createProduct(){
    let name = document.getElementById("txt_Pname");
    name.value = name.value.trim();
    let price = document.getElementById("txt_Pprice");
    price.value = formatNumber(price.value);
    
    if(productValidation(name.value,price.value)){
        let p = {
            type:"p",
            name:name.value,
            price:price.value
        };
        
        localStorage.setItem(p.name,JSON.stringify(p));
        name.value = "";
        price.value = "";
        alert("Product registered");
        createTable();
        productList();
    }
}

//this function validates if the product being registered has all it's infos right
function productValidation(name,price) {
    if(name.length!==0){
        if(isNaN(name)){
            if(price.length!==0){
                if(!isNaN(price)){
                    return true;
                }else{
                    alert("Insert a valid price to the product");
                }
            }else{
                alert("Insert a price to the product");
            }
        }else{
            alert("Insert a valid name to the product, the name can not be a number");
        }
    }else{
        alert("Insert a name to the product");
    }
    return false;
    
}


// This function creates an order object and stores it on the local storage
function createOrder(){
    
    let product = document.getElementById("listProducts").value;
    let qnt = document.getElementById("txt_Oquantity").value;
    let list =searchProducts();
    let boo= false;
    for (let i = 0; i < list.length; i++) {
        if(product===list[i].name){
            product = list[i];
            boo=true;
        }  
    }
    if(boo){
        if(qnt % 1 === 0){
            qnt = parseInt(qnt);
            let d = new Date();
            if(parseInt(d.getMonth())+1<10){
                month = "0"+parseInt(d.getMonth()+1);
            }else{
                month = d.getMonth()+1;
            }
            if (d.getDate()<10) {
                day="0"+d.getDate();
            }else{
                day=d.getDate();
            }
            let o = {
                type:"o",
                product : product.name,
                quantity: qnt,
                uPrice: product.price,
                tPrice: product.price*qnt,
                date: d,
                day:day,
                month:month,
                year:d.getFullYear()
            };
            localStorage.setItem(localStorage.length-list.length+1,JSON.stringify(o));
            document.getElementById("listProducts").value="";
            document.getElementById("txt_Oquantity").value="";
            search();
            alert("Order registered");
        }else{
            alert("Insert a valid Integer");
        }
        
    }else{
        alert("Item does not exist");
    }
}

// This function limitates the orders search
function search(){
    
    let minPrice = document.getElementById('txt_MinPrice').value;
    let maxPrice = document.getElementById('txt_MaxPrice').value;
    let minDate = document.getElementById('dt_MinDate').value;
    let maxDate = document.getElementById('dt_MaxDate').value;
    if(minPrice===null || minPrice==="" || isNaN(minPrice)){
        minPrice = 0;
    }
    if(maxPrice===""||isNaN(maxPrice)){
        maxPrice = null;
    }
    let sminDate = minDate.split("-");
    if(parseInt(sminDate[0])<1970){
        minDate = null;
    }
    let smaxDate = maxDate.split("-");
    if(parseInt(smaxDate[0])<1970){
        maxDate = null;
    }
    
    let dminDate = new Date(minDate+" 00:00:00");
    
    let dmaxDate = new Date(maxDate+" 23:59:59");
    
    if(dmaxDate.valueOf()<dminDate.valueOf()){
        dminDate=null;
        dmaxDate=null;
    }
    let fminDate = parseInt(dminDate.valueOf());
    if(isNaN(fminDate)){
        fminDate=null;
    }
    let fmaxDate = parseInt(dmaxDate.valueOf());
    if(isNaN(fmaxDate)){
        fmaxDate=null;
    }
    let searcher = {
        minPrice : minPrice,
        maxPrice : maxPrice,
        minDate : fminDate,
        maxDate : fmaxDate
    };
    createTableOrders(searcher);
}
search();
createTable();