import axios from "axios";

export const getProducts = () =>
  axios.get("https://fakestoreapi.com/products");