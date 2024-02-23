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
import ExtractElementInput from "@/src/components/ExtractElementInput";
import { Icon } from "@iconify-icon/react";
import { SyntheticEvent, useId, useReducer, useState } from "react";

export type reducerAction =
  | {
      type: "removeAll";
    }
  | { type: "remove"; uuid: string }
  | { type: "update"; uuid: string; payload: actionsType["params"] }
  | {
      type: "add";
      actionName: actionsType["actionName"];
    };

export type actionsType = {
  uuid: string;
  actionName: "addExtractType" | "openNewPage";
  params: {
    [key: string]: string;
  } | null;
};
const initialReducerState: actionsType[] = [];

const initialOptions = {
  link: "",
  title: "",
  selector: "",
  selectorType: "href",
  selectorName: "",
};

function Add() {
  const [actions, dispatch] = useReducer(reducer, initialReducerState);
  const id = useId();

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
  }>(initialOptions);

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    try {
      e.preventDefault();

      setLoading(true);
      const outputData = {
        options,
        actions,
      };

      const testMap = {};
      const testData = actions.map((element) => {
        element.actionName;
        testMap[element.actionName] ? testMap[element.actionName] : "";
      });

      console.log(outputData);
      const response = await fetch(process.env.BASE_URL + "/api", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(outputData),
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
      {/* Form for initial selector input */}
      <form action="" onSubmit={handleSubmit} className="mb-10 space-y-8">
        <fieldset
          className={`space-y-4 rounded border p-4${loading ? " bg-muted" : " bg-secondary"}`}
          disabled={loading}
        >
          <h2 className="  p-2 text-2xl font-bold">Add new item</h2>
          <div className="flex items-center gap-8">
            <label htmlFor={id + "title"} className="text-lg font-medium">
              Title
            </label>
            <Input
              type="text"
              name="title"
              className="text-lg font-medium"
              required
              id={id + "title"}
              onChange={(e) =>
                setOptions({ ...options, title: e.target.value })
              }
            />
          </div>
          <div className="flex items-center gap-8">
            <label htmlFor={id + "link"} className="text-lg font-semibold">
              Link
            </label>
            <Input
              required
              type="text"
              className="text-lg font-medium "
              name="link"
              id={id + "link"}
              onChange={(e) => setOptions({ ...options, link: e.target.value })}
            />
          </div>
        </fieldset>

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
              id={id + "selectorName"}
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
              id={id + "page$$"}
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
          <div className="relative">
            <Button variant="default" className="" type="submit">
              Submit
            </Button>
            {loading && (
              <div className="absolute inset-y-0 left-full ml-4 flex items-center text-white">
                <Icon icon={"svg-spinners:wind-toy"} width={30} height={30} />
              </div>
            )}
          </div>
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
            {actions.length > 0 && (
              <Button
                variant="default"
                className="bg-red-300 "
                disabled={loading}
                type="submit"
                onClick={(e) => {
                  e.preventDefault();

                  dispatch({ type: "removeAll" });
                }}
              >
                Remove All
              </Button>
            )}{" "}
            <Button
              variant="default"
              className="bg-fuchsia-300 "
              disabled={loading}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                dispatch({ type: "add", actionName: "addExtractType" });
              }}
            >
              Add
            </Button>
          </div>
        </div>
        {actions.length > 0 &&
          actions.map((item) => {
            return (
              <ExtractElementInput
                disabled={loading}
                dispatch={dispatch}
                state={actions}
                key={item.uuid}
                uuid={item.uuid}
              />
            );
          })}
      </form>

      {/* Results container */}

      <div className="space-y-4">
        {data.length > 0 &&
          data.map((item) => {
            return (
              <div
                key={crypto.randomUUID()}
                className="w-full rounded-lg bg-blue-50 p-4 "
              >
                {/* Results */}
                <div className="border">
                  {item.result.length > 0 ? (
                    item.result.map((result: any) => {
                      return (
                        <div
                          key={crypto.randomUUID()}
                          className="flex gap-8 border p-2 text-lg"
                        >
                          <p>{options.selectorName}</p>
                          {options.selectorType === "href" ? (
                            <a href={result[options.selectorName]} className="">
                              {result[options.selectorType]}
                            </a>
                          ) : (
                            <>
                              <p>{}</p>
                              <p>{result[options.selectorType]}</p>
                            </>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p>No data found</p>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

function reducer(state: typeof initialReducerState, action: reducerAction) {
  switch (action.type) {
    case "removeAll": {
      return [];
    }
    case "add": {
      switch (action.actionName) {
        case "addExtractType": {
          const newElement = {
            uuid: crypto.randomUUID(),
            actionName: action.actionName,
            params: {
              name: "",
              selector: "",
              type: "",
            },
          };
          return [...state, newElement];
        }
        default:
          return state;
      }
    }
    case "remove": {
      const newArray = state.filter((element) => element.uuid !== action.uuid);
      return newArray;
    }
    case "update": {
      const newArray = state.map((element) => {
        if (element.uuid === action.uuid) {
          return { ...element, params: { ...action.payload } };
        } else {
          return element;
        }
      });
      return newArray;
    }
    default: {
      return state;
    }
  }
}

export default Add;
