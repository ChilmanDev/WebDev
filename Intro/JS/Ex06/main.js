class Car{
    constructor(jsonData){
        this.id = jsonData.id;
        this.name = jsonData.name;
        this.img_path = jsonData.img_path;
        this.rating = jsonData.rating;
        this.price = jsonData.price;
        this.brand = jsonData.brand;
    }
}

const jsonData = [
    {
        "id": 1,
        "name": "A5",
        "brand": "Audi",
        "img_path": "./imgs/audi_a5.png",
        "rating": 2,
        "price": 45000
    },
    {
        "id": 26,
        "name": "Challenger",
        "brand": "Dodge",
        "img_path": "./imgs/dodge_challenger.png",
        "rating": 5,
        "price": 33000
    },
    {
        "id": 42,
        "name": "Veneno",
        "brand": "Lamborghini",
        "img_path": "./imgs/lamborghini_veneno.png",
        "rating": 5,
        "price": 4000000
    },
    {
        "id": 420,
        "name": "Model S",
        "brand": "Tesla",
        "img_path": "./imgs/tesla_modelS.png",
        "rating": 4,
        "price": 135000
    }
];
const dataJSON = JSON.stringify(jsonData);
const dataStr = JSON.parse(dataJSON);
const allCarsArray = [];
let filteredCarsArray = [];
const sortElement = document.querySelector('[data-sort]');
const filterElement = document.querySelector('[data-filter]');
const carsListElement = document.querySelector('[data-cars-list-container]');


dataStr.forEach(carData => {
    let carInstance = new Car(carData); 
    allCarsArray.push(carInstance);
})

window.onload = function() {
    updateList();
}

sortElement.addEventListener('change', () => {
    updateList();
})

filterElement.addEventListener('input', () => {
    updateList();
})

function updateList() {
    while (carsListElement.firstChild){
        carsListElement.removeChild(carsListElement.firstChild);
    }

    allCarsArray.sort(getSortOder(sortElement.value));
    
    if(filterElement.value != '')
    {
        console.log(filterElement.value);

        filteredCarsArray = allCarsArray.filter(function(itm){
            return (itm.name.toLowerCase().includes(filterElement.value.toLowerCase()));
        });
    }
    else
        filteredCarsArray = allCarsArray;

    filteredCarsArray.sort(getSortOder(sortElement.value));

    filteredCarsArray.forEach(car =>{
        let carDiv = document.createElement("div");
        carDiv.classList.add("car");
        carsListElement.append(carDiv);
        
        let img = document.createElement("img");
        img.classList.add("car-img");
        img.src = car.img_path;
        carDiv.append(img);

        let contentDiv = document.createElement("div");
        contentDiv.classList.add("content");
        carDiv.append(contentDiv);

        let nameDiv = document.createElement("div");
        nameDiv.classList.add("name");
        nameDiv.innerText = car.name;
        contentDiv.append(nameDiv);

        let brandDiv = document.createElement("div");
        brandDiv.classList.add("brand");
        brandDiv.innerText = car.brand;
        contentDiv.append(brandDiv);

        let priceDiv = document.createElement("div");
        priceDiv.classList.add("price");
        priceDiv.innerText = "$" + car.price;
        contentDiv.append(priceDiv);

        let ratingDiv = document.createElement("div");
        ratingDiv.classList.add("rating");
        let txt = '';
        for(let i = 0; i < car.rating; i++){
            txt = txt + "★";
        }
        for(let i = car.rating; i < 5; i++){
            txt = txt + '☆';
        }

        ratingDiv.innerText = txt;
        contentDiv.append(ratingDiv); 
    })
}

function getSortOder(sort){
    return function(a, b) {    
        if (a[sort] > b[sort]) {    
            return 1;    
        } else if (a[sort] < b[sort]) {    
            return -1;    
        }    
        return 0;    
    }   
}