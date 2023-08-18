import { useSelector } from "react-redux";
import Slider from "react-slick";
import { settings } from "../Home/DealSlider/DealSlider";
import Product from "./Product";

const ProductSlider = ({ title, setCategoryFunc, index }) => {
  const { products } = useSelector((state) => state.trendingProducts);

  return (
    <section className="bg-white w-full shadow overflow-hidden mb-4">
      {/* <!-- header --> */}
      <div className="flex px-6 py-2 justify-between items-center">
        <div className="title flex flex-col gap-0.5">
          <h1 className="text-xl font-medium">{title}</h1>
        </div>
        <button
          onClick={() => setCategoryFunc(title)}
          className="bg-primary-blue text-xs font-medium text-white px-5 py-2.5 rounded-sm shadow-lg uppercase"
        >
          View
        </button>
      </div>
      <hr />
      <Slider {...settings} className="flex items-center justify-between p-1">
        {products &&
          (products[index] || []).products.map((product) => (
            <Product {...product.info} key={product.info._id} />
          ))}
      </Slider>
    </section>
  );
};

export default ProductSlider;
