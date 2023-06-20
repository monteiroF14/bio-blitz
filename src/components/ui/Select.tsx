import { SelectHTMLAttributes, FC } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  variant: "default";
};

const Select: FC<SelectProps> = ({ variant, ...props }) => {
  const variants = {
    default:
      "bg-zinc-100 text-zinc-950 hover:bg-zinc-300 text-xs md:text-sm p-2 border-current border-solid border-4 uppercase w-full",
  };

  return <select {...props} className={variants[variant]} />;
};

export default Select;
