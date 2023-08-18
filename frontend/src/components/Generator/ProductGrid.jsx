import React from "react";
import { useSelector } from "react-redux";
import Product from "../Trending/Product";

const ProductGrid = () => {
  const { products } = useSelector((state) => state.products);
  return (
    <div className="flex flex-col gap-1 pb-4 justify-center items-center w-full overflow-hidden bg-white rounded-md">
      <div className="fs-4 fw-bold my-1">Recommended Products</div>
      <hr className="w-full bg-grey" />
      <div className="grid grid-cols-1 sm:grid-cols-3 w-full place-content-start overflow-hidden pb-4 border-b ">
        {products?.map((prod) => {
          return <Product {...prod} key={prod._id} />;
        })}
      </div>
    </div>
  );
};

export default ProductGrid;
