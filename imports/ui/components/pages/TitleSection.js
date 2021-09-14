import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import BackButton from '/imports/ui/components/buttons/BackButton';

export default TitleSection = props => {
  const { classes = null, title, back = false } = props;
  const history = useHistory();

  return (
    <Row>
      {back &&
        <Col xs={12} className="mb-3">
          <BackButton handleBack={() => history.goBack()} />
        </Col>
      }
      <Col xs={12} className={classes}>
        <h1>{title}</h1>
        <hr />
      </Col>
    </Row>
  );
};
