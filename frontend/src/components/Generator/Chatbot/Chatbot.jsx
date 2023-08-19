import React, { useState } from "react";
import ChatBody from "./ChatBody";
import ChatInput from "./ChatInput";
import axios from "axios";
import {
  generateOutfit,
  getLlmRecommendations,
  getOutfitPrompts,
} from "../../../apis/genai.ts";

const Chatbot = () => {
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState([]);
  const [imagesObj, setImagesObj] = useState([]);

  const sendMessage = async (newMessage) => {
    const userMessage = newMessage.message;
    await Promise.resolve(setChat((prev) => [...prev, newMessage]));
    setLoading(true);
    setImagesObj([]);
    
    // const { data } = await axios.post(
    //   "/api/v1/generator/respond",
    //   dataToSend,
    //   config
    // );

    const [outfits, llmRecommendations] = await Promise.all([
      getOutfitPrompts(userMessage),
      getLlmRecommendations(userMessage),
    ]);
    console.log("LLM responses", { outfitPrompts: outfits, llmRecommendations });

    setChat((prev) => [...prev, { sender: "ai", message: outfits.answer }]);

    // llmRecommendations is a list of product_id recommended
    // @TODO - Fetch and Add those in products list

    // @TODO - Call Kenneth's API

    const generatedOutfits = await Promise.all(
      outfits.outfit_descriptions.map((prompt, idx) =>
        generateOutfit(userMessage, prompt, `Outfit ${idx + 1}`)
      )
    );

    console.log({
      outfits,
      llmRecommendations,
      generatedOutfits,
    });

    setLoading(false);

    if (generatedOutfits.length) {
      setImagesObj(generatedOutfits);
    }
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
