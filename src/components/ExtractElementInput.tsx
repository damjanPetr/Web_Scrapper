import { Input } from "@/components/ui/input";
import { Icon } from "@iconify-icon/react";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectItem } from "@radix-ui/react-select";
import { useState } from "react";
import { reducerAction } from "../app/add/page";

function ExtractElementInput({
  dispatch,
}: {
  dispatch: (arg: reducerAction) => void;
}) {
  const [data, setData] = useState({
    name: "",
    selector: "",
    type: "",
  });
  const [loading, setLoading] = useState(false);
  return (
    <div className="p-2 ">
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
            setData({ ...data, name: e.target.value });
          }}
        />
        <Input
          required
          type="text"
          className="text-xl placeholder:text-xl placeholder:font-semibold"
          placeholder="selector"
          onChange={(e) => {
            setData({ ...data, selector: e.target.value });
          }}
          name="page$$"
          id="page$$"
        />
        <Select
          defaultValue="href"
          onValueChange={(e) => {
            setData({ ...data, type: e });
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
        <div className="flex items-center justify-between gap-8 ">
          <Icon
            icon={"mdi:plus"}
            width={24}
            height={24}
            className="bubble rounded-md bg-green-200 p-0.5"
            onClick={() => {
              dispatch({ type: "remove", name: data.name });
            }}
          />
          <Icon
            icon={"mdi:access-point"}
            width={24}
            height={24}
            className="bubble rounded-md bg-amber-200 p-0.5"
            onClick={() => {
              dispatch({ type: "remove", name: data.name });
            }}
          />
        </div>
      </fieldset>
    </div>
  );
}
export default ExtractElementInput;
