import React, { useState } from "react";
import ChatBody from "./ChatBody";
import ChatInput from "./ChatInput";
import axios from "axios";
import {
  generateOutfit,
  getLlmRecommendations,
  getOutfitPrompts,
} from "../../../apis/genai.ts";
import { addPersonalizedProducts } from "../../../actions/productAction";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { questions } from "../../../utils/constants";

const Chatbot = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [index, setIndex] = useState(0);
  const [chat, setChat] = useState([
    {
      sender: "ai",
      message: `Hello ${user.name && user.name.split(" ", 1)}`,
      images: [],
    },
    {
      sender: "ai",
      message:
        "I'm your AI fashion outfit generator. Let's chat about your style, and I'll create a personalized outfit for you🙂",
      images: [],
    },
  ]);

  const getAIResponse = async (newMessage) => {
    const userMessage = newMessage.message;
    // await Promise.resolve(setChat((prev) => [...prev, newMessage]));
    setLoading(true);

    const [outfits, llmRecommendations] = await Promise.all([
      getOutfitPrompts(userMessage, chat.length < 11),
      getLlmRecommendations(userMessage, chat.length < 11),
    ]);

    setChat((prev) => [
      ...prev,
      { sender: "ai", message: outfits.answer.trim(), images: [] },
    ]);

    const generatedOutfits = await Promise.all(
      outfits.outfit_descriptions.map((prompt, idx) =>
        generateOutfit(userMessage, prompt, `Outfit ${idx + 1}`)
      )
    );

    dispatch(addPersonalizedProducts(llmRecommendations.articles));

    console.log({
      outfits,
      llmRecommendations,
      generatedOutfits,
    });

    setLoading(false);

    if (generatedOutfits.length) {
      setChat((prev) => [
        ...prev,
        { sender: "ai", message: "", images: generatedOutfits },
      ]);
    }
  };

  const uploadImage = async (url) => {
    setLoading(true);
    setLoading1(true);
    // Image not visible properly
    // setChat((prev) => [...prev, { sender: "ai", message: "", images: [url] }]);

    setChat((prev) => [
      ...prev,
      {
        sender: "ai",
        message:
          "Sure based on the given images here are some product recommendations: \nProduct 1: Skinny Carrot No Fade Black\n5-pocket jeans in stretch denim with a regular waist, button fly and skinny, tapered legs.\n\nProduct 2: Puma Sneakers\nPuma Low-Top Lace-Up Sneakers.\n\nProduct 3: V-neck Allington TVP\nV-neck T-shirt in premium cotton jersey.\n\nProduct 4: Peregrin PU jacket\nImitation leather biker jacket with quilted details on the shoulders, a diagonal zip, press-studs on the lapels and a zip at the cuffs. Side pockets, a small, zipped front pocket and a small flap pocket with a press-stud. Lined.",
        images: [],
      },
    ]);

    dispatch(
      addPersonalizedProducts([
        "0607350001",
        "0479294002",
        "1000000010",
        "0681963001",
      ])
    );
    setLoading1(false);
  };

  const sendMessage = async (newMessage) => {
    await Promise.resolve(setChat((prev) => [...prev, newMessage]));
    // if (localStorage.getItem("gender") !== null && index === 0) {
    //   console.log("Hi");
    //   setIndex(index + 1);
    // }
    // if (localStorage.getItem("age") !== null && index <= 1) {
    //   setIndex(index + 1);
    // }
    // console.log(localStorage.getItem("gender"));
    if (index === 1) {
      localStorage.setItem("gender", newMessage.message);
    }
    if (index === 2) {
      localStorage.setItem("age", newMessage.message);
    }
    setLoading(true);
    setLoading1(true);

    if (index < 3) {
      setTimeout(async () => {
        var randomIndex = Math.floor(Math.random() * 3);
        var tempMessage = {
          sender: "ai",
          message: questions[index][randomIndex],
          images: [],
        };
        await Promise.resolve(setChat((prev) => [...prev, tempMessage]));
        setIndex(index + 1);
      }, 2500);
    } else {
      getAIResponse(newMessage);
    }
    setLoading(false);
    setLoading1(false);
  };

  return (
    <div className="bg-[#1A232E] rounded-md shadow-2xl  h-[87vh] py-6 relative text-white overflow-hidden flex flex-col justify-between align-middle">
      {/* gradients */}
      <div className="gradient-01 z-0 absolute"></div>
      <div className="gradient-02 z-0 absolute bottom-1"></div>

      {/* Header */}
      <div className=" font-bold text-xl text-center mb-3">
        Outfit Generator
      </div>
      {/* Chat Body */}
      <div className="h-[90%] overflow-auto w-full max-w-4xl min-w-[20rem] py-8 self-center px-4">
        <ChatBody chat={chat} />
      </div>

      {/* Input */}
      <div className="w-full max-w-4xl min-w-[20rem] self-center px-4">
        <ChatInput
          sendMessage={sendMessage}
          loading={loading}
          loading1={loading1}
          uploadImage={uploadImage}
        />
      </div>
    </div>
  );
};

export default Chatbot;
