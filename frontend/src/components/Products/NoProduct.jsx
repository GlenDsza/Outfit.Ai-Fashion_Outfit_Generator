import React from "react";

const NoProduct = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 bg-white shadow-sm rounded-sm p-6 sm:p-16">
      <img
        draggable="false"
        className="w-1/2 h-44 object-contain"
        src="https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/error-no-search-results_2353c5.png"
        alt="Search Not Found"
      />
      <h1 className="text-2xl font-medium text-gray-900">
        Sorry, no results found!
      </h1>
      <p className="text-xl text-center text-primary-grey">
        Please check the spelling or try searching for something else
      </p>
    </div>
  );
};

export default NoProduct;
