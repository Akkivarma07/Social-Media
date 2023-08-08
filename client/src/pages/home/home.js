import { useEffect } from "react";
import React from "react";
import { axiosClient } from "../../utils/axiosClient";

function Home() {
  useEffect(() => {
    fetchdata();
  }, []);
  async function fetchdata() {
    const response = await axiosClient.get("/post/all");
    console.log("got response", response);
  }

  return <div>home</div>;
}

export default Home;
