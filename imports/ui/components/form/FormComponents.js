import React from 'react';

export const renderOptions = (collection) => {
  return collection.map((item, index) => (
    <option
      key={`item-${index}`}
      value={item._id ? item._id : item.name}
    >
      {item.profile ? item.profile.name : item.name}
    </option>
  ));
};

export const getNameItem = (item, collection) => {

  const dataItem = collection.find(i => i._id == item);

  if (dataItem.profile) {
    return dataItem ? dataItem.profile.name : '--';
  }

  return dataItem ? dataItem.name : '--';
};
