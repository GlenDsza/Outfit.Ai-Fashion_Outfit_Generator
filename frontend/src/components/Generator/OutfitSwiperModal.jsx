import React, { useState } from "react";
import OutfitSwiper from "./OutfitSwiper/OutfitSwiper";

const OutfitSwiperModal = ({
  modalTriggered,
  setModalTriggered,
  imagesObj,
}) => {
  const [title, setTitle] = useState(
    imagesObj[0]?.desc ? imagesObj[0]?.desc : "Outfit 1"
  );
  return (
    <div
      className={`modal bg-[#000000F1]  ${
        modalTriggered ? "d-block" : "d-none"
      }`}
      tabindex="-1"
    >
      <div className="modal-dialog modal-fullscreen">
        <div className="modal-content bg-transparent">
          <div className="modal-header border-b-0">
            <h1 className="modal-title fs-bold fs-3">{title}</h1>
            <button
              className="btn btn-close btn-close-white cursor-pointer"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => setModalTriggered(false)}
            ></button>
          </div>
          <div className="modal-body">
            <OutfitSwiper imagesObj={imagesObj} setTitle={setTitle} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutfitSwiperModal;
