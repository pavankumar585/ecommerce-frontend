import ListGroup from "react-bootstrap/ListGroup";

export default function ListGroupContainer({
  items = [],
  propId = "_id",
  propName = "name",
  currentItem,
  onCurrentItemChange,
}) {
  return (
    <ListGroup>
      {items.map((item) => (
        <ListGroup.Item
          key={item[propId]}
          onClick={() => onCurrentItemChange(item)}
          className="clickable"
          active={currentItem[propId] === item[propId]}
        >
          {item[propName]}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}
