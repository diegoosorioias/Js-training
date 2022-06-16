const products = [
    {
      productId: 1,
      name: "headphones",
      category: 1,
      price: 100,
    },
    {
      productId: 2,
      name: "Shoes Nike",
      category: 2,
      price: 300,
    },
    {
      productId: 3,
      name: "hamburger",
      category: 3,
      price: 10,
    },
    {
      productId: 4,
      name: "Fries",
      category: 3,
      price: 5,
    },
    {
      productId: 5,
      name: "Sandwich",
      category: 3,
      price: 10,
    },
    {
      productId: 6,
      name: "laptop",
      category: 1,
      price: 100,
    },
    {
      productId: 7,
      name: "keyboard",
      category: 1,
      price: 50,
    },
    {
      productId: 8,
      name: "t-shirt",
      category: 2,
      price: 16,
    },
];
  
const categories = [
    { id: 1, name: "Electronic" },
    { id: 2, name: "Clothes" },
    { id: 3, name: "Food" }
];
  
export const discountsHolyDays = [
    { category: 1, discountApply: true, value: 10 },
    { category: 2, discountApply: false, value: 0 },
    { category: 3, discountApply: true, value: 30 },
];

const newProducts = [
    {
        id: 9,
        name: 'Tucson',
        typeOfProcuct: 'Car',
        discount: 10,
    },     {
        id: 10,
        name: 'Jeep',
        typeOfProcuct: 'Car',
        discount: 10,
    },  {
        id: 10,
        name: 'Screen',
        typeOfProcuct: 'Electronic'
    },{
        id: 1,
        name: 'Mouse',
        typeOfProcuct: 'Electronic'
    }
];
  

interface Product{
    productId:  number,
    name:       string,
    category:   number,
    price:      number,
}

interface averageByCategorie{
    category:  string,
    average:   number
}

interface ProductPriceMore{
    categoryName:   string,
    nameProduct:    string,
    price:          number
}

interface ProductDiscount{
    productId:      number,
    name:           string,
    category:       string,
    discount:       number,
    applyDiscount:  boolean

}

interface ProductIdAndDiscount{
    productId:          number,
    priceWithDiscount:  number
}

interface ProductNew{
    id:                 number,
    name:               string,
    typeOfProcuct:      string,
    discount?:           number
}

const callBackReduceByCategoria = (acc,el)=>{
    let cat = el.category;
    acc[cat] = acc[cat] || [];
    acc[cat].push(el);
    return acc;
}

const getCategoriesByGroup = (gropProducts) =>{
    return Object.keys(gropProducts);
}

const getNameCategory = (id:number):string =>{
    const category= categories.find(cat=> cat.id == id);
    return  category ? category.name : '';
}

const getProductsByCaategorie = (gropProducts:Product[],idCategorie) =>{
    return Object.values(gropProducts[idCategorie]);
}

//¿Cuál es el promedio de valor de cada tipo de producto?
function calculateAverage():averageByCategorie[]{
    const grupByCategories = products.reduce(callBackReduceByCategoria,{});
    const categories = getCategoriesByGroup(grupByCategories);
    const gruopProdsAveragePrice:averageByCategorie[] = categories.map((cat:any)=>{
        const products:Product[] = getProductsByCaategorie(grupByCategories,cat);
        const sumPrices:number = products.reduce((acc,el)=> acc+= el.price,0);
        return {category:getNameCategory(cat),average:Math.round(sumPrices/products.length)};
    })
    return gruopProdsAveragePrice;
}

//¿Cuál es el producto más costoso de cada categoria?
function costHigherByCategory():ProductPriceMore[]{
    const grupByCategories = products.reduce(callBackReduceByCategoria,{});
    const categories = getCategoriesByGroup(grupByCategories);
    const groupProducts = categories.map(cat=>{
        let objMax:ProductPriceMore = {categoryName:'',nameProduct:'',price:0}
        const products:Product[] = getProductsByCaategorie(grupByCategories,cat);
        products.forEach(el =>{
            if(el.price > objMax.price){
                objMax.categoryName=getNameCategory(parseInt(cat));
                objMax.price=el.price;
                objMax.nameProduct=el.name;
            }
        })
        return objMax
    })

    return groupProducts
}

//¿Existe algún producto de tipo Electronico que cueste $100?
function existProductByCategoryAndPrice(category:number,price=0):boolean{
    return !!products.filter(filt=> filt.category == category && filt.price == price);
}

//Obtener todos los productos que en nombre tengan las letra S.
function getProductscontainCharacter(character:string):Product[]{
    return character ? products.filter(filt=>filt.name.toLowerCase().includes(character.toLowerCase())) : [];
}

// Crear un arreglo de objetos con la siguiente información: 
//{ productId: 7 ,nameProduct: 'keyboard', category: 'Electronic', discount: '10', applyDiscount: true}
function constructArrayObjProds ():ProductDiscount[]{
    const productsByDiscount = [...products.map(prod=>{
        const category = categories.filter(filt => filt.id == prod.category)[0];
        const discountsProd = discountsHolyDays.filter(filt => filt.category == prod.category)[0];
        let discount = discountsProd.value || 0, applyDiscount = discountsProd.discountApply || false ;
        const {price,...deletePrice} = prod;
        const prodNew:ProductDiscount = {...deletePrice,category:category.name,discount,applyDiscount};
        return prodNew;
    })]
    return productsByDiscount;
} 

//Crear un arreglo de objetos con la siguiente información: { productId: 7, priceWithDiscount: 45}
function construcProdIdDiscount ():ProductIdAndDiscount[]{
    const productsByDiscount = [...products.map(prod=>{
        const discountsProd = discountsHolyDays.filter(filt => filt.category == prod.category)[0];
        let priceWithDiscount = discountsProd.value > 0 ? prod.price - ((prod.price * discountsProd.value) / 100) : prod.price;
        const {name,category,price,...productUpdate} = prod;
        const prodNew:ProductIdAndDiscount = {...productUpdate,priceWithDiscount};
        return prodNew;
    })]
    return productsByDiscount;
} 

//Agregar los siguientes productos, y crear un arreglo con el resultado
//ejemplo: [{id: 9, status: 'succes', id:10: status: 'error': message: 'error message'}];
// errors: duplicated key
function addProducts():void{
    let errorProds:any  = [];
    let succesProds:any = [];
    const arrTransformProds:ProductNew[] = [...products.map(prod=>{
        const categoryProd = categories.filter(filt => filt.id == prod.category)[0];
        const discountsProd = discountsHolyDays.filter(filt => filt.category == prod.category)[0];
        const prodNew:ProductNew = {id:prod.productId,name:prod.name,typeOfProcuct:categoryProd.name,discount:discountsProd.value || 0};
        return prodNew;
    })]
    newProducts.forEach(item=>{
        const ExistProduc = arrTransformProds.filter(filt => filt.id === item.id)[0];
        if(!ExistProduc){
            arrTransformProds.push(item);
            succesProds = [...succesProds,{...item,status:'sucess'}];
        }
        else{
            errorProds = [...errorProds,{...item,status:'error',message:'insertion error',errors:'duplicated key'}];
        }
    })
    const objeResponseData = {...{['list_products']:arrTransformProds},...{['prods_insert']:succesProds},...{['prods_error']:errorProds}};
    console.log(objeResponseData)
}

console.log(calculateAverage())
console.log(costHigherByCategory())
console.log(existProductByCategoryAndPrice(1,100))
console.log(getProductscontainCharacter('s'))
console.log(constructArrayObjProds())
console.log(construcProdIdDiscount())
addProducts()