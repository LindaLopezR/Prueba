import React from 'react';
import { Container, Dropdown, Image, Nav, Navbar, } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';

export default NavbarResponsive = (props) => {
  const { user } = props;

  const userName = user ? user.profile.name : '--';

  return (
    <Navbar fixed="top">
      <Container>
        <Navbar.Brand href="/">
          <Image src="/img/header-logo.svg" alt="Merit Medical logo"/>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Dropdown alignRight={true} className="drp-user">
            <Dropdown.Toggle variant={"link"} id="dropdown-user" className="text-decoration-none">
              <FontAwesomeIcon icon={faUser} className="mr-2" className="icon-mainColor" />{' '}
              {userName}
            </Dropdown.Toggle>
            <Dropdown.Menu alignRight className="profile-notification">
              <div className="pro-head">
                <Nav.Link href="/profile">
                  <FontAwesomeIcon icon={faUser} className="gray" />{' '}
                  Perfil
                </Nav.Link>
                <Nav.Link href="/signin" onClick={() => Meteor.logout()}>
                  <FontAwesomeIcon icon={faSignOutAlt} className="icon-mainColor" />{' '}
                  Salir
                </Nav.Link>
              </div>
            </Dropdown.Menu>
          </Dropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
