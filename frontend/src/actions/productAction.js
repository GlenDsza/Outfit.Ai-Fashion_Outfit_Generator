import axios from "axios";
import {
  ALL_PRODUCTS_FAIL,
  ALL_PRODUCTS_REQUEST,
  ALL_PRODUCTS_SUCCESS,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  ADMIN_PRODUCTS_REQUEST,
  ADMIN_PRODUCTS_SUCCESS,
  ADMIN_PRODUCTS_FAIL,
  CLEAR_ERRORS,
  NEW_REVIEW_REQUEST,
  NEW_REVIEW_SUCCESS,
  NEW_REVIEW_FAIL,
  NEW_PRODUCT_REQUEST,
  NEW_PRODUCT_SUCCESS,
  NEW_PRODUCT_FAIL,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAIL,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAIL,
  ALL_REVIEWS_REQUEST,
  ALL_REVIEWS_SUCCESS,
  ALL_REVIEWS_FAIL,
  DELETE_REVIEW_REQUEST,
  DELETE_REVIEW_SUCCESS,
  DELETE_REVIEW_FAIL,
  SLIDER_PRODUCTS_REQUEST,
  SLIDER_PRODUCTS_SUCCESS,
  SLIDER_PRODUCTS_FAIL,
  TRENDING_PRODUCTS_REQUEST,
  TRENDING_PRODUCTS_SUCCESS,
  TRENDING_PRODUCTS_FAIL,
  RECOMMENDED_PRODUCTS_REQUEST,
  RECOMMENDED_PRODUCTS_SUCCESS,
  RECOMMENDED_PRODUCTS_FAIL,
  POPULAR_PRODUCTS_REQUEST,
  POPULAR_PRODUCTS_SUCCESS,
  POPULAR_PRODUCTS_FAIL,
  PERSONALIZED_PRODUCTS_REQUEST,
  PERSONALIZED_PRODUCTS_SUCCESS,
  PERSONALIZED_PRODUCTS_FAIL,
} from "../constants/productConstants";
import { RECOMMENDER_API_URL } from "../constants/urls.ts";

// Get All Products --- Filter/Search/Sort
export const getProducts =
  (keyword = "", category, price = [0, 200000], ratings = 0, currentPage = 1) =>
  async (dispatch) => {
    try {
      dispatch({ type: ALL_PRODUCTS_REQUEST });

      let url = `/api/v1/products?keyword=${keyword}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}&page=${currentPage}`;
      if (category) {
        url = `/api/v1/products?keyword=${keyword}&category=${category}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}&page=${currentPage}`;
      }
      const { data } = await axios.get(url);

      dispatch({
        type: ALL_PRODUCTS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: ALL_PRODUCTS_FAIL,
        payload: error.response.data.message,
      });
    }
  };

// Get Trending Products of a specific Category
export const getTrendingProducts = () => async (dispatch) => {
  try {
    dispatch({ type: TRENDING_PRODUCTS_REQUEST });

    const { data } = await axios.get(`/api/v1/trendingProducts`);

    dispatch({
      type: TRENDING_PRODUCTS_SUCCESS,
      payload: data.trendingProducts,
    });
  } catch (error) {
    dispatch({
      type: TRENDING_PRODUCTS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Get Recommended Products from ML model
export const getRecommendedProducts = (cid) => async (dispatch) => {
  try {
    dispatch({ type: RECOMMENDED_PRODUCTS_REQUEST });
    const { data } = await axios.post(`${RECOMMENDER_API_URL}/recommend`, {
      cid: cid,
    });
    let parsedRecommendedProducts = [];
    try {
      parsedRecommendedProducts = JSON.parse(data.data);
    } catch (e) {
      console.error("Error parsing recommendedProducts:", e);
    }
    const modifiedRecommendedProducts = parsedRecommendedProducts.map(
      (object) => ({
        ...object,
        _id: object._id.$oid,
      })
    );
    dispatch({
      type: RECOMMENDED_PRODUCTS_SUCCESS,
      payload: modifiedRecommendedProducts,
    });
  } catch (error) {
    dispatch({
      type: RECOMMENDED_PRODUCTS_FAIL,
      payload: error,
    });
  }
};

// Get Popular Products from ML model
export const getPopularProducts = () => async (dispatch) => {
  try {
    dispatch({ type: POPULAR_PRODUCTS_REQUEST });

    const { data } = await axios.post(`${RECOMMENDER_API_URL}/popular`);
    let parsedPopularProducts = [];
    try {
      parsedPopularProducts = JSON.parse(data.data);
      console.log(parsedPopularProducts[0]._id.$oid);
    } catch (e) {
      console.error("Error parsing recommendedProducts:", e);
    }
    const modifiedPopularProducts = parsedPopularProducts.map((object) => ({
      ...object,
      _id: object._id.$oid,
    }));
    dispatch({
      type: POPULAR_PRODUCTS_SUCCESS,
      payload: modifiedPopularProducts,
    });
  } catch (error) {
    dispatch({
      type: POPULAR_PRODUCTS_FAIL,
      payload: error,
    });
  }
};

// Get All Products Of Same Category
export const getSimilarProducts = (category) => async (dispatch) => {
  try {
    dispatch({ type: ALL_PRODUCTS_REQUEST });

    const { data } = await axios.get(`/api/v1/products?category=${category}`);

    dispatch({
      type: ALL_PRODUCTS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ALL_PRODUCTS_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const addPersonalizedProducts =
  (articles) => async (dispatch, getState) => {
    try {
      var personalizedProducts =
        getState().personalizedProducts.personalizedProducts;
      dispatch({ type: PERSONALIZED_PRODUCTS_REQUEST });
      const existingProductIds = new Set(
        personalizedProducts.map((product) => product._id)
      );

      for (const aid of articles) {
        const { data } = await axios.get(`/api/v1/productByAid/${aid}`);
        const productToAdd = data.product;

        if (!existingProductIds.has(productToAdd._id)) {
          personalizedProducts.unshift(productToAdd);
          existingProductIds.add(productToAdd._id);
        }
      }

      dispatch({
        type: PERSONALIZED_PRODUCTS_SUCCESS,
        payload: personalizedProducts,
      });
    } catch (error) {
      dispatch({
        type: PERSONALIZED_PRODUCTS_FAIL,
        payload: error,
      });
    }
  };

// Get Product Details
export const getProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/v1/product/${id}`);

    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data.product,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// New/Update Review
export const newReview = (reviewData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_REVIEW_REQUEST });
    const config = { header: { "Content-Type": "application/json" } };
    const { data } = await axios.put("/api/v1/review", reviewData, config);

    dispatch({
      type: NEW_REVIEW_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: NEW_REVIEW_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Get All Products ---PRODUCT SLIDER
export const getSliderProducts = () => async (dispatch) => {
  try {
    dispatch({ type: SLIDER_PRODUCTS_REQUEST });

    const { data } = await axios.get("/api/v1/products/all");

    dispatch({
      type: SLIDER_PRODUCTS_SUCCESS,
      payload: data.products,
    });
  } catch (error) {
    dispatch({
      type: SLIDER_PRODUCTS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Get All Products ---ADMIN
export const getAdminProducts = () => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_PRODUCTS_REQUEST });

    const { data } = await axios.get("/api/v1/admin/products");

    dispatch({
      type: ADMIN_PRODUCTS_SUCCESS,
      payload: data.products,
    });
  } catch (error) {
    dispatch({
      type: ADMIN_PRODUCTS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// New Product ---ADMIN
export const createProduct = (productData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_PRODUCT_REQUEST });
    const config = { header: { "Content-Type": "application/json" } };
    const { data } = await axios.post(
      "/api/v1/admin/product/new",
      productData,
      config
    );

    dispatch({
      type: NEW_PRODUCT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: NEW_PRODUCT_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Update Product ---ADMIN
export const updateProduct = (id, productData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PRODUCT_REQUEST });
    const config = { header: { "Content-Type": "application/json" } };
    const { data } = await axios.put(
      `/api/v1/admin/product/${id}`,
      productData,
      config
    );

    dispatch({
      type: UPDATE_PRODUCT_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_PRODUCT_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Delete Product ---ADMIN
export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_PRODUCT_REQUEST });
    const { data } = await axios.delete(`/api/v1/admin/product/${id}`);

    dispatch({
      type: DELETE_PRODUCT_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_PRODUCT_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Get Product Reviews ---ADMIN
export const getAllReviews = (id) => async (dispatch) => {
  try {
    dispatch({ type: ALL_REVIEWS_REQUEST });
    const { data } = await axios.get(`/api/v1/admin/reviews?id=${id}`);

    dispatch({
      type: ALL_REVIEWS_SUCCESS,
      payload: data.reviews,
    });
  } catch (error) {
    dispatch({
      type: ALL_REVIEWS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Delete Product Review ---ADMIN
export const deleteReview = (reviewId, productId) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_REVIEW_REQUEST });
    const { data } = await axios.delete(
      `/api/v1/admin/reviews?id=${reviewId}&productId=${productId}`
    );

    dispatch({
      type: DELETE_REVIEW_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_REVIEW_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Clear All Errors
export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
