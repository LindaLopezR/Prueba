import React from 'react';
import { Button, Modal, } from 'react-bootstrap';

export default ActionModal = props => {
  const { show, title = '', message = '', handleClose = () => {}, handleAction = () => {}, titleAction } = props;

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
        <p>
          {message}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={handleClose}>Cerrar</Button>
        <Button variant="action" onClick={handleAction}>{titleAction}</Button>
      </Modal.Footer>
    </Modal>
  );
};
