import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Icon } from "@iconify-icon/react";
import { useEffect, useId, useState } from "react";
import { actionsType, reducerAction } from "../app/add/page";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type Props = {
  state: actionsType[];
  uuid: string;
  dispatch: (arg: reducerAction) => void;
  disabled: boolean;
  enabled: boolean;
  selectValues: { name: string; value: string }[];
};

const initialState = {
  name: "",
  selector: "",
  type: "href",
  filter: "",
};
function ExtractElementInput({
  dispatch,
  uuid,
  state,
  disabled,
  enabled,
  selectValues,
}: Props) {
  const id = useId();

  const [parent, setParent] = useState(true);
  const [data, setData] = useState(initialState);

  useEffect(() => {
    dispatch({
      payload: data,
      type: "update",
      uuid,
    });
  }, [data, dispatch, uuid]);
  return (
    <fieldset
      disabled={disabled}
      className={`relative  rounded p-2 text-foreground transition-colors ${enabled && "bg-green-400/50 dark:bg-green-800/50"}`}
    >
      {enabled && (
        <div className="absolute  right-0 top-0   rounded-bl border-b-2 border-l-2  bg-green-500/60 p-2 font-bold text-white ">
          Enabled
        </div>
      )}
      <div className={`gap-8  rounded  md:flex ${enabled ? "" : ""}`}>
        <div className="mt-4">
          <Label htmlFor={id + "selectorName"} className="text-lg text-white ">
            Name
          </Label>
          <Input
            placeholder="e.g. Title"
            className="basis-1/3 text-xl placeholder:text-lg  placeholder:text-gray-400"
            required
            type="text"
            name="selectorName"
            id={id + "selectorName"}
            onChange={(e) => {
              setData({ ...data, name: e.target.value });
            }}
          />
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between  text-white ">
            <Label
              htmlFor={id + `page$$`}
              className={`p-1 transition-all ${!parent ? "rounded bg-green-400/40  font-semibold" : ""}`}
            >
              Css Selector
            </Label>
            <Switch
              className="scale-75"
              checked={parent}
              onClick={() => {
                if (!parent) {
                  setData({ ...data, selector: "" });
                }
                if (!data.selector) {
                  setData({ ...data, selector: "" });
                }

                setParent(!parent);
              }}
            />
            <p
              className={`p-1 transition-all ${parent ? "rounded bg-green-400/40  font-semibold" : ""}`}
            >
              Parent
            </p>
          </div>
          <Input
            type="text"
            className="text-xl placeholder:text-lg  placeholder:text-gray-400"
            disabled={parent}
            value={data.selector}
            placeholder="e.g. h1 > div"
            onChange={(e) => {
              setData({ ...data, selector: e.target.value });
            }}
            name="page$$"
            id={id + `page$$`}
          />
        </div>

        {/* Dropdown */}

        <div className="mt-4">
          <Label htmlFor={id + `type`} className="text-lg text-white">
            Type
          </Label>
          {/* <select
            onChange={(e) => {
              console.log(data);
              setData({ ...data, type: e.target.value });
            }}
            value={data.type}
            id={id + `type`}
            className="block rounded px-3 py-2  font-semibold  "
          >
            {selectValues.map((option, index) => {
              return (
                <option key={index} value={option.value}>
                  {option.name}
                </option>
              );
            })}
          </select> */}
          <Select
            name="selectorType"
            defaultValue="href"
            onValueChange={(e) => {
              setData({ ...data, type: e });
            }}
          >
            <SelectTrigger className="text-lg font-semibold text-foreground sm:w-[280px]">
              <SelectValue placeholder="Link Url" />
            </SelectTrigger>
            <SelectContent className="text-lg font-semibold ">
              {selectValues.map((option, index) => {
                return (
                  <SelectItem key={index} value={option.value}>
                    {option.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* filter */}
        <div className="mt-4">
          <div className="">
            <Label htmlFor={id + `filter`} className="text-lg text-white   ">
              Filter
            </Label>
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
          </div>

          <Input
            placeholder="e.g. price:30"
            className="basis-1/3 text-xl placeholder:text-lg  placeholder:text-gray-400"
            type="text"
            name="selectorName"
            id={id + `filter`}
            onChange={(e) => {
              setData({ ...data, filter: e.target.value });
            }}
          />
        </div>

        {/* Buttons */}

        <div className="flex items-end justify-between gap-8 ">
          <Icon
            icon={enabled ? "carbon:checkmark-filled" : "mdi:plus"}
            tabIndex={0}
            width={24}
            height={24}
            className={`bubble  rounded-md bg-approved  p-0.5   ${enabled ? "active" : ""}`}
            onClick={() => {
              // setEnabled(!enabled);
              dispatch({ type: "toggle", uuid: uuid });
            }}
          />
          <Icon
            icon={"material-symbols:cancel"}
            tabIndex={0}
            width={24}
            height={24}
            className="bubble rounded-md bg-destructive p-0.5 text-destructive-foreground"
            onClick={(e) => {
              e.preventDefault();
              dispatch({ type: "remove", uuid: uuid });
            }}
          />
        </div>
      </div>
    </fieldset>
  );
}
export default ExtractElementInput;
