import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { useCategoryById } from '/imports/startup/client/hooks';

import LoadingView from '/imports/ui/components/loading/LoadingView';
import ConfirmModal from '/imports/ui/components/modals/ConfirmModal';
import TitleSection from '/imports/ui/components/pages/TitleSection';

const MODES = {
  NEW: 'NEW',
  EDIT: 'EDIT'
};

const MODE_NAMES = {
  NEW: 'Nuevo',
  EDIT: 'Editar'
};

export default NewCategory = (props) => {

  const { mode } = props;
  const history = useHistory();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const [ loading, setLoading ] = useState(false);
  const [ name, setName ] = useState('');
  const [ showModal, setShowModal ] = useState(false);
  const [ titleModal, setTitleModal ] = useState('');
  const [ messageModal, setMessageModal ] = useState('');

  let category = null;

  if (mode === MODES.EDIT) {
    const { id } = useParams();
    const categoryData = useCategoryById(id);
    category = categoryData.category;
  }

  useEffect(() => {
   if (category) {
     const { name } = category;
     setName(name);
   }
  }, [category])

  const onSubmit = () => {

    const data = {
      name: name
    };

    setLoading(true);

    const callback = (error, result) => {
      setLoading(false);
      if (error) {
        setTitleModal('Error');
        setMessageModal(error.reason);
        return setShowModal(true);
      }

      if (result) {
        history.goBack();
      };
    };

    if (mode === MODES.NEW) {
      Meteor.call('newCategory', data, callback);
    } else if (mode === MODES.EDIT) {
      Meteor.call('editCategory', category._id, data, callback);
    }
  };

  if (loading) {
    return <LoadingView />;
  };

  const title = `${MODE_NAMES[mode]} categoría`;

  return (
    <section>
      <ConfirmModal 
        show={showModal}
        handleClose={() => setShowModal(false)}
        title={titleModal}
        message={messageModal}
      />
      <TitleSection title={title} back={true} />
      <Form onSubmit={ handleSubmit(onSubmit) }>
        <Row>
          <Col xs={12}>
            <Card>
              <Card.Body>
                <Form.Group controlId="name">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control 
                    type="text"
                    placeholder="Nombre"
                    value={name}
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
