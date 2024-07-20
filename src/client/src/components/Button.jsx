import React from "react";

export const Button = ({bgColor, color, size, text,borderRadiuse}) => {
  return <button type="button" 
  style={{bgColor, color, size, text,borderRadiuse}}
  className={`text${size} p-3 hover:drop-shadow-xl`}
  >{text}</button>;
};

export default Button;
