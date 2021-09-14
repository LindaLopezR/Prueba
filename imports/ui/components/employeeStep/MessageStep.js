import React from 'react';
import { Alert, Col, Form, Row } from 'react-bootstrap';

import NavigationStep from '/imports/ui/components/buttons/NavigationStep';
import Steps from './Steps';

export default MessageStep = (props) => {

  return (
    <>
      <Steps {...props} />
      <Row>
        <Col xs={12}>
          <Alert variant="primary">
            <Alert.Heading className="text-center">
              Escribele un mensaje personal
            </Alert.Heading>
          </Alert>
          <Form.Control
            as="textarea"
            placeholder="Describe el motivo de la asignación de este reconocimeinto."
            style={{ height: '100px' }}
            name="message"
            value={props.getState('message', '')}
            onChange={props.handleChange}
          />
        </Col>
      </Row>
      <NavigationStep {...props} valueItem={props.state.message} hidenBtn />
    </>
  );
};
