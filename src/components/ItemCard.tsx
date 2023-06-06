import { Item } from "~/server/utils/Item";

const itemTypes = [
  "backgroundImage",
  "avatarBorder",
  "title",
  "money",
] as const;

const AddItemCard = () => {
  return (
    <form className="flex flex-1 flex-col gap-2 p-2">
      <input
        type="text"
        name="itemName"
        id="itemName"
        placeholder="Item name.."
      />
      <input type="text" name="itemSrc" id="itemSrc" placeholder="Item src.." />
      <input
        type="number"
        name="itemAmount"
        id="itemAmount"
        placeholder="Item amount.."
      />
      <input
        type="number"
        step="0.01"
        name="itemMultiplier"
        id="itemMultiplier"
        placeholder="Item multiplier.."
      />
      <select name="itemTypes" id="itemTypes">
        {itemTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
    </form>
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
  return (
    <article className="grid h-fit min-h-24 place-items-start overflow-hidden border-2 border-black font-medium">
      {type === "create" ? (
        <button className="h-full w-full" onClick={onClick}>
          +
        </button>
      ) : type === "add" ? (
        <AddItemCard />
      ) : (
        item?.name
      )}
    </article>
  );
};

export default ItemCard;
