import React from 'react';
import { Button, Image, Table } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faTrash } from '@fortawesome/free-solid-svg-icons';

export default TableProducts = (props) => {

  const { products, deleteOption, deleteAction = () => {}} = props;

  const renderItems = (item, index) => {
    const img = item.img 
      ?  <figure className="img-cart">
          <Image
            src={item.img}
            decoding="async"
            roundedCircle
          />
        </figure>
      : <FontAwesomeIcon icon={faImage} color="gray" size="2x" />;

    return (
      <tr key={`item-${index}`}>
        <td>{img}</td>
        <td>{item.name}</td>
        {deleteOption && (
          <td className="text-center">
            <Button
              variant="outline-danger"
              onClick={() => deleteAction(item)}
            >
              <FontAwesomeIcon
                icon={faTrash}
                color="red"
              />
            </Button>
          </td>
        )}
        <td className="text-end">{item.points}</td>
      </tr>
    );
  }

  return (
    <Table className="cart-view" responsive>
      <thead>
        <tr>
          <th></th>
          <th>Producto</th>
          {deleteOption && <th></th>}
          <th className="text-end">Puntos</th>
        </tr>
      </thead>
      <tbody>
        {products.map(product => renderItems(product))}
      </tbody>
    </Table>
  );
}
