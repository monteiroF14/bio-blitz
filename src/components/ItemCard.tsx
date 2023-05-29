import { Item } from "~/server/utils/Item";

const ItemCard = ({ item }: { item: Item }) => {
  return <p className="h-24">{item.name}</p>;
};

export default ItemCard;
