import { createContext, useReducer } from "react";

const CartContext = createContext({
  items: [],
  addItem: (item) => {},
  removeItem: (id) => {},
});

function cartReducer(state, action) {
  if (action.type === "ADD_ITEM") {
    const cartItemIndex = state.items.findIndex(
      (item) => item.id === action.item.id
    );

    const updateditems = [...state.items];

    if (cartItemIndex > -1) {
      const updatedItem = {
        ...state.items[cartItemIndex],
        quantity: state.items[cartItemIndex].quantity + 1,
      };

      updateditems[cartItemIndex] = updatedItem;
    } else {
      updateditems.push({ ...action.item, quantity: 1 });
    }
    return { ...state, items: updateditems };
  }

  if (action.type == "REMOVE_ITEM") {
    const cartItemIndex = state.items.findIndex(
      (item) => item.id === action.id
    );

    const updateditems = [...state.items];

    const existingCartItem = state.items[cartItemIndex];

    if (existingCartItem.quantity === 1) {
      updateditems.splice(cartItemIndex, 1);
    } else {
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity - 1,
      };

      updateditems[cartItemIndex] = updatedItem;
    }
    return { ...state, items: updateditems };
  }

  return state;
}

export function CartContextProvider({ children }) {
  const [cart, dispatchCartAction] = useReducer(cartReducer, { items: [] });

  function addItem(item) {
    dispatchCartAction({
      type: "ADD_ITEM",
      item,
    });
  }

  function removeItem(id) {
    dispatchCartAction({
      type: "REMOVE_ITEM",
      id,
    });
  }

  const cartContext = {
    items: cart.items,
    addItem,
    removeItem,
  };

  console.log(cartContext);

  return (
    <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>
  );
}

export default CartContext;
