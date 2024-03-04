"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ExtractElementInput from "@/src/components/ExtractElementInput";
import { Icon } from "@iconify-icon/react";
import {
  SyntheticEvent,
  useEffect,
  useId,
  useReducer,
  useRef,
  useState,
} from "react";

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
  const [downBtnState, setDownBtnState] = useState(false);

  const downBtn = useRef(null);

  //* Scroll down button
  useEffect(() => {
    console.log(downBtn);

    const handleScroll = () => {
      if (window.scrollY > 100) setDownBtnState(true);
      else setDownBtnState(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [progress, setProgress] = useState(0);
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

      console.log(outputData);
      const response = await fetch(process.env.BASE_URL + "/api", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(outputData),
      });

      while (true) {
        const reader = response.body?.getReader();

        if (reader) {
          const { done, value } = await reader?.read();
          const chunk = new TextDecoder().decode(value);

          console.log(chunk);

          if (chunk.startsWith("{")) {
            const jsonData = JSON.parse(chunk);
            setData([jsonData]);
          } else {
            setProgress(parseInt(chunk));
          }
          if (done) {
            setProgress(0);
            break;
          }
        }
        reader?.releaseLock();
      }
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Down Button */}(
      {downBtnState && (
        <button
          ref={downBtn}
          type="button"
          className=""
          onClick={() => {
            window.scrollTo(0, 0);
          }}
        >
          <Icon
            icon="mdi:arrow-up"
            width={30}
            height={30}
            className="fixed bottom-10 right-10 rounded bg-violet-400 p-4 text-white "
          />
        </button>
      )}
      ){/* Form for initial selector input */}
      <form
        action=""
        onSubmit={handleSubmit}
        className="mb-10 space-y-8"
        id="addForm"
      >
        <fieldset
          className={`space-y-4 rounded border p-4${loading ? " bg-muted" : " bg-secondary"}`}
          disabled={loading}
        >
          <h2 className="  p-2 text-2xl font-bold">Add New Session</h2>
          <div className="flex items-center gap-8">
            <Label htmlFor={id + "title"} className="text-lg font-medium">
              Title
            </Label>
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
            <Label htmlFor={id + "link"} className="text-lg font-medium">
              Link
            </Label>

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

        <div className=" space-y-4 rounded bg-secondary p-4">
          <legend className="mb-8 border-b border-foreground p-2 text-2xl font-semibold ">
            Grab Items for Scraping
          </legend>
          <fieldset
            className={`flex gap-8 rounded ${loading ? " bg-slate-100" : ""}`}
            disabled={loading}
          >
            <Input
              placeholder="name"
              className="basis-1/3 text-xl placeholder:text-lg  placeholder:text-gray-400"
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
              className="text-xl placeholder:text-lg placeholder:text-gray-400"
              placeholder="selector"
              name="page$$"
              id={id + "page$$"}
              onChange={(e) =>
                setOptions({ ...options, selector: e.target.value })
              }
            />
            <Select
              name="selectorType"
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
            <div className="flex gap-8 ">
              <Button
                variant="default"
                className=""
                type="submit"
                disabled={loading}
              >
                Submit
              </Button>
              {loading && (
                <Button
                  variant="default"
                  className="bg-violet-400 "
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();

                    dispatch({ type: "removeAll" });
                  }}
                >
                  Cancel
                </Button>
              )}
              {data.length > 0 && !loading && (
                <Button
                  variant="default"
                  className="bg-red-400 hover:bg-red-600"
                  disabled={loading}
                  type="submit"
                  onClick={() => setData([])}
                >
                  Clear
                </Button>
              )}
            </div>
            {loading && (
              <div className="absolute inset-y-0 left-full ml-4 flex items-center text-white">
                <Icon icon={"svg-spinners:wind-toy"} width={30} height={30} />
                <label htmlFor="loadingProgress">Progress...</label>
                <progress
                  id="loadingProgress"
                  className=""
                  value={progress}
                  max={100}
                />
                {progress}%
              </div>
            )}
          </div>

          <div className="flex gap-8">
            {actions.length > 0 && (
              <Button
                variant="default"
                className="bg-red-400 "
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
              className="bg-cyan-700"
              disabled={loading}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                dispatch({ type: "add", actionName: "addExtractType" });
              }}
            >
              Add Sub-Element Selector
            </Button>
          </div>
        </div>
        <section>
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
        </section>
      </form>
      {/* Results container */}
      <div
        className="mb-8 space-y-4"
        id="results"
        data-res={data[0] && data[0].result.length > 0 ? true : false}
      >
        {data.length > 0 &&
          data.map((item) => {
            return (
              <div
                key={crypto.randomUUID()}
                className="w-full rounded-lg bg-blue-50 p-4 "
              >
                {/* Results rows*/}

                {item.result.length > 0 ? (
                  <div className="space-y-4">
                    {item.result.map((element: any) => {
                      /* When subelements are present */

                      if (actions.length > 0) {
                        <div className="">
                          {item.result.map((resultElement: any) => {
                            return Object.keys(resultElement).map((key, i) => {
                              // console.log(key, resultElement[key]);
                              return (
                                <div key={i} className="">
                                  <p>{resultElement[key]}</p>
                                  zzzzz
                                </div>
                              );
                            });
                          })}
                        </div>;
                      } else {
                        /* when subelements are not present */

                        return (
                          <div
                            key={crypto.randomUUID()}
                            className="border-b border-foreground p-2"
                          >
                            <p className="text-ellipsis">
                              <strong className="mr-4">
                                {options.selectorName}
                              </strong>
                              {element[options.selectorName]}
                            </p>
                          </div>
                        );
                      }
                    })}
                  </div>
                ) : (
                  <p>No data found</p>
                )}
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
              filter: "",
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
