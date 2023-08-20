import { useEffect } from "react";
import Categories from "../Layouts/Categories";
import Banner from "./Banner/Banner";
import DealSlider from "./DealSlider/DealSlider";
import ProductSlider from "./ProductSlider/ProductSlider";
import { useDispatch, useSelector } from "react-redux";
import {
  clearErrors,
  getPopularProducts,
  getRecommendedProducts,
  getSliderProducts,
} from "../../actions/productAction";
import { useSnackbar } from "notistack";
import MetaData from "../Layouts/MetaData";

const Home = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { error, loading, user, popularProducts, recommendedProducts } =
    useSelector((state) => ({
      error: state.products.error,
      loading: state.products.loading,
      user: state.user.user,
      popularProducts: state.popularProducts,
      recommendedProducts: state.recommendedProducts,
    }));

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
    dispatch(getSliderProducts());

    if (user?.customer_id) dispatch(getRecommendedProducts(user.customer_id));
  }, [dispatch, error, user, enqueueSnackbar]);

  useEffect(() => {
    dispatch(getPopularProducts());
  }, []);

  return (
    <>
      <MetaData title="Flipkart" />
      <Categories />
      <main className="flex flex-col gap-3 px-2 mt-16 sm:mt-2">
        {/* <Banner /> */}

        {!loading && (
          <ProductSlider
            title={"Recommend products"}
            tagline={"Based on Your Activity"}
            type={"recommended"}
          />
        )}
        {/* <DealSlider title={"Top Brands, Best Price"} /> */}
        {!loading && (
          <ProductSlider
            title={"Trending Products"}
            tagline={"Based on product popularity"}
            type={"trending"}
          />
        )}
        {/* <DealSlider title={"Top Offers On"} /> */}
        {/* {!loading && (
          <ProductSlider
            title={"Don't Miss These!"}
            tagline={"Inspired by your order"}
          />
        )} */}
        <DealSlider title={"Discounts for You"} />
      </main>
    </>
  );
};

export default Home;
