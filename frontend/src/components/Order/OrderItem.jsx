import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CircleIcon from "@mui/icons-material/Circle";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/functions";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { clearErrors, getSliderProducts } from "../../actions/productAction";
import { useEffect } from "react";

const OrderItem = (props) => {
  const { orderId, product, user, createdAt, deliveredAt, orderStatus } = props;
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { error, products, loading } = useSelector((state) => state.products);
  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
    dispatch(getSliderProducts());
  }, [dispatch, error, enqueueSnackbar]);
  const specProduct = products?.find(
    (prod) => prod.article_id === product.article_id
  );
  return (
    <Link
      to={`/order_details/${orderId}`}
      className="flex p-4 items-start bg-white border rounded gap-2 sm:gap-0 hover:shadow-lg"
    >
      {/* <!-- image container --> */}
      <div className="w-full sm:w-32 h-20">
        <img
          draggable="false"
          className="h-full w-full object-contain"
          src={specProduct?.images[0]?.url}
          alt={specProduct?.name}
        />
      </div>
      {/* <!-- image container --> */}

      {/* <!-- order desc container --> */}
      <div className="flex flex-col sm:flex-row justify-between w-full">
        <div className="flex flex-col gap-1 overflow-hidden">
          <p className="text-sm">
            {specProduct?.name.length > 40
              ? `${specProduct?.name.substring(0, 40)}...`
              : specProduct?.name}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Quantity: {product.quantity}
          </p>
          <p className="text-xs text-gray-500">
            Total: ₹
            {(product.quantity * parseInt(product.price, 10)).toLocaleString()}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row mt-1 sm:mt-0 gap-2 sm:gap-20 sm:w-1/2">
          <p className="text-sm">₹{product.price.toLocaleString()}</p>

          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-medium flex items-center gap-1">
              {orderStatus === "Shipped" ? (
                <>
                  <span className="text-primary-orange pb-0.5">
                    <CircleIcon sx={{ fontSize: "14px" }} />
                  </span>
                  Shipped
                </>
              ) : orderStatus === "Delivered" ? (
                <>
                  <span className="text-primary-green pb-0.5">
                    <CircleIcon sx={{ fontSize: "14px" }} />
                  </span>
                  Delivered on {formatDate(deliveredAt)}
                </>
              ) : (
                <>
                  <span className="text-primary-green pb-0.5">
                    <RadioButtonUncheckedIcon sx={{ fontSize: "14px" }} />
                  </span>
                  Ordered on {formatDate(createdAt)}
                </>
              )}
            </p>
            {orderStatus === "Delivered" ? (
              <p className="text-xs ml-1">Your item has been {orderStatus}</p>
            ) : orderStatus === "Shipped" ? (
              <p className="text-xs ml-1">Your item has been {orderStatus}</p>
            ) : (
              <p className="text-xs ml-1">Seller has processed your order</p>
            )}
          </div>
        </div>
      </div>
      {/* <!-- order desc container --> */}
    </Link>
  );
};

export default OrderItem;
