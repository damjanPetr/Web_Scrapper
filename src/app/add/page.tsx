"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SyntheticEvent, useState } from "react";

function Add() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<
    {
      link: string;
      title: string;
      [key: string]: any;
    }[]
  >([]);
  const [options, setOptions] = useState<{
    title: string;
    link: string;
    selector: string;
    selectorName: string;
    selectorType: string;
  }>({
    link: "",
    title: "",
    selector: "",
    selectorType: "",
    selectorName: "",
  });
  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    try {
      console.log(options);
      e.preventDefault();

      setLoading(true);
      const response = await fetch(process.env.BASE_URL + "/api", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(options),
      });
      const json = await response.json();

      console.log(json);

      setData([...data, json]);
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form action="" onSubmit={handleSubmit} className="space-y-8">
        <fieldset className="space-y-4 border p-4" disabled={loading}>
          <legend className=" bg-slate-300 p-2 text-xl ">Add new item</legend>
          <div className="flex items-center gap-8">
            <label htmlFor="title   " className="text-xl font-semibold">
              Title
            </label>
            <Input
              type="text"
              name="title"
              className="text-xl font-medium"
              required
              id="title"
              onChange={(e) =>
                setOptions({ ...options, title: e.target.value })
              }
            />
          </div>
          <div className="flex items-center gap-8">
            <label htmlFor="link" className="text-xl font-semibold">
              Link
            </label>
            <Input
              required
              type="text"
              className="text-xl font-medium "
              name="link"
              id="link"
              onChange={(e) => setOptions({ ...options, link: e.target.value })}
            />
          </div>
        </fieldset>

        {/* actions */}
        <div className="space-y-4 bg-blue-50 p-4">
          <label htmlFor="page$$" className="text-xl font-semibold ">
            Selector
          </label>
          <div className="flex gap-8">
            <Input
              placeholder="name"
              className="basis-1/3 text-xl placeholder:text-xl placeholder:font-semibold"
              required
              type="text"
              name="selectorName"
              id="selectorName"
              onChange={(e) => {
                setOptions({ ...options, selectorName: e.target.value });
              }}
            />
            <Input
              required
              type="text"
              className="text-xl placeholder:text-xl placeholder:font-semibold"
              placeholder="selector"
              name="page$$"
              id="page$$"
              onChange={(e) =>
                setOptions({ ...options, selector: e.target.value })
              }
            />
            <Select
              defaultValue="href"
              onValueChange={(e) => {
                setOptions({ ...options, selectorType: e });
              }}
            >
              <SelectTrigger className="w-[280px] text-lg font-semibold">
                <SelectValue placeholder="Link Url" />
              </SelectTrigger>
              <SelectContent className="text-lg font-semibold">
                <SelectItem value="href">Link Url</SelectItem>
                <SelectItem value="textContent">Text Content</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4">
          <Button variant="default" className="" type="submit">
            Submit
          </Button>
          {data.length > 0 && (
            <Button
              variant="default"
              className=""
              type="submit"
              onClick={() => setData([])}
            >
              Clear
            </Button>
          )}
        </div>
      </form>
      {loading && (
        <div className="w-full rounded-lg bg-blue-50 p-4">Loading...</div>
      )}
      {data.length > 0 &&
        data.map((item) => {
          return (
            <div
              key={crypto.randomUUID()}
              className="w-full rounded-lg bg-blue-50 p-4 "
            >
              <div className="space-y-4 p-4">
                <h1 className="text-2xl">
                  <span className="font-semibold">Title:</span> {item.link}
                </h1>
                <h1 className="text-2xl">
                  <span className="font-semibold">Link:</span> {item.title}
                </h1>
              </div>
              {/* Results */}
              <div className="border">
                {item.result.length > 0 &&
                  item.result.map((result: any) => {
                    console.log(result);
                    return (
                      <div
                        key={crypto.randomUUID()}
                        className="flex gap-8 border p-2 text-lg"
                      >
                        <p>{options.selectorName}</p>
                        {options.selectorType === "href" ? (
                          <a href={result[options.selectorName]} className="">
                            {result[options.selectorName]}
                          </a>
                        ) : (
                          <p>{result[options.selectorName]}</p>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default Add;
