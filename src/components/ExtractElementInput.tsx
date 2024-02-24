import { Input } from "@/components/ui/input";
import { Icon } from "@iconify-icon/react";
import { useState } from "react";
import { actionsType, reducerAction } from "../app/add/page";

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
};
function ExtractElementInput({ dispatch, uuid, state, disabled }: Props) {
  const [data, setData] = useState(initialState);
  const [added, setAdded] = useState(false);

  return (
    <fieldset
      disabled={disabled}
      className={`p-2 ${added && "bg-green-200/40"}`}
    >
      <div className={`flex gap-8 rounded ${added ? "" : ""}`}>
        <Input
          placeholder="name"
          className="basis-1/3 text-xl placeholder:text-xl placeholder:font-semibold"
          required
          type="text"
          name="selectorName"
          id="selectorName"
          onChange={(e) => {
            console.log(data);
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

        {/* Dropdown */}

        <select
          onChange={(e) => {
            console.log(data);
            setData({ ...data, type: e.target.value });
          }}
          value={`href`}
          id={uuid}
          className="text-lg font-semibold"
        >
          <option value="href">Link Url</option>
          <option value="textContent">Text Content</option>
        </select>

        {/* Buttons */}

        <div className="flex items-center justify-between gap-8 ">
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
            icon={"mdi:access-point"}
            tabIndex={0}
            width={24}
            height={24}
            className="bubble rounded-md bg-amber-200 p-0.5"
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
