import React, { useState } from 'react';
import { Card, Col, Row, Tab, Tabs } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import BackButton from '/imports/ui/components/buttons/BackButton';
import LoadingView from '/imports/ui/components/loading/LoadingView';
import Password from './password/Password';
import TitleSection from '/imports/ui/components/pages/TitleSection';

export default ListCategories = (props) => {

  const [ loading, setLoading ] = useState(false);
  const [ key, setKey ] = useState('password');
  const history = useHistory();

  if (loading) {
    return <LoadingView />;
  };

  return (
    <section>
      <TitleSection classes="mt-3" title="Perfil" />
      <Row>
        <Col xs={12} className="mb-3">
          <BackButton handleBack={() => history.goBack()} />
        </Col>
        <Col md={3}>
          <UserCard user={props.userId} />
        </Col>
        <Col md={9}>
          <Card>
            <Card.Body>
            <Tabs
              id="controlled-profile"
              activeKey={key}
              onSelect={(k) => setKey(k)}
              className="mb-3"
            >
              <Tab eventKey="password" title="Contraseña">
                <Password
                  user={props.userId}
                />
              </Tab>
            </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </section>
  );
};
