import React from 'react';
import { Alert, Col, Row } from 'react-bootstrap';

import { renderOptions } from '/imports/ui/components/form/FormComponents'

import NavigationStep from '/imports/ui/components/buttons/NavigationStep';
import Steps from './Steps';

export default QualityStep = (props) => {

  const { qualitites } = props;

  return (
    <>
      <Steps {...props} />
      <Row>
        <Col xs={12}>
          <Alert variant="primary">
            <Alert.Heading className="text-center">
              ¿Qué valor quieres reconocer?
            </Alert.Heading>
          </Alert>
        </Col>
        <Col xs={12}>
          <select
            className="form-select"
            name="quality"
            value={props.getState('quality', '')}
            onChange={props.handleChange}
          >
            <option></option>
            {renderOptions(qualitites)}
          </select>
        </Col>
      </Row>
      <NavigationStep {...props} valueItem={props.state.quality} hidenBtn />
    </>
  );
};
