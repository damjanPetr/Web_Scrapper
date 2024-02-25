import { Input } from "@/components/ui/input";
import { Icon } from "@iconify-icon/react";
import { useId, useState } from "react";
import { actionsType, reducerAction } from "../app/add/page";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type Props = {
  state: actionsType[];
  uuid: string;
  dispatch: (arg: reducerAction) => void;
  disabled: boolean;
};

const initialState = {
  name: "",
  selector: "",
  type: "href",
  filter: "",
};
function ExtractElementInput({ dispatch, uuid, state, disabled }: Props) {
  const id = useId();

  const [data, setData] = useState(initialState);
  const [added, setAdded] = useState(false);

  return (
    <fieldset
      disabled={disabled}
      className={`relative rounded p-2 transition-colors ${added && "bg-green-500/50"}`}
    >
      {added && (
        <div className="absolute  right-0 top-0   rounded-bl border-b-2 border-l-2 border-green-100 bg-green-500/60 p-2 font-bold text-white ">
          Enabled
        </div>
      )}
      <div className={`flex gap-8  rounded ${added ? "" : ""}`}>
        <div className="space-y-4 ">
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

        <div className="space-y-4 ">
          <Label htmlFor={id + `page$$`} className="text-lg text-white ">
            Css Selector
          </Label>
          <Input
            required
            type="text"
            className="text-xl placeholder:text-lg  placeholder:text-gray-400"
            placeholder="e.g. h1 > div"
            onChange={(e) => {
              setData({ ...data, selector: e.target.value });
            }}
            name="page$$"
            id={id + `page$$`}
          />
        </div>

        {/* Dropdown */}

        <div className="space-y-4 ">
          <Label htmlFor={id + `type`} className="text-lg text-white">
            Type
          </Label>
          <select
            onChange={(e) => {
              console.log(data);
              setData({ ...data, type: e.target.value });
            }}
            value={data.type}
            id={id + `type`}
            className="block rounded px-3 py-2  font-semibold  "
          >
            <option value="href">Link Url</option>
            <option value="textContent">Text Content</option>
          </select>
        </div>

        {/* filter */}
        <div className="space-y-4">
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
            icon={added ? "carbon:checkmark-filled" : "mdi:plus"}
            tabIndex={0}
            width={24}
            height={24}
            className={`bubble   rounded-md  p-0.5   ${added ? "test_color_mod2" : "test_color_mod1"}`}
            onClick={() => {
              setAdded(!added);
              dispatch({
                payload: data,
                type: "update",
                uuid,
              });
            }}
          />
          <Icon
            icon={"material-symbols:cancel"}
            tabIndex={0}
            width={24}
            height={24}
            className="bubble rounded-md bg-red-500 p-0.5"
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
