import { Item } from "~/server/utils/Item";
import { newItemsState } from "./profile/state/newItemsState";
import { useSetRecoilState, useRecoilValue } from "recoil";

const itemTypes = [
  "backgroundImage",
  "avatarBorder",
  "title",
  "money",
] as const;

const AddItemCard = ({ itemId }: { itemId: number }) => {
  const newItemsList = useRecoilValue(newItemsState);
  const setNewItemsState = useSetRecoilState(newItemsState);

  const currentItem = newItemsList.find((item) => item.id === itemId);

  const updateNewItemsState = (property: string, value: string | number) => {
    if (currentItem) {
      setNewItemsState((itemsFromState) =>
        itemsFromState.map((item) => {
          if (item.id === itemId) {
            return {
              ...item,
              [property]: value,
            };
          }
          return item;
        })
      );
    }
  };

  return (
    <div className="flex w-full flex-1 flex-col gap-2 p-2" id="addItemForm">
      <input
        type="text"
        name="itemName"
        id="itemName"
        placeholder="Item name.."
        value={currentItem?.name}
        onChange={(e) => updateNewItemsState("name", e.target.value)}
        required
      />
      <input
        type="text"
        name="itemSrc"
        id="itemSrc"
        placeholder="Item src.."
        value={currentItem?.src}
        onChange={(e) => updateNewItemsState("src", e.target.value)}
      />
      <input
        type="number"
        name="itemAmount"
        id="itemAmount"
        placeholder="Item amount.."
        value={currentItem?.amount}
        onChange={(e) => updateNewItemsState("amount", e.target.value)}
      />
      <input
        type="number"
        step="0.01"
        name="itemMultiplier"
        id="itemMultiplier"
        placeholder="Item multiplier.."
        value={currentItem?.multiplier}
        onChange={(e) => updateNewItemsState("multiplier", e.target.value)}
      />
      <select
        name="itemTypes"
        id="itemTypes"
        value={currentItem?.type}
        onChange={(e) => updateNewItemsState("type", e.target.value)}
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
  itemId,
  type,
  onClick,
}: {
  item?: Item;
  itemId?: number;
  type: "create" | "add" | "show";
  onClick?: () => void;
}) => {
  return (
    <article className="grid h-fit min-h-24 place-items-center overflow-hidden border-2 border-black font-medium">
      {type === "create" ? (
        <button className="h-full w-full" onClick={onClick}>
          +
        </button>
      ) : type === "add" && itemId ? (
        <AddItemCard itemId={itemId} />
      ) : (
        //TODO: make this show the item and add delete & update to it (use "p" that can be edited)
        item?.name
      )}
    </article>
  );
};

export default ItemCard;
