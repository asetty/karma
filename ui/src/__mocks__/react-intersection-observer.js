import { useRef } from "react";

const useInView = () => {
  const ref = useRef(null);
  return [ref, true];
};

export { useInView };
