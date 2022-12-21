import _ from "lodash";

export function paginate(items, pageNumber, pageSize) {
  const startIndex = (pageNumber - 1) * pageSize;

  return _(items).slice(startIndex).take(pageSize).value();
}

export function startIndex(pageNumber, pageSize, items) {
  return items.length === 0 ? 0 : (pageNumber - 1) * pageSize + 1;
}

export function endIndex(pageNumber, pageSize, items = []) {
  const endIndex = pageNumber * pageSize;

  return endIndex < items.length ? endIndex : items.length;
}
