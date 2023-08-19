import React, { useEffect, useState } from "react";
import MetaData from "../Layouts/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, getTrendingProducts } from "../../actions/productAction";
import { useSnackbar } from "notistack";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { categories } from "../../utils/constants";
import { useParams } from "react-router-dom";
import NoProduct from "../Products/NoProduct";
import Loader from "../Layouts/Loader";
import ProductSlider from "./ProductSlider";
import Product from "./Product";

const Trending = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();
  const [category, setCategory] = useState(params.category);
  const { loading, error, products } = useSelector(
    (state) => state.trendingProducts
  );
  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
    dispatch(getTrendingProducts());
  }, [dispatch, error, enqueueSnackbar]);

  return (
    <>
      <MetaData title="Trending Products" />
      <main className="w-full mt-20 ">
        <div className="my-2 mx-3">
          <p className="text-xl font-medium px-10 pb-2">
            {category === "all"
              ? "Trending Products"
              : "Trending in " +
                (category === "Menswear"
                  ? "Men's Fashion"
                  : category === "Womenswear"
                  ? "Women's Fashion"
                  : category === "General"
                  ? "Unisex Fashion"
                  : category === "Baby/Children"
                  ? "Kid's Fashion"
                  : category)}{" "}
            <span className="text-lg font-extralight">(last 7 days)</span>{" "}
          </p>

          <hr />
        </div>

        {/* <!-- row --> */}
        <div className="flex gap-3 mt-2 sm:mt-2 sm:mx-3 m-auto mb-7">
          {/* <!-- sidebar column  --> */}
          <div className="hidden sm:flex flex-col w-1/4">
            {/* <!-- nav tiles --> */}
            <div className="flex flex-col bg-white rounded-md shadow ml-4">
              {/* <!-- filters header --> */}
              <div className="flex items-center justify-between gap-5 px-4 py-2 border-b">
                <p className="text-lg font-medium">Categories</p>
              </div>
              <div className="flex flex-col pl-4 pb-3 ">
                <FormControl>
                  <RadioGroup
                    aria-labelledby="category-radio-buttons-group"
                    onChange={(e) => setCategory(e.target.value)}
                    name="category-radio-buttons"
                    value={category}
                  >
                    <FormControlLabel
                      value={"all"}
                      control={<Radio size="small" />}
                      label={
                        <span className="text-sm" key={"all"}>
                          All
                        </span>
                      }
                    />
                    {categories.map((el, i) => (
                      <FormControlLabel
                        value={
                          el === "Men's Fashion"
                            ? "Menswear"
                            : el === "Women's Fashion"
                            ? "Womenswear"
                            : el === "Unisex Fashion"
                            ? "General"
                            : el === "Kid's Fashion"
                            ? "Baby/Children"
                            : el
                        }
                        control={<Radio size="small" />}
                        label={
                          <span className="text-sm" key={i}>
                            {el}
                          </span>
                        }
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </div>
            </div>
            {/* <!-- nav tiles --> */}
          </div>
          {/* <!-- sidebar column  --> */}
          {/* <!-- search column --> */}
          <div className="flex-1">
            {loading && <Loader />}

            {!loading && products?.length === 0 && category === "all" && (
              <NoProduct />
            )}

            {!loading &&
              category !== "all" &&
              !products?.some((i) => i.category === category) && <NoProduct />}

            {!loading && products?.length > 0 && category === "all" ? (
              products.map((prod, i) => (
                <ProductSlider
                  title={prod.category}
                  key={prod.category}
                  setCategoryFunc={setCategory}
                  index={i}
                />
              ))
            ) : (
              <div className="flex flex-col gap-2 pb-4 justify-center items-center w-full overflow-hidden bg-white">
                <div className="grid grid-cols-1 sm:grid-cols-4 w-full place-content-start overflow-hidden pb-4 border-b">
                  {products?.map((prod) => {
                    if (prod.category === category) {
                      return prod.products.map((product) => (
                        <Product {...product.info} key={product.info._id} />
                      ));
                    }
                    return null; // Return null for other categories
                  })}
                </div>
              </div>
            )}
          </div>
          {/* <!-- search column --> */}
        </div>
        {/* <!-- row --> */}
      </main>
    </>
  );
};

export default Trending;
