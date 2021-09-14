import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { useInfoCompany } from '/imports/startup/client/hooks';

import LoadingView from '/imports/ui/components/loading/LoadingView';
import ConfirmModal from '/imports/ui/components/modals/ConfirmModal';
import TitleSection from '/imports/ui/components/pages/TitleSection';

export default SettingsRequirements = () => {

  const history = useHistory();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const [ loading, setLoading ] = useState(false);
  const [ email, setEmail ] = useState('');
  const [ name, setName ] = useState('');
  const [ showModal, setShowModal ] = useState(false);
  const [ titleModal, setTitleModal ] = useState('');
  const [ messageModal, setMessageModal ] = useState('');

  const { loading: loading1, companyInfo } = useInfoCompany();

  useEffect(() => {
    if (companyInfo) {
      setEmail(companyInfo.emailRequirements ? companyInfo.emailRequirements : '');
      setName(companyInfo.userRequirements ? companyInfo.userRequirements : '');
    }
  }, [companyInfo]);

  const onSubmit = () => {

    setLoading(true);

    const data = {
      email,
      name,
    }

    Meteor.call('settingsCompany', data, function(error, result) {
      setLoading(false);
      if (error) {
        setTitleModal('Error');
        setMessageModal(error.reason);
        return setShowModal(true);
      }

      if (result) {
        alert('Información actualizada');
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
      <TitleSection title="Ajustes" back={true} />
      <Form onSubmit={ handleSubmit(onSubmit) }>
        <Row>
          <Col xs={12}>
            <Card>
              <Card.Body>
                <Form.Group controlId="email">
                  <Form.Label>Correo para requerimientos de pedidos</Form.Label>
                  <Form.Control 
                    type="email"
                    value={email}
                    placeholder="example@example.com"
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="name" className="mt-3">
                  <Form.Label>A nombre de:</Form.Label>
                  <Form.Control 
                    type="text"
                    value={name}
                    placeholder=""
                    onChange={e => setName(e.target.value)}
                    required
                  />
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
