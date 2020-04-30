import React, { useState } from "react";
import Layout from "./Layout";
import Contacts from "./Contacts";
import Call from "./Call";

const PageComponents = {
  Contacts,
  Call,
};

export default () => {
  const [page, setPage] = useState("Contacts");
  const [data, setData] = useState([]);
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
