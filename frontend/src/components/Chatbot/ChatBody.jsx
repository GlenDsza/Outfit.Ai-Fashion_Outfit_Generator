import React, { useEffect, useRef } from "react";
import autoAnimate from "@formkit/auto-animate";

const ChatBody = ({ chat }) => {
  const aiStyle =
    "bg-white bg-opacity-40 backdrop-blur-lg dropshadow-md mr-auto";
  const parent = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  useEffect(() => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 200);
  }, [chat]);

  return (
    <div className="flex flex-col gap-4" ref={parent}>
      {chat.map((message, i) => {
        return (
          <div
            key={i}
            className={`flex ${message.sender === "ai" ? "" : "self-end"}`}
          >
            {message.sender === "ai" && (
              <img
                src="./bot.png"
                alt="chatbot"
                className="w-7 h-7 rounded-full mt-2 mr-2 "
              />
            )}

            <div
              key={i}
              className={`border-[#999999] break-words border-2 rounded-lg  px-2 py-2 max-w-[90%] ${
                message.sender === "ai" && aiStyle
              }`}
            >
              <pre className="whitespace-pre-wrap font-sans">
                <span>{message.message}</span>
              </pre>
            </div>
            {message.sender !== "ai" && (
              <img
                src="./user.png"
                alt="User"
                className="w-7 h-7 rounded-full mt-2 ml-2 "
              />
            )}
          </div>
        );
      })}
      <div ref={bottomRef} className="h-3"></div>
    </div>
  );
};

export default ChatBody;
