import { ReactNode } from "react";

type MainProps = {
  children: ReactNode;
};

export default function Main({ children }: MainProps) {
  return (
    <div className="w-full max-w-360 mx-auto flex grow items-center justify-center">
      {children}
    </div>
  );
}
