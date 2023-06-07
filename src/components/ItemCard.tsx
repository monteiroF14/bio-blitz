import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Item } from "~/server/utils/Item";

const itemTypes = [
  "backgroundImage",
  "avatarBorder",
  "title",
  "money",
] as const;

const AddItemCard = ({
  itemName,
  setItemName,
  itemSrc,
  setItemSrc,
  itemAmount,
  setItemAmount,
  itemMultiplier,
  setItemMultiplier,
  itemType,
  setItemType,
}: {
  itemName: string;
  setItemName: Dispatch<SetStateAction<string>>;
  itemSrc: string;
  setItemSrc: Dispatch<SetStateAction<string>>;
  itemAmount: number;
  setItemAmount: Dispatch<SetStateAction<number>>;
  itemMultiplier: number;
  setItemMultiplier: Dispatch<SetStateAction<number>>;
  itemType: string;
  setItemType: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <div className="flex w-full flex-1 flex-col gap-2 p-2" id="addItemForm">
      <input
        type="text"
        name="itemName"
        id="itemName"
        placeholder="Item name.."
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        required
      />
      <input
        type="text"
        name="itemSrc"
        id="itemSrc"
        placeholder="Item src.."
        value={itemSrc}
        onChange={(e) => setItemSrc(e.target.value)}
      />
      <input
        type="number"
        name="itemAmount"
        id="itemAmount"
        placeholder="Item amount.."
        value={itemAmount}
        onChange={(e) => setItemAmount(Number.parseInt(e.target.value))}
      />
      <input
        type="number"
        step="0.01"
        name="itemMultiplier"
        id="itemMultiplier"
        placeholder="Item multiplier.."
        value={itemMultiplier}
        onChange={(e) => setItemMultiplier(Number.parseInt(e.target.value))}
      />
      <select
        name="itemTypes"
        id="itemTypes"
        value={itemType}
        onChange={(e) => setItemType(e.target.value)}
        required
      >
        {itemTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
    </div>
  );
};

const ItemCard = ({
  item,
  type,
  onClick,
}: {
  item?: Item;
  type: "create" | "add" | "show";
  onClick?: () => void;
}) => {
  const [itemName, setItemName] = useState("");
  const [itemSrc, setItemSrc] = useState("");
  const [itemAmount, setItemAmount] = useState(0);
  const [itemMultiplier, setItemMultiplier] = useState(0);
  const [itemType, setItemType] = useState("");

  useEffect(() => {
    setItemName("pedro");
  }, []);

  return (
    <article className="grid h-fit min-h-24 place-items-center overflow-hidden border-2 border-black font-medium">
      {type === "create" ? (
        <button className="h-full w-full" onClick={onClick}>
          +
        </button>
      ) : type === "add" ? (
        <AddItemCard
          itemName={itemName}
          setItemName={setItemName}
          itemSrc={itemSrc}
          setItemSrc={setItemSrc}
          itemAmount={itemAmount}
          setItemAmount={setItemAmount}
          itemMultiplier={itemMultiplier}
          setItemMultiplier={setItemMultiplier}
          itemType={itemType}
          setItemType={setItemType}
        />
      ) : (
        item?.name
      )}
    </article>
  );
};

export default ItemCard;
