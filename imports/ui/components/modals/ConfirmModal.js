import React from 'react';
import { Button, Modal, } from 'react-bootstrap';

export default ConfirmModal = props => {
  const { show, title = '', message = '', handleClose = () => {} } = props;

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
        <Button variant="action" onClick={handleClose}>OK</Button>
      </Modal.Footer>
    </Modal>
  );
};
