"use client";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify-icon/react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ExtractElementInput from "@/src/components/ExtractElementInput";
import { SyntheticEvent, useState, useReducer, Reducer } from "react";

export type reducerAction =
  | {
      type: "removeAll";
    }
  | { type: "remove"; name: string }
  | {
      type: "add";
    };

type extractData = {
  id: string;
  name: string;
  selector: string;
  type: string;
};

const initialReducerState: extractData[] = [];

function Add() {
  const [actions, dispatch] = useReducer(reducer, initialReducerState);
  function addNewSelector(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
  }
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
      <form action="" onSubmit={handleSubmit} className="space-y-8 ">
        <fieldset
          className={`space-y-4 rounded border p-4${loading ? " bg-muted" : " bg-secondary"}`}
          disabled={loading}
        >
          <h2 className="  p-2 text-2xl font-bold">Add new item</h2>
          <div className="flex items-center gap-8">
            <label htmlFor="title   " className="text-lg font-medium">
              Title
            </label>
            <Input
              type="text"
              name="title"
              className="text-lg font-medium"
              required
              id="title"
              onChange={(e) =>
                setOptions({ ...options, title: e.target.value })
              }
            />
          </div>
          <div className="flex items-center gap-8">
            <label htmlFor="link" className="text-lg font-semibold">
              Link
            </label>
            <Input
              required
              type="text"
              className="text-lg font-medium "
              name="link"
              id="link"
              onChange={(e) => setOptions({ ...options, link: e.target.value })}
            />
          </div>
        </fieldset>

        {/* actions */}
        <div className=" space-y-4 bg-secondary p-4">
          <legend className="mb-8 border-b border-foreground text-xl font-semibold">
            Select Items to scrape
          </legend>
          <fieldset
            className={`flex gap-8 rounded ${loading ? " bg-slate-100" : ""}`}
            disabled={loading}
          >
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
          </fieldset>
        </div>
        <div className="flex items-center justify-between gap-4 p-4">
          <Button variant="default" className="" type="submit">
            Submit
          </Button>
          {data.length > 0 && (
            <Button
              variant="default"
              className=""
              disabled={loading}
              type="submit"
              onClick={() => setData([])}
            >
              Clear
            </Button>
          )}

          <div className="flex gap-8">
            <Button
              variant="default"
              className="bg-fuchsia-300 "
              disabled={loading}
              type="button"
              onClick={() => {
                dispatch({ type: "add" });
              }}
            >
              Add
            </Button>
            <Button
              variant="default"
              className="bg-red-300 "
              disabled={loading}
              type="submit"
              onClick={() => {
                dispatch({ type: "removeAll" });
              }}
            >
              Remove All
            </Button>
          </div>
        </div>

        {actions.length > 0 &&
          actions.map((item) => {
            return <ExtractElementInput dispatch={dispatch} key={item.id} />;
          })}
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

function reducer(state: extractData[], action: reducerAction) {
  switch (action.type) {
    case "removeAll": {
      return [];
    }
    case "add": {
      const newElement = {
        id: crypto.randomUUID(),
        name: "",
        selector: "",
        type: "",
      };
      return [...state, newElement];
    }
    case "remove": {
      const newArray = state.filter((element) => element.name !== action.name);
      return newArray;
    }
    default: {
      return [...state];
    }
  }
}

export default Add;
