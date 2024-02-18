"use client";
import { Button } from "@/components/ui/button";
import { Invoker } from "@/src/lib/Invoker";
import { useState } from "react";

function Add() {
  const [data, setData] = useState();
  async function loaddata() {
    const response = await fetch(process.env.BASE_URL + "/api", {
      method: "GET",
    });
    const play = await response.json();
    return play;
  }
  return (
    <div>
      <Button
        variant="default"
        className=""
        type="submit"
        onClick={async () => {
          const test = await loaddata();
          console.log(test);
        }}
      >
        Submit
      </Button>
    </div>
  );
}

export default Add;
