import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

export default Unauthorized = () => {

  const history = useHistory();

	return (
    <div className="content-unauthorized">
      <Row>
        <Col md={6} className="info">
          <h1 className="display-1">403</h1>
          <h2>¡OPPSSS! Sorry...</h2>
          <p>
          Lo sentimos, su acceso está denegado 
          por razones de seguridad de nuestro 
          servidor y también de nuestros datos 
          sensibles.
          Por favor, vuelva a la página anterior 
          para seguir navegando.
          </p>
          <Button
            type="button"
            variant="action"
            onClick={() => history.push('/')}
          >
            Inicio
          </Button>
        </Col>
        <Col md={6} />
        <ul className="bg-bubbles">
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
        </ul>
      </Row>
    </div>
	);
};
