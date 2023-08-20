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
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";

const Chatbot = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState([]);

  const sendMessage = async (newMessage) => {
    const userMessage = newMessage.message;
    await Promise.resolve(setChat((prev) => [...prev, newMessage]));
    setLoading(true);

    const [outfits, llmRecommendations] = await Promise.all([
      getOutfitPrompts(userMessage),
      getLlmRecommendations(userMessage),
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
        <ChatInput sendMessage={sendMessage} loading={loading} />
      </div>
    </div>
  );
};

export default Chatbot;
