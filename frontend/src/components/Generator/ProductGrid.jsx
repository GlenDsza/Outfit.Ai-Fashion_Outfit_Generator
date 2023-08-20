import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Product from "../Trending/Product";
import { useSnackbar } from "notistack";
import {
  clearErrors,
  getRecommendedProducts,
  getSliderProducts,
} from "../../actions/productAction";

const ProductGrid = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  // const { user } = useSelector((state) => state.user);
  // const { recommendedProducts, error } = useSelector(
  //   (state) => state.recommendedProducts
  // );

  const { user, loading, recommendedProducts, error } = useSelector(
    (state) => ({
      loading: state.recommendedProducts.loading,
      error: state.recommendedProducts.error,
      recommendedProducts: state.recommendedProducts.recommendedProducts,
      user: state.user.user,
    })
  );

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
    if (user?.customer_id) dispatch(getRecommendedProducts(user.customer_id));
  }, [dispatch, user, error, enqueueSnackbar]);

  return (
    <div className="flex flex-col gap-1 pb-4 justify-center items-center w-full overflow-hidden bg-white rounded-md">
      <div className="fs-4 fw-bold my-1">Personlaized Products</div>
      <hr className="w-full bg-grey" />
      <div className="grid grid-cols-1 sm:grid-cols-3 w-full place-content-start overflow-hidden pb-4 border-b ">
        {!loading &&
          recommendedProducts?.slice(0, 6).map((prod) => {
            return <Product {...prod} key={prod._id} />;
          })}
      </div>
    </div>
  );
};

export default ProductGrid;
