"use client";
import React, { useEffect } from "react";

const Page = () => {
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No auth token found");
        return;
      }
      try {
        const response = await fetch("http://localhost:5000/api/users/auth", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        console.log(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return <div>Tenderer</div>;
};

export default Page;
