export const FADE_IN_VARIANTS = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 }
};

export const FADE_IN_TRANSITION = { duration: 0.6, ease: [0.16, 1, 0.3, 1] };

export const FADE_IN = {
  ...FADE_IN_VARIANTS,
  transition: FADE_IN_TRANSITION
};

export const STAGGER_CONTAINER = {
  animate: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

export const LIST_ITEM_SLIDE_VARIANTS = {
  initial: { opacity: 0, x: -15 },
  animate: { opacity: 1, x: 0 }
};

export const LIST_ITEM_SLIDE_TRANSITION = { duration: 0.5, ease: [0.16, 1, 0.3, 1] };

export const LIST_ITEM_SLIDE = {
  ...LIST_ITEM_SLIDE_VARIANTS,
  transition: LIST_ITEM_SLIDE_TRANSITION
};

export const CARD_TRANSITION = {
  type: "spring",
  stiffness: 300,
  damping: 25
};
