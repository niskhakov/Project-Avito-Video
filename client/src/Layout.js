import React from "react";

const Layout = ({ children }) => {
  return (
    <section id="main" className="my-5">
      <div className="container w-75">{children}</div>
    </section>
  );
};

export default Layout;
