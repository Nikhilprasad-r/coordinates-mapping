"use client"
// import ImageWithDynamicPointers from "./components/ImageWithDynamicPointers";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
const ImageWithDynamicPointers = dynamic(
  () => import("./components/ImageWithDynamicPointers")
);
export default function Home() {
  const [isClient, setisClient] = useState(false);
  useEffect(() => {
    setisClient(typeof window === "undefined");
  }, []);
  return (
    <>
      {isClient&&<ImageWithDynamicPointers />}
    </>
  );
}
