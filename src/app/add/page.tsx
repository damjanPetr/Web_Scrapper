"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { themeContex } from "@/contex/ThemeContex";
import ExtractElementInput from "@/src/components/ExtractElementInput";
import { Icon } from "@iconify-icon/react";
import {
  SyntheticEvent,
  useContext,
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
    }
  | {
      type: "toggle";
      uuid: string;
    };

export type actionsType = {
  uuid: string;
  actionName: "addExtractType" | "openNewPage";
  enabled: boolean;
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

const itemsPerPage = 10; // Number of items to display per page

function Add() {
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<{ [key: string]: string | null }>({});
  const [downBtnState, setDownBtnState] = useState(false);
  const [cancelStream, setCancelStream] = useState(false);
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

  const [actions, dispatch] = useReducer(reducer, initialReducerState);

  const id = useId();

  const downBtn = useRef(null);

  const startIndex = (currentPage - 1) * itemsPerPage; //  Start index of items
  const endIndex = itemsPerPage * currentPage; // End index of items

  const totalPages = Math.ceil(data[0]?.result?.length / itemsPerPage);
  const shadowSize = 2;

  function setNextPage() {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  }
  function setPrevPage() {
    setCurrentPage((prevPage) => Math.max(prevPage - shadowSize, 1));
  }

  //* Scroll down button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) setDownBtnState(true);
      else setDownBtnState(false);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    try {
      e.preventDefault();

      setLoading(true);
      const outputData = {
        options,
        actions: actions.filter((action) => action.enabled),
      };
      console.log(outputData);
      const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(outputData),
      });
      const reader = response.body?.getReader();

      while (true) {
        if (reader) {
          const { done, value } = await reader?.read();
          const chunk = new TextDecoder().decode(value);

          if (chunk.startsWith("{")) {
            const jsonData = JSON.parse(chunk);
            if (jsonData.error) throw new Error(jsonData.error);
            if (jsonData.result) {
              console.log(jsonData);
              setError({ error: null });
              setData([jsonData]);
            }
          } else {
            setProgress(parseInt(chunk));
          }

          if (done) {
            reader.cancel();
            break;
          }
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        setError({ error: err.message });
      }
    } finally {
      setProgress(0);
      setCurrentPage(1);
      setLoading(false);
      setCancelStream(false);
    }
  }
  const play = useContext(themeContex);

  return (
    <div>
      {/* Down Button */}
      {error.error && <p className="text-red-500">{error.error}</p>}
      <button
        ref={downBtn}
        type="button"
        className={
          "transition-opacity " +
          (downBtnState === true ? "opacity-100" : "opacity-0")
        }
        onClick={() => {
          window.scrollTo(0, 0);
        }}
      >
        <Icon
          icon="mdi:arrow-up"
          width={30}
          height={30}
          className="fixed bottom-6 right-6 rounded bg-violet-400 p-4 text-white "
        />
      </button>
      {/* Form for initial selector input */}
      <form action="" onSubmit={handleSubmit} className="mb-10 " id="addForm">
        <fieldset
          className={`space-y-4 rounded border text-foreground p-4${loading ? " bg-muted" : " "}`}
          disabled={loading}
        >
          <h2 itemID={"play"} className="  p-2 text-2xl font-bold">
            Add New Session
          </h2>
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
          <div className="flex items-center gap-8 ">
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

        <div className=" space-y-4 rounded   p-4 max-sm:min-h-[310px]">
          <legend className="mb-8 border-b  p-2 text-2xl font-semibold text-foreground  ">
            Select Scraping Items
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                  // aria-describedby="tooltip"
                  tabIndex={1}
                  className="text-bold  ml-2   cursor-help text-red-300 backdrop-blur-sm"
                >
                  <Icon icon="mdi:help" width={14} height={14} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Filter is used to filter out unwanted elements</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </legend>
          <fieldset
            className={`flex flex-col gap-8 rounded  sm:flex-row ${loading ? " bg-slate-100" : ""}`}
            disabled={loading}
          >
            <Input
              placeholder="name"
              className="basis-1/3 text-xl placeholder:text-lg  placeholder:text-muted-foreground"
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
              className="text-xl placeholder:text-lg   placeholder:text-muted-foreground"
              placeholder="selector"
              name="page$$"
              id={id + "page$$"}
              onChange={(e) =>
                setOptions({ ...options, selector: e.target.value })
              }
            />
            {actions.length == 0 && (
              <Select
                name="selectorType"
                defaultValue="href"
                onValueChange={(e) => {
                  setOptions({ ...options, selectorType: e });
                }}
              >
                <SelectTrigger className="text-lg font-semibold text-foreground sm:w-[280px]">
                  <SelectValue placeholder="Link Url" />
                </SelectTrigger>
                <SelectContent className="text-lg font-semibold ">
                  <SelectItem value="href">Link Url</SelectItem>
                  <SelectItem value="textContent">Text Content</SelectItem>
                </SelectContent>
              </Select>
            )}
          </fieldset>
        </div>
        <div className="!max-sm:mt-2 flex flex-col items-center justify-between gap-4 p-4 sm:flex-row">
          <div className="relative  max-sm:min-w-80 ">
            <div className="flex  flex-wrap justify-between gap-8 max-sm:min-h-20 ">
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
                  type="button"
                  onClick={(e) => {
                    setCancelStream(true);
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
              <div className="absolute inset-y-0  top-3/4 ml-4 flex items-center justify-center  gap-2 text-white sm:left-full ">
                <Icon
                  icon={"svg-spinners:wind-toy"}
                  width={30}
                  height={30}
                  className=""
                />
                <Progress
                  id="loadingProgress"
                  value={progress}
                  className=" w-28 transition-all"
                />
                {progress}%
              </div>
            )}
          </div>

          <div className="flex justify-end  gap-8 max-sm:min-w-80 ">
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
        <section className="space-y-8 p-4">
          {actions.length > 0 &&
            actions.map((item) => {
              return (
                <ExtractElementInput
                  disabled={loading}
                  enabled={item.enabled}
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
                className="w-full rounded-lg bg-blue-50 p-4"
              >
                <div className="flex items-center justify-between p-2 ">
                  <p className="text-lg text-secondary-foreground">
                    <span className="mr-4 text-xl font-medium">
                      {item.result.length}
                    </span>{" "}
                    results
                  </p>
                  <Button variant="default" type="button" onClick={() => {}}>
                    Export To CSV
                  </Button>
                </div>
                {/* Results rows*/}

                {item.result.length > 0 ? (
                  <div className="space-y-4">
                    {item.result
                      .slice(startIndex, endIndex)
                      .map((element: any) => {
                        /* When subelements are present */
                        if (actions.length > 0) {
                          return (
                            <div className="" key={crypto.randomUUID()}>
                              {Object.keys(element).map((key) => {
                                return (
                                  <div key={crypto.randomUUID()} className="">
                                    <p className="line-clamp-3">
                                      <span className="mr-4 font-bold">
                                        {key}
                                      </span>
                                      {element[key]}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        } else {
                          /* when subelements are not present */
                          return (
                            <div
                              key={crypto.randomUUID()}
                              className="border-b border-foreground p-2"
                            >
                              <p className=" break-words">
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
      <div>
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent className="ml-auto mr-2">
              <PaginationItem>
                <PaginationPrevious onClick={() => setPrevPage()} />
              </PaginationItem>
              <PaginationItem>
                {data &&
                  data.length > 0 &&
                  Array.from(
                    { length: Math.min(totalPages, shadowSize * 2 + 1) },
                    (_, i) => currentPage - shadowSize + i,
                  )
                    .filter((page) => page > 0 && page <= totalPages)
                    .map((item, i) => {
                      return (
                        <PaginationLink
                          key={i}
                          className={
                            currentPage === item
                              ? "bg-secondary/50 font-extrabold"
                              : ""
                          }
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(item);
                          }}
                        >
                          {item}
                        </PaginationLink>
                      );
                    })}
              </PaginationItem>

              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationNext onClick={() => setNextPage()} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
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
            enabled: true,
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

    case "toggle": {
      const newArray = state.map((element) => {
        if (element.uuid === action.uuid) {
          return { ...element, enabled: !element.enabled };
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
