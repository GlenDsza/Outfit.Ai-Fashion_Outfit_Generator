import React, { useState } from "react";
import ChatBody from "./ChatBody";
import ChatInput from "./ChatInput";
import axios from "axios";
import {
  generateOutfit,
  getLlmRecommendations,
  getOutfitPrompts,
} from "../../../apis/genai.ts";

const Chatbot = ({ setModalTriggered }) => {
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState([]);
  const [imagesObj, setImagesObj] = useState([]);

  const sendMessage = async (newMessage) => {
    await Promise.resolve(setChat((prev) => [...prev, newMessage]));
    // const config = {
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // };
    // var dataToSend = JSON.stringify({
    //   message: newMessage.message,
    // });
    setLoading(true);
    // const { data } = await axios.post(
    //   "/api/v1/generator/respond",
    //   dataToSend,
    //   config
    // );

    const [outfitPrompts, llmRecommendations] = await Promise.all([
      getOutfitPrompts(newMessage.message),
      getLlmRecommendations(newMessage.message),
    ]);
    console.log({ outfitPrompts, llmRecommendations });

    // llmRecommendations is a list of product_id recommended
    // @TODO - Fetch and Add those in products list

    // @TODO - Call Kenneth's API 

    const outfits = await Promise.all(
      outfitPrompts.map((prompt, idx) =>
        generateOutfit(prompt, `Outfit ${idx + 1}`)
      )
    );
    // const outfits = [];

    console.log({
      outfitPrompts,
      llmRecommendations,
      outfits,
    });

    setLoading(false);

    // if (data.success) {
    setChat((prev) => [...prev, { sender: "ai", message: "GG" }]);
    if (outfits.length) {
      setImagesObj(outfits);
    }
    // }
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
        <ChatBody chat={chat} imagesObj={imagesObj} />
      </div>

      {/* Input */}
      <div className="w-full max-w-4xl min-w-[20rem] self-center px-4">
        <ChatInput sendMessage={sendMessage} loading={loading} />
      </div>
    </div>
  );
};

export default Chatbot;
