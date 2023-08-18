import React, { useState } from "react";

const ChatInput = ({ sendMessage, loading }) => {
  const [text, setText] = useState("");

  const handleInputChange = (event) => {
    setText(event.target.value);
  };

  const handleSubmit = (event) => {
    if (text.trim() === "") return;
    sendMessage({ sender: "user", message: text });
    setText("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent new line on Enter
      handleSubmit();
    }
  };

  const numRows = Math.min(5, Math.max(1, Math.ceil(text.length / 46)));
  return (
    <div className="w-full bg-white bg-opacity-10 max-h-40 rounded-lg px-4 py-2 overflow-auto relative">
      {loading ? (
        <img src="./loader.gif" alt="loading..." className="w-8 m-auto" />
      ) : (
        <>
          <textarea
            rows={numRows}
            value={text}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            type="text"
            className="border-0 bg-transparent outline-none w-11/12 resize-none pt-1"
          />
          <img
            width={20}
            src="./send.png"
            alt="send"
            onClick={handleSubmit}
            className="absolute top-3 right-3 hover:cursor-pointer ease-in duration-100 hover:scale-125"
          />
        </>
      )}
    </div>
  );
};

export default ChatInput;
