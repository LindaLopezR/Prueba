import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';

import Steps from '../employeeStep/Steps';

export default OrderData = (props) => {

  const { userId, users } = props;
  const [ user, getUser ] = useState({name:'user'});

  useEffect(() => {
    if (userId) {
      const data = users.find(i => i._id == userId);
      getUser(data.profile);
    }
  }, []);

  return (
    <>
      <Steps {...props} />
      <Row>
        <Col xs={12}>
          <hr />
        </Col>
        <Col xs={12} className="mt-3 mb-3">
          <Form.Group controlId="name">
            <Form.Label>Nombre</Form.Label>
            <Form.Control 
              type="text"
              placeholder="Nombre"
              name="name"
              value={props.getState('name', user.name)}
              onChange={props.handleChange}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className="mt-3">
      <Col xs={6} />
      <Col xs={6} className="text-end">
        <Button type="button" variant="teal" onClick={ props.next }>
          Siguiente
        </Button>
      </Col>
    </Row>
    </>
  );
};
