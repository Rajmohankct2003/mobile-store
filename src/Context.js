import React, { Component } from "react";
import { storeProducts, detailProduct } from "./data";
const ProductContext = React.createContext();

class ProductProvider extends Component {
  state = {
    products: [],
    detailProduct: detailProduct,
    cart:[],
    modalOpen:false,
    modalProduct:detailProduct,
    cartSubTotal:0,
    cartTax:0,
    cartTotal:0
  };
  componentDidMount(){
      this.storeProducts();
  }
  storeProducts = () =>{
      let tempProducts=[];
      storeProducts.forEach(item =>{
          const singleItem = {...item};
          tempProducts = [...tempProducts,singleItem]
      })
      this.setState(() =>{
          return {products:tempProducts}
      })

  }
  getItem = (id) =>{
    const product = this.state.products.find(item =>item.id === id)
    return product;
  }
  hanldeDetail = (id) => {
    const product = this.getItem(id);
    this.setState(()=>{
      return {detailProduct:product}
    })
  };
  addToCart = (id) => {
   let tempProducts = [...this.state.products]
   const index = tempProducts.indexOf(this.getItem(id)) 
   const product =tempProducts[index]
   product.inCart=true;
   product.count=1;
   const price = product.price;
   product.total = price;
   this.setState(()=>{
     return {products:tempProducts , cart:[...this.state.cart,product]}
   }, ()=> {this.addTotal()})
  };
  openModal = (id) =>{
    const product= this.getItem(id)
    this.setState({
      modalProduct:product,
      modalOpen:true
    })
  }
  closeModal = (id) =>{
    this.setState({
      modalOpen:false
    })
  }
  increment =(id) =>{
   let tempCart = [...this.state.cart]
   const selectedProduct = tempCart.find(item=>item.id===id)
   const index = tempCart.indexOf(selectedProduct)
   const product = tempCart[index]
   product.count = product.count+1
   product.total = product.count*product.price
   this.setState({ cart:[...tempCart]}, this.addTotal())
  }
  decrement =(id) =>{
    let tempCart = [...this.state.cart]
   const selectedProduct = tempCart.find(item=>item.id===id)
   const index = tempCart.indexOf(selectedProduct)
   const product = tempCart[index]
   product.count = product.count-1
   if(product.count===0){
     this.removeItem(id)
   }
   else {
    product.total = product.count*product.price
    this.setState({ cart:[...tempCart]}, this.addTotal())
   }
  }
  removeItem = (id) =>{
   let tempProducts = [...this.state.products]
   let tempCart = [...this.state.cart]
   tempCart = tempCart.filter(item => id !== item.id)
   const index = tempProducts.indexOf(this.getItem(id)) 
   let removeProduct = tempProducts[index]
   removeProduct.inCart =false;
   removeProduct.count = 0;
   removeProduct.total = 0;
   this.setState({
     cart:[...tempCart],
     products:[...tempProducts]

   },()=>{
     this.addTotal()
   })
  }
  clearCart = () =>{
    this.setState({
      cart:[]
    }, ()=>{this.storeProducts()
    this.addTotal()})
  }
  addTotal = () =>{
    let subTotal =0;
    this.state.cart.map(item => subTotal += item.total)
    const tempTax = subTotal * 0.1;
    const tax  = parseFloat(tempTax.toFixed(2))
    const total = subTotal+tax;
    this.setState({
      cartSubTotal:subTotal,
      cartTax:tax,
      cartTotal:total
    })
  }
  render() {
    return (
      <ProductContext.Provider
        value={{
          ...this.state,
          hanldeDetail: this.hanldeDetail,
          addToCart: this.addToCart,
          openModal:this.openModal,
          closeModal:this.closeModal,
          increment:this.increment,
          decrement:this.decrement,
          removeItem:this.removeItem,
          clearCart:this.clearCart
        }}
      >
        {this.props.children}
      </ProductContext.Provider>
    );
  }
}
const ProductConsumer = ProductContext.Consumer;
export { ProductProvider, ProductConsumer };
