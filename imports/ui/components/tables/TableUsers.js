import React, { useState } from 'react';
import { Button, Form, Table } from 'react-bootstrap';

import { getNameItem } from '/imports/ui/components/form/FormComponents';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

export default TableUsers = (props) => {

  const { users, changePassword = () => {}} = props;

  const [ pass, getPass ] = useState();

  const renderItems = (item, index) => {
    const img = item.img 
      ?  <figure className="img-cart">
          <Image
            src={item.img}
            decoding="async"
            roundedCircle
          />
        </figure>
      : <FontAwesomeIcon icon={faUserCircle} color="gray" size="2x" />;

    return (
      <tr key={`item-${index}`}>
        <td>{img}</td>
        <td>{item.username}</td>
        <td>{getNameItem(item._id, users)}</td>
        <td>
          <Form.Control
            type="password"
            name="password"
            placeholder="Contraseña"
            onChange={(e) => getPass(e.target.value)}
          />
        </td>
        <td>
          <Button
            variant="teal"
            onClick={() => changePassword(pass, item._id)}
          >
            Actualizar
          </Button>
        </td>
      </tr>
    );
  }

  return (
    <Table className="cart-view" responsive>
      <thead>
        <tr>
          <th></th>
          <th>#</th>
          <th>Empleado</th>
          <th>Contraseña</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {users.map((product, index) => renderItems(product, index))}
      </tbody>
    </Table>
  );
}
