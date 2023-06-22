import { Item } from "~/server/utils/Item";
import { newItemsState } from "./profile/state/newItemsState";
import { useSetRecoilState, useRecoilValue } from "recoil";
import Button from "./ui/Button";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { api } from "~/utils/api";

const itemTypes = [
  "backgroundImage",
  "avatarBorder",
  "title",
  "money",
] as const;

const ShowItemCard = ({ item }: { item: Item }) => {
  const deleteItem = api.collection.deleteItemFromCollection.useMutation();

  const handleDeleteItem = (itemId: string) => {
    // TODO: add confirm modal here
    deleteItem.mutate({ itemId });
  };

  return (
    <>
      {item.src ? (
        <Image
          alt={item.name}
          src={item.src}
          fill={true}
          sizes="max-width: 100%"
          className="absolute"
        />
      ) : (
        <p className="place-self-center">{item.name}</p>
      )}
      <section className="absolute right-2 top-1 flex gap-2">
        <Button variant="icon" onClick={() => handleDeleteItem(item.itemId)}>
          <FontAwesomeIcon icon={faTrash} />
        </Button>
      </section>
    </>
  );
};

const AddItemCard = ({ itemId }: { itemId: string }) => {
  const newItemsList = useRecoilValue(newItemsState);
  const setNewItemsState = useSetRecoilState(newItemsState);

  const currentItem = newItemsList.find((item) => item.itemId === itemId);

  const updateNewItemsState = (property: string, value: string | number) => {
    if (currentItem) {
      setNewItemsState((itemsFromState) =>
        itemsFromState.map((item) => {
          if (item.itemId === itemId) {
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
        type="file"
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
  itemId?: string;
  type: "create" | "add" | "show";
  onClick?: () => void;
}) => {
  return (
    <article className="relative grid min-h-24 place-items-center overflow-hidden border-2 border-black font-medium">
      {type === "create" ? (
        <Button variant="default" className="h-full w-full" onClick={onClick}>
          +
        </Button>
      ) : type === "add" && itemId ? (
        <AddItemCard itemId={itemId} />
      ) : (
        //TODO: make this show the item and add delete & update to it (use "p" that can be edited)
        item && <ShowItemCard item={item} />
      )}
    </article>
  );
};

export default ItemCard;
