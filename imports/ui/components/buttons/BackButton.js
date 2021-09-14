import React from 'react';
import { Button, Col, Row, } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';

export default BackButton = props => {
  const { handleBack = () => {} } = props;

  return (
    <Row>
      <Col xs={12}>
        <Button variant="action" onClick={handleBack}>
          <FontAwesomeIcon icon={faArrowAltCircleLeft} />{' '}
          Atrás
        </Button>
      </Col>
    </Row>
  );
};
