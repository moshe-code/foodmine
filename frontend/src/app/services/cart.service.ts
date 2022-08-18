import { Injectable } from '@angular/core';
import { TitleStrategy } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../shared/models/CartItem';
import { Cart } from '../shared/models/Carts';
import { Food } from '../shared/models/Food';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart:Cart = this.getCartFromLocalStorage();
  private cartSubject: BehaviorSubject<Cart> = new BehaviorSubject(this.cart);

  constructor() { }

  addToCart(food:Food):void{
    let cartItem = this.cart.items
    .find(item => item.food.id === food.id)
    if(cartItem)
    return;

    this.cart.items.push(new CartItem(food));
    this.setCartToLocalStoragae();
  }

  removeFromCart(foodId:string):void{
    this.cart.items = this.cart.items
    .filter(item => item.food.id != foodId);
    this.setCartToLocalStoragae();
  }

  changeQuantity(foodId:string, quantity: number){
    let cartItem = this.cart.items
    .find(item => item.food.id === foodId)
    if(!cartItem) return;

    cartItem.quantity = quantity;
    cartItem.price = quantity * cartItem.food.price;
    this.setCartToLocalStoragae();
  }

  clearCart(){
    this.cart = new Cart();
    this.setCartToLocalStoragae();
  }
  getCartObservable():Observable<Cart>{
    return this.cartSubject.asObservable();
  }
  private setCartToLocalStoragae():void{
    this.cart.totalPrice = this.cart.items
    .reduce((prevSum, currentItem) => prevSum + currentItem.price, 0);
    this.cart.totalCount = this.cart.items
    .reduce((prevSum, currentItem) => prevSum + currentItem.quantity, 0);

    const cartJson = JSON.stringify(this.cart);
    localStorage.setItem('cart',cartJson);
    this.cartSubject.next(this.cart);
  }

  private getCartFromLocalStorage():Cart{

  const cartJson =localStorage.getItem('cart');
  return cartJson? JSON.parse(cartJson): new Cart()
}
}
