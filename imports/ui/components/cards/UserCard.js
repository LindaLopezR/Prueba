import React, { useEffect, useState } from 'react';
import { Card, Col, Image, Row, } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

import { useAllUsers } from '/imports/startup/client/hooks';

import LoadingComponent from '/imports/ui/components/loading/LoadingComponent';

export default UserCard = (props) => {

  const { color, user } = props;
  const [ image, setImage ] = useState('');
  const [ userLabel, setUserLabel ] = useState('User');
  const [ numberEmp, setNumberEmp ] = useState('0000');

  const { loading, allUsers } = useAllUsers();
  const { designCol } = props;

  useEffect(() => {
    if (user && allUsers) {
      const userData = allUsers.find(i => i._id == user);
      setImage(userData.profile.image);
      setNumberEmp(userData.username);
      setUserLabel(userData.profile.name);
    }
  }, []);

  if (loading) {
    return <LoadingComponent />;
  };

  const colCard1 = designCol ? 3 : 12;
  const colCard2 = designCol ? 9 : 12;
  const colorIcon = color ? color : '#c8b682';

  return (
    <Card className="text-center">
      <Card.Body>
        <Row>
          <Col xs={12} md={colCard1}>
            {image
              ? <figure className="img-user">
                <Image
                  src={image}
                  alt="Imagen de usuario"
                  decoding="async"
                  roundedCircle
                />
              </figure>
              : <FontAwesomeIcon
                  icon={faUserCircle}
                  size="6x"
                  color={colorIcon}
                />
            }
          </Col>
          <Col xs={12} md={colCard2}>
            <h3
              className="mt-2"
              style={{color: color}}
            >
              {userLabel}
            </h3>
            <hr />
            <p>
              {numberEmp}
            </p>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};
