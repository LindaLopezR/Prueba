import React from 'react';
import { Badge } from 'react-bootstrap';
import { default as momenttz } from 'moment-timezone';

const timezone = Meteor.settings.public.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

export const dateFormatter = (cell, row, rowIndex, formatExtraData) => {
  if (!cell) return '--';
  return momenttz(cell).tz(timezone).format('ll')
};

export const orderCollection = (arrayCollection) => {
  return arrayCollection.sort(function (as, bs) {
    const rx = /(\d+)|(\D+)/g, rd = /\d+/;
    let a = as.name.toLowerCase().match(rx);
    let b = bs.name.toLowerCase().match(rx);
    while (a.length && b.length) {
      a1 = a.shift();
      b1 = b.shift();
      if (rd.test(a1) || rd.test(b1)) {
        if (!rd.test(a1)) return -1;
        if (!rd.test(b1)) return 1;
        if (a1 != b1) return (a1 - b1);
      } else if (a1 != b1) return ((a1 > b1) ? 1 : -1);
    }
    return a.length - b.length;
  })
}

export const orderItems = (items) => {
  return items.sort((a, b) => {
    if (a[1] < b[1]) return 1;
    if (a[1] > b[1]) return -1;
    return 0;
  });
}

export const recognitionColorStatus = (item) => {
  let color = '';
  switch(item) {
    case 'PENDIENT':
      color = 'primary';
      break;
    case 'APPROVED':
      color = 'success';
      break;
    case 'CANCELLED':
      color = 'danger';
      break;
    case 'DELIVERED':
      color = 'info';
      break;
    default:
      color = 'secondary';
      break;
  }
  return color;
};

export function textStatus(item) {
  let text = '';
  switch(item) {
    case 'PENDIENT':
      text = 'PENDIENTE';
      break;
    case 'APPROVED':
      text = 'APROBADO';
      break;
    case 'CANCELLED':
      text = 'CANCELADO';
      break;
    case 'DELIVERED':
      text = 'ENTREGADO';
      break;
    default:
      text = '--';
      break;
  }
  return text;
};

export const badgeStatus = (cell) => {
  const variant = recognitionColorStatus(cell);
  return (
    <center>
      <Badge pill variant={variant}>
        {textStatus(cell)}
      </Badge>
    </center>
  );
};
