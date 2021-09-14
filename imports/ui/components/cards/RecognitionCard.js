import React from 'react';
import { Card, Col, Row, } from 'react-bootstrap';

import { dateFormatter } from '/imports/ui/pages/utils/formatters';
import { getNameItem } from '/imports/ui/components/form/FormComponents';

import UserCard from './UserCard';

export default RecognitionCard = (props) => {
  const { data, qualitites } = props;

  const qualitySelect = qualitites.filter(item => item._id == data.quality);

  return (
    <Card className="text-center">
      <Card.Body>
        <h3 style={{color: qualitySelect[0].color}}>Tarjeta de Reconocimiento No. {data.number}</h3>
        <Row>
          <Col md={4}>
            <UserCard
              user={data.username}
              color={qualitySelect[0].color}
            />
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body>
                Por poner en práctica el valor:{' '}
                <strong style={{color: qualitySelect[0].color}}>
                  {getNameItem(data.quality, qualitites)} y 
                  practicar {data.behavior}
                </strong>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body>
                {data.message}
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <UserCard
              user={data.owner}
              color={qualitySelect[0].color}
            />
          </Col>
        </Row>
        <Row className="mt-3">
          <Col md={12} className="text-start">
            <h5 style={{color: qualitySelect[0].color}}>
              {dateFormatter(data.date)}
            </h5>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};
