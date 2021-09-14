import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

export default NotFound = () => {

  const history = useHistory();

	return (
    <div className="content-notFound">
      <Row>
        <Col md={6} className="info">
          <h1 className="display-1">404</h1>
          <h2>¡UH OH! Estás perdido.</h2>
          <p>
            La página que busca no existe.
            ¿Cómo ha llegado aquí? Es un misterio, 
            pero puede hacer clic en el botón de abajo
            para volver a la página principal.
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
