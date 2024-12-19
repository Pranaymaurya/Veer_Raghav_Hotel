import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const GalleryGrid = ({ cards }) => {
  const [selected, setSelected] = useState(null);
  const [lastSelected, setLastSelected] = useState(null);

  const handleClick = (card) => {
    setLastSelected(selected);
    setSelected(card);
  };

  const handleOutsideClick = () => {
    setLastSelected(selected);
    setSelected(null);
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 relative">
      {cards.map((card) => (
        <motion.div
          key={card.id}
          layoutId={`card-${card.id}`}
          onClick={() => handleClick(card)}
          className={`${card.className} relative overflow-hidden rounded-lg cursor-pointer ${
            selected?.id === card.id
              ? "md:col-span-2 md:row-span-2 z-50"
              : "col-span-1"
          }`}
        >
          <motion.img
            layoutId={`image-${card.id}`}
            src={card.thumbnail}
            alt={`Thumbnail ${card.id}`}
            className="w-full h-full object-cover"
          />
          <AnimatePresence>
            {selected?.id === card.id && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black bg-opacity-50 flex items-end p-4"
              >
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  className="text-white"
                >
                  {card.content}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleOutsideClick}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

