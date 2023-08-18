import React from "react";
import Chatbot from "./Chatbot/Chatbot";
import ProductGrid from "./ProductGrid";

const Generator = () => {
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
