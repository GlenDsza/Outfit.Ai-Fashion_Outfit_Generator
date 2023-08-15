import {
  CLEAR_ERRORS,
  TRENDING_PRODUCTS_REQUEST,
  TRENDING_PRODUCTS_SUCCESS,
  TRENDING_PRODUCTS_FAIL,
} from "../constants/productConstants";

export const trendingProductsReducer = (
  state = { trendingProducts: [] },
  { type, payload }
) => {
  switch (type) {
    case TRENDING_PRODUCTS_REQUEST:
      return {
        loading: true,
        products: [],
      };
    case TRENDING_PRODUCTS_SUCCESS:
      return {
        loading: false,
        products: payload,
      };
    case TRENDING_PRODUCTS_FAIL:
      return {
        loading: false,
        error: payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};
