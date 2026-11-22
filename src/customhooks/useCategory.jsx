import React from "react";
import { useSearchParams } from "react-router-dom";

const useCategory = ({
  baseClassName = "",
  activeClassName = "",
  inactiveClassName = "",
} = {}) => {
  const [searchParams] = useSearchParams();

  const activeCategory = searchParams.get("category");

  const categoryClass = (category) => {
    return `${baseClassName} ${
      activeCategory === category ? activeClassName : inactiveClassName
    }`.trim();
  };

  return { activeCategory, categoryClass };
};

export default useCategory;
