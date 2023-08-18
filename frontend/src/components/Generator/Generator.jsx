import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { clearErrors, getSliderProducts } from "../../actions/productAction";
import Chatbot from "./Chatbot/Chatbot";
import ProductGrid from "./ProductGrid";

const Generator = () => {
  const { products, error } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
    dispatch(getSliderProducts());
  }, [dispatch, error, enqueueSnackbar]);

  return (
    <>
      <div className="row pt-[4.5rem] mx-2 overflow-hidden">
        {/* Chat Bot */}
        <div className="col-6 shadow-lg">
          <Chatbot />
        </div>

        <div className="col col-6 h-[87vh] overflow-y-auto px-0 shadow-lg">
          <ProductGrid />
        </div>
      </div>
    </>
  );
};

export default Generator;
