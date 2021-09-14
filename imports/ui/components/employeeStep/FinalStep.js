import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMedal } from '@fortawesome/free-solid-svg-icons';

import { getNameItem } from '/imports/ui/components/form/FormComponents'

import Steps from './Steps';

export default FinalStep = (props) => {
  const { qualitites, saveRecognition, state, users } = props;

  const qualitySelect = qualitites.filter(item => item._id == state.quality);

  return (
    <>
      <Steps {...props} />
      <Row>
        <Col xs={12} className="text-center">
          <h1 style={{color: qualitySelect[0].color}}>
            <FontAwesomeIcon
              icon={faMedal}
              color={qualitySelect[0].color}
            />
          </h1>
          <h3 style={{color: qualitySelect[0].color}}>
            <span>Reconocer a:{' '}</span>
            {getNameItem(state.owner, users)}
          </h3>
          <h3 style={{color: qualitySelect[0].color}}>
            <span>Por el valor de:{' '}</span>
            {getNameItem(state.quality, qualitites)}
          </h3>
          <h3 style={{color: qualitySelect[0].color}}>
            <span>Y el comportamiento de:{' '}</span>
            {state.behavior}
          </h3>
          <hr />
          <h3 style={{color: qualitySelect[0].color}}>{state.message && state.message}</h3>
        </Col>
        <Col xs={6} className="mt-3 text-star">
          <Button type="button" variant="outline-secondary" onClick={ props.prev }>
            Atrás
          </Button>
        </Col>
        <Col xs={6} className="mt-3 text-end">
          <Button
            type="submit"
            variant="success"
            onClick={() => saveRecognition(props.state)}
          >
            Generar reconocimiento
          </Button>
        </Col>
      </Row>
    </>
  );
};
