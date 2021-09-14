import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';

export default NavigationStep = (props) => {
  const { hidenBtn, valueItem } = props;
  const activeBtn = hidenBtn ? !valueItem  : false;

  return (
    <Row className="mt-3">
      <Col xs={6} className="text-star">
        <Button type="button" variant="outline-secondary" onClick={ props.prev }>
          Atrás
        </Button>
      </Col>
      <Col xs={6} className="text-end">
        <Button type="button" variant="teal" onClick={ props.next } disabled={activeBtn}>
          Siguiente
        </Button>
      </Col>
    </Row>
  );
};
