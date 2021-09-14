import React, { useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { useAllActiveProducts } from '/imports/startup/client/hooks';
import { renderOptions } from '/imports/ui/components/form/FormComponents'

import LoadingView from '/imports/ui/components/loading/LoadingView';
import ConfirmModal from '/imports/ui/components/modals/ConfirmModal';
import TitleSection from '/imports/ui/components/pages/TitleSection';

export default NewRequirement = () => {

  const history = useHistory();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const [ loading, setLoading ] = useState(false);
  const [ showModal, setShowModal ] = useState(false);
  const [ titleModal, setTitleModal ] = useState('');
  const [ messageModal, setMessageModal ] = useState('');

  const { loading: loading1, allProducts } = useAllActiveProducts();

  const onSubmit = data => {

    setLoading(true);

    Meteor.call('newRequirement', data, function(error, result) {
      setLoading(false);
      if (error) {
        setTitleModal('Error');
        setMessageModal(error.reason);
        return setShowModal(true);
      }

      if (result) {
        history.goBack();
      };
    })
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
      <TitleSection title="Nuevo requerimiento" back={true} />
      <Form onSubmit={ handleSubmit(onSubmit) }>
        <Row>
          <Col xs={12}>
            <Card>
              <Card.Body>
                <Form.Group controlId="product">
                  <Form.Label>Producto</Form.Label>
                  <select
                    className="form-select"
                    {...register("product", { required: true })}
                  >
                    <option></option>
                    {renderOptions(allProducts)}
                  </select>
                  {errors.product && (<p className="text-danger font-weight-bold">
                    Selecciona un producto
                  </p>)}
                </Form.Group>
                <Form.Group className="mt-3" controlId="number">
                  <Form.Label>Cantidad</Form.Label>
                  <Form.Control 
                    type="number"
                    placeholder="Ejemplo: 123"
                    min="0"
                    {...register("number", { required: true })}
                  />
                  {errors.product && (<p className="text-danger font-weight-bold">
                    Introduce la cantidad a solicitar
                  </p>)}
                </Form.Group>
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
