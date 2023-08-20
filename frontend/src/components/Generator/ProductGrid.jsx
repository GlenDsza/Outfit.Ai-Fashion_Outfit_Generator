import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Product from "../Trending/Product";
import { useSnackbar } from "notistack";
import {
  clearErrors,
  getRecommendedProducts,
} from "../../actions/productAction";

const ProductGrid = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const {
    user,
    loading,
    recommendedProducts,
    personalizedProductsLoading,
    personalizedProducts,
    error,
  } = useSelector((state) => ({
    loading: state.recommendedProducts.loading,
    error: state.recommendedProducts.error,
    recommendedProducts: state.recommendedProducts.recommendedProducts,
    personalizedProducts: state.personalizedProducts.personalizedProducts,
    personalizedProductsLoading: state.personalizedProducts.loading,
    user: state.user.user,
  }));

  var count = 15 - personalizedProducts?.length;

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
    if (user?.customer_id && (recommendedProducts || []).length < 1)
      dispatch(getRecommendedProducts(user.customer_id));
  }, [dispatch, user, error, enqueueSnackbar]);

  return (
    <div className="flex flex-col gap-1 pb-4 justify-center items-center w-full overflow-hidden bg-white rounded-md">
      <div className="fs-4 fw-bold my-1">Personalized Products</div>
      <hr className="w-full bg-grey" />
      <div className="grid grid-cols-1 sm:grid-cols-3 w-full place-content-start overflow-hidden pb-4 border-b ">
        {!personalizedProductsLoading &&
          personalizedProducts?.map((prod) => {
            return <Product {...prod} key={prod._id} />;
          })}
        {!loading &&
          recommendedProducts?.slice(0, count).map((prod) => {
            return <Product {...prod} key={prod._id} />;
          })}
      </div>
    </div>
  );
};

export default ProductGrid;
