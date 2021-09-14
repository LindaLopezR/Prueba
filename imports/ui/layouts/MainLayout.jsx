import React from 'react';
import { Container } from 'react-bootstrap';
import NavbarResponsive from '../components/navbar/NavbarResponsive';

export default MainLayout = props => {
  const { user } = props;

  return (
    <div className="container-general">
      <NavbarResponsive user={user} />
      <Container>
        {props.children}
      </Container>
    </div>
  );
};
