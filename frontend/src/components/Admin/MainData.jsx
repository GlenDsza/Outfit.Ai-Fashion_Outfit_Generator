import { useEffect, useState } from "react";
import { Doughnut, Line, Pie, Bar } from "react-chartjs-2";
import { getAdminProducts } from "../../actions/productAction";
import { useSelector, useDispatch } from "react-redux";
import { getAllOrders } from "../../actions/orderAction";
import { getAllUsers } from "../../actions/userAction";
import { categories } from "../../utils/constants";
import MetaData from "../Layouts/MetaData";
import { Col, Row } from "react-bootstrap";

const MainData = () => {
  const dispatch = useDispatch();

  const { products } = useSelector((state) => state.products);
  const { orders } = useSelector((state) => state.allOrders);
  const { users } = useSelector((state) => state.users);

  let outOfStock = 0;

  products?.forEach((item) => {
    if (item.stock === 0) {
      outOfStock += 1;
    }
  });

  const [totalAmount, setTotalAmount] = useState(0)

  useEffect(() => {
    dispatch(getAdminProducts());
    dispatch(getAllOrders());
    dispatch(getAllUsers());


  }, [dispatch]);
  useEffect(() =>
  {
    let totalA = orders?.reduce(
        (total, order) => total + order.product.price * order.product.quantity,
        0
    );
    setTotalAmount(totalA)
  }, [orders])



  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const date = new Date();
  const lineState = {
    labels: months,
    datasets: [
      {
        label: `Sales in ${date.getFullYear() - 2}`,
        borderColor: "#8A39E1",
        backgroundColor: "#8A39E1",
        data: months.map((m, i) =>
          orders
            ?.filter(
              (od) =>
                new Date(od.createdAt).getMonth() === i &&
                new Date(od.createdAt).getFullYear() === date.getFullYear() - 2
            )
            .reduce((total, od) => total + od.totalPrice, 0)
        ),
      },
      {
        label: `Sales in ${date.getFullYear() - 1}`,
        borderColor: "orange",
        backgroundColor: "orange",
        data: months.map((m, i) =>
          orders
            ?.filter(
              (od) =>
                new Date(od.createdAt).getMonth() === i &&
                new Date(od.createdAt).getFullYear() === date.getFullYear() - 1
            )
            .reduce((total, od) => total + od.totalPrice, 0)
        ),
      },
      {
        label: `Sales in ${date.getFullYear()}`,
        borderColor: "#4ade80",
        backgroundColor: "#4ade80",
        data: months.map((m, i) =>
          orders
            ?.filter(
              (od) =>
                new Date(od.createdAt).getMonth() === i &&
                new Date(od.createdAt).getFullYear() === date.getFullYear()
            )
            .reduce((total, od) => total + od.totalPrice, 0)
        ),
      },
    ],
  };

  const statuses = ["Processing", "Shipped", "Delivered"];

  const pieState = {
    labels: statuses,
    datasets: [
      {
        backgroundColor: ["#9333ea", "#facc15", "#4ade80"],
        hoverBackgroundColor: ["#a855f7", "#fde047", "#86efac"],
        data: statuses.map(
          (status) =>
            orders?.filter((item) => item.orderStatus === status).length
        ),
      },
    ],
  };

  const doughnutState = {
    labels: ["Out of Stock", "In Stock"],
    datasets: [
      {
        backgroundColor: ["#ef4444", "#22c55e"],
        hoverBackgroundColor: ["#dc2626", "#16a34a"],
        data: [outOfStock, products.length - outOfStock],
      },
    ],
  };

  const barState = {
    labels: categories,
    datasets: [
      {
        label: "Products",
        borderColor: "#9333ea",
        backgroundColor: "#9333ea",
        hoverBackgroundColor: "#6b21a8",
        data: categories.map(
          (cat) =>
            products?.filter(
              (item) =>
                item.category ===
                (cat === "Men's Fashion"
                  ? "Menswear"
                  : cat === "Women's Fashion"
                  ? "Ladieswear"
                  : cat === "Unisex Fashion"
                  ? "General"
                  : cat === "Kid's Fashion"
                  ? "Baby/Children"
                  : cat)
            ).length
        ),
      },
    ],
  };

  return (
    <>
      <MetaData title="Admin Dashboard | Flipkart" />

      <Row className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-6" style={{margin:'2vh'}}>
        <Col className="bg-purple-600 text-white rounded p-6">
          <h4 className="text-gray-100 font-medium">Total Sales Amount</h4>
          <h2 className="text-2xl font-bold">
            ₹{totalAmount}
          </h2>
        </Col>
        <Col className="bg-red-500 text-white rounded p-6">
          <h4 className="text-gray-100 font-medium">Total Orders</h4>
          <h2 className="text-2xl font-bold">{orders?.length}</h2>
        </Col>
        <Col className="bg-yellow-500 text-white rounded p-6">
          <h4 className="text-gray-100 font-medium">Total Products</h4>
          <h2 className="text-2xl font-bold">{products?.length}</h2>
        </Col>
        <Col className="bg-green-500 text-white rounded p-6">
          <h4 className="text-gray-100 font-medium">Total Users</h4>
          <h2 className="text-2xl font-bold">{users?.length}</h2>
        </Col>
      </Row>

      <Row style={{margin:'2vh'}}>

        <Col sm={8} >
          <div className="bg-white rounded-xl h-auto shadow-lg p-2" style={{marginRight:'1vw'}}>
            <Line data={lineState} />
          </div>

        </Col>

        <Col sm={4} >
          <div className="bg-white rounded-xl h-auto shadow-lg p-2" >
            <span className="font-medium uppercase text-gray-800">
              Order Status
            </span>
            <Pie data={pieState} />
          </div>
        </Col>
      </Row>

      <Row style={{margin:'2vh'}}>
        <Col sm={8} >
          <div className="bg-white rounded-xl h-auto shadow-lg p-2" style={{marginRight:'1vw'}}>
            <Bar data={barState} />
          </div>
        </Col>

        <Col sm={4} >
          <div className="bg-white rounded-xl h-auto shadow-lg p-2" >
            <span className="font-medium uppercase text-gray-800" >
              Stock Status
            </span>
            <Doughnut data={doughnutState} />
          </div>
        </Col>
      </Row>
    </>
  );
};

export default MainData;
