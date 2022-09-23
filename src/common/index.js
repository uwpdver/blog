const STAGGER_CHILDREN = 0.05;
export const listContainer = { hidden: {}, show: { transition: { staggerChildren: STAGGER_CHILDREN } } };
export const listItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { y: { stiffness: 1000, velocity: -100 }, delayChildren: 0.2, staggerChildren: STAGGER_CHILDREN } },
}