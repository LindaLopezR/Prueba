import React from 'react';
import { Alert, Col, Row } from 'react-bootstrap';

import { renderOptions } from '/imports/ui/components/form/FormComponents';

import NavigationStep from '/imports/ui/components/buttons/NavigationStep';
import Steps from './Steps';

export default BehaviorStep = (props) => {

  const { qualitites, state } = props;

  const setBehaviors = () => {
    if (qualitites) {
      
      const data = qualitites.find(i => i._id == state.quality);
      return renderOptions(data.behaviors);
    }
  };

  return (
    <>
      <Steps {...props} />
      <Row>
        <Col xs={12}>
          <Alert variant="primary">
            <Alert.Heading className="text-center">
              ¿Qué comportamiento quieres reconocer?
            </Alert.Heading>
          </Alert>
        </Col>
        <Col xs={12}>
          <select
            className="form-select"
            name="behavior"
            value={props.getState('behavior', '')}
            onChange={props.handleChange}
          >
            <option></option>
            {setBehaviors()}
          </select>
        </Col>
      </Row>
      <NavigationStep {...props} valueItem={props.state.behavior} hidenBtn />
    </>
  );
};
