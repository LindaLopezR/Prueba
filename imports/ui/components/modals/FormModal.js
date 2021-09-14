import React, { useEffect, useState } from 'react';
import { Button, Form, Modal, } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

export default FormModal = props => {
  const { show, title = '', message = '', handleClose = () => {}, handleAction = () => {}, titleAction, value } = props;

  const [ valueDefault, setValueDefault ] = useState(0);

  useEffect(() => {
    if (value) {
      setValueDefault(parseInt(value));
    } else {
      setValueDefault(0);
    }
  }, [value]);

  return (
    <Modal
      show={show}
      onHide={handleClose}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message}
        <Form>
          <Form.Group className="mb-3" controlId="points">
            <Form.Control 
              type="number"
              placeholder="Ejemplo: 123"
              min="0"
              value={valueDefault}
              onChange={e => setValueDefault(e.target.value)}
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={handleClose}>Cerrar</Button>
        <Button variant="action" onClick={ () => handleAction(valueDefault) }>{titleAction}</Button>
      </Modal.Footer>
    </Modal>
  );
};
