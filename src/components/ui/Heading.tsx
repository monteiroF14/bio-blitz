import { FC, HTMLAttributes } from "react";

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  variant: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
};

const Heading: FC<HeadingProps> = ({ variant, className = "", ...props }) => {
  const variantMap = {
    h1: "text-zinc-950 text-lg sm:text-xl md:text-2xl font-bold",
    h2: "text-zinc-950 text-lg sm:text-xl md:text-2xl font-bold",
    h3: "text-zinc-950 text-base sm:text-lg md:text-xl font-semibold",
    h4: "text-zinc-950 text-lg sm:text-base md:text-lg font-semibold",
    h5: "text-zinc-950 text-base sm:text-sm md:text-base font-semibold",
    h6: "text-zinc-950 text-sm sm:text-xs md:text-sm font-semibold",
  };

  const Tag = variant;

  return <Tag className={`${variantMap[variant]} ${className}`} {...props} />;
};

export default Heading;
