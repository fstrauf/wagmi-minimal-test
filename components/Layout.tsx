import React, { ReactNode } from "react";
import Header from "./Header";

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => (
  <div className="max-w-5xl p-5 m-auto">
    <Header />
    <div>{props.children}</div>    
  </div>
);

export default Layout;
