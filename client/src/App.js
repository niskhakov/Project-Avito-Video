import React, { useState } from "react";
import Layout from "./Layout";
import Contacts from "./Contacts";
import Call from "./Call";
import Login from "./Login"

const PageComponents = {
  Contacts,
  Call,
  Login
};

export default () => {
  const [page, setPage] = useState("Login");
  const [data, setData] = useState({});
  const Element = PageComponents[page];
  const changePage = (pageComponent, extra) => {
    setPage(pageComponent);
    setData(extra);
  };
  return (
    <Layout>
      <Element setPage={changePage} extra={data} />
    </Layout>
  );
};
