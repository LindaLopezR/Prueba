import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';

import { useHistory, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { useInventoryById } from '/imports/startup/client/hooks';

import LoadingView from '/imports/ui/components/loading/LoadingView';
import ConfirmModal from '/imports/ui/components/modals/ConfirmModal';
import TitleSection from '/imports/ui/components/pages/TitleSection';

export default EditInventory = (props) => {

  const history = useHistory();
  const { id } = useParams();
  const { handleSubmit } = useForm();

  const [ loading, setLoading ] = useState(false);

  const [ showModal, setShowModal ] = useState(false);
  const [ titleModal, setTitleModal ] = useState('');
  const [ messageModal, setMessageModal ] = useState('');
  const [ pieces, setPieces ] = useState(0);

  const { loading: loading1, inventory, orders } = useInventoryById(id)

  useEffect(() => {
    if (inventory) {
      setPieces(inventory.pieces);
      setLoading(false);
    }
  }, [inventory]);

  const onSubmit = () => {
    const json = {
      pieces,
      inventoryId: inventory._id
    }

    setLoading(true);

    Meteor.call('editInventory', json, (error, result) => {
      setLoading(false);
      if (error) {
        setTitleModal('Error');
        setMessageModal(error.reason);
        return setShowModal(true);
      }

      if (result) {
        history.goBack();
      };
    });
  };

  if (loading || loading1) {
    return <LoadingView />;
  };

  return (
    <section>
      <ConfirmModal 
        show={showModal}
        handleClose={() => setShowModal(false)}
        title={titleModal}
        message={messageModal}
      />
      <TitleSection title="Editar inventario" back={true} />
      <Form onSubmit={ handleSubmit(onSubmit) }>
        <Row>
          <Col xs={12}>
            <Card>
              <Card.Body>
                <Row className="mb-3">
                  <Form.Group
                    as={Col}
                    xs={10}
                    md={11}
                    controlId="name"
                  >
                    <Form.Label>Piezas:</Form.Label>
                    <Form.Control 
                      type="number"
                      value={pieces}
                      placeholder="Piezas en existencia"
                      onChange={e => setPieces(e.target.value)}
                      min={0}
                      required
                    />
                  </Form.Group>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} className="text-end mt-3">
            <hr />
            <Button
              variant="outline-secondary"
              className="mr-1"
              onClick={() => history.goBack()}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="success">
              Guardar
            </Button>
          </Col>
        </Row>
      </Form>
    </section>
  );
};
