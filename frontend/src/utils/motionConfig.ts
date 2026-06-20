export const FADE_IN = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
};

export const STAGGER_CONTAINER = {
  animate: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

export const LIST_ITEM_SLIDE = {
  initial: { opacity: 0, x: -15 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
};

export const CARD_TRANSITION = {
  type: "spring",
  stiffness: 300,
  damping: 25
};
