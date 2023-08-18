import React, { useEffect, useRef, useState } from "react";
import autoAnimate from "@formkit/auto-animate";
import OutfitSwiperModal from "../OutfitSwiperModal";
import { useSelector } from "react-redux";

const ChatMessage = ({ message, imagesObj, setModalTriggered }) => {
  const { user } = useSelector((state) => state.user);
  const isAiMessage = message?.sender === "ai";
  const messageStyle = `border-[#999999] break-words border-1 rounded-md p-2 max-w-[90%] ${
    isAiMessage ? "bg-[#FFFFFF22] dropshadow-md mr-auto" : ""
  }`;

  return (
    <>
      {!imagesObj ? (
        <div className={`flex ${isAiMessage ? "" : "self-end"}`}>
          {isAiMessage && (
            <img
              src="./bot.png"
              alt="chatbot"
              className="w-7 h-7 rounded-full mt-2 mr-2"
            />
          )}

          <div className={messageStyle}>
            <pre className="whitespace-pre-wrap font-sans">
              {message.message}
            </pre>
          </div>

          {!isAiMessage && (
            <img
              src={user?.avatar?.url ? user?.avatar?.url : "./user.png"}
              alt="User"
              className="w-8 h-8 rounded-full mt-2 ml-2"
            />
          )}
        </div>
      ) : (
        <div className="flex">
          <img
            src="./bot.png"
            alt="chatbot"
            className="w-7 h-7 rounded-full mt-2 mr-2"
          />
          <div
            className={`flex flex-col border-[#999999] break-words border-1 rounded-md p-2 max-w-[90%] bg-[#FFFFFF22] dropshadow-md mr-auto`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 w-full place-content-start overflow-hidden">
              {imagesObj.map((image, i) => (
                <>
                  <div
                    className="m-2"
                    key={i}
                    onClick={() => setModalTriggered(true)}
                  >
                    <h2>{image.desc}</h2>
                    <img
                      className="my-1 rounded-md"
                      src={`data:image/png;base64,${image.imageString}`}
                      alt={i}
                      width={150}
                      height={150}
                    />
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const ChatBody = ({ chat, imagesObj }) => {
  const parentRef = useRef(null);
  const bottomRef = useRef(null);
  const [modalTriggered, setModalTriggered] = useState(false);

  useEffect(() => {
    if (parentRef.current) {
      autoAnimate(parentRef.current);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 200);
  }, [chat]);

  return (
    <>
      <div className="flex flex-col gap-4" ref={parentRef}>
        {chat.map((message, i) => (
          <ChatMessage key={i} message={message} />
        ))}
        {imagesObj.length > 1 && (
          <ChatMessage
            setModalTriggered={setModalTriggered}
            imagesObj={imagesObj}
            key={999}
          />
        )}

        <div ref={bottomRef} className="h-3"></div>
      </div>
      <OutfitSwiperModal
        modalTriggered={modalTriggered}
        setModalTriggered={setModalTriggered}
        imagesObj={imagesObj}
      />
    </>
  );
};

export default ChatBody;
