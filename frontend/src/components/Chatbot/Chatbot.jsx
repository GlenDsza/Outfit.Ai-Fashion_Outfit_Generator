import React, { useEffect, useState } from "react";
import ChatBody from "./ChatBody";
import ChatInput from "./ChatInput";
import axios from "axios";
import OutfitSwiper from "./OutfitSwiper/OutfitSwiper";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { clearErrors, getSliderProducts } from "../../actions/productAction";
import ProductSlider from "./ProductSlider/ProductSlider";

const Chatbot = () => {
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState([]);
  const sendMessage = async (message) => {
    await Promise.resolve(setChat((prev) => [...prev, message]));
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    var dataToSend = JSON.stringify({
      message: chat.map((message) => message.message).join("\n"),
    });
    setLoading(true);
    const { data } = await axios.post(
      "/api/v1/generator/respond",
      dataToSend,
      config
    );
    setLoading(false);
    if (data.success)
      setChat((prev) => [...prev, { sender: "ai", message: data.message }]);
  };

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
      <div className="grid grid-cols-10 gap-4 px-4 mt-[4.5rem]">
        {/* Chat Bot */}
        <div className="bg-[#1A232E] rounded-md shadow-2xl col-span-4  h-[87vh] py-6 relative text-white overflow-hidden flex flex-col justify-between align-middle">
          {/* gradients */}
          {/* <div className="gradient-01 z-0 absolute"></div>
          <div className="gradient-02 z-0 absolute bottom-1"></div> */}

          {/* Header */}
          <div className="uppercase font-bold text-xl text-center mb-3">
            Outfit Generator
          </div>
          {/* Chat Body */}
          <div className="h-[90%] overflow-auto w-full max-w-4xl min-w-[20rem] py-8 self-center px-4">
            <ChatBody chat={chat} />
          </div>

          {/* Input */}
          <div className="w-full max-w-4xl min-w-[20rem] self-center px-4">
            <ChatInput sendMessage={sendMessage} loading={loading} />
          </div>
        </div>
        <div className="col-span-6 h-[87vh] grid-rows-5">
          <div className="row-start-1 mb-1">
            <OutfitSwiper />
          </div>
          <div className="row-start-4  ">
            <ProductSlider />
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
