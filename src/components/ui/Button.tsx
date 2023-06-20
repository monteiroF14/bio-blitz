import { ButtonHTMLAttributes, FC } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant: "default" | "tab" | "activeTab" | "signOut";
};

const Button: FC<ButtonProps> = ({ variant, ...props }) => {
  const variants = {
    default:
      "bg-zinc-100 text-zinc-950 hover:bg-zinc-300 text-xs md:text-sm p-2 border-current border-solid border-4 uppercase",
    tab: "bg-zinc-100 text-zinc-950 hover:bg-zinc-300 text-xs md:text-sm p-2 uppercase",
    activeTab: "bg-zinc-950 text-zinc-100 text-xs md:text-sm p-2 uppercase",
    signOut:
      "bg-red-600 text-zinc-100 hover:bg-red-700 text-xs md:text-sm p-2 border-current border-solid border-4 uppercase",
  };

  return <button className={variants[variant]} {...props} />;
};

export default Button;
