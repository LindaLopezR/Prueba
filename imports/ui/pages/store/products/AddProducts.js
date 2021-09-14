import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';

import { useAllCategories } from '/imports/startup/client/hooks';
import { renderOptions } from '/imports/ui/components/form/FormComponents';
import LoadingView from '/imports/ui/components/loading/LoadingView';
import ConfirmModal from '/imports/ui/components/modals/ConfirmModal';
import TitleSection from '/imports/ui/components/pages/TitleSection';

export default AddProducts = () => {

  const history = useHistory();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const [ loading, setLoading ] = useState(false);
  const [ files, setFiles ] = useState([]);
  const [ showModal, setShowModal ] = useState(false);
  const [ titleModal, setTitleModal ] = useState('');
  const [ messageModal, setMessageModal ] = useState('');

  const { loading: loading1, allCategories } = useAllCategories();

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
    },
    // maxFiles: 2,
  });
  
  const thumbs = files.map(file => (
    <div className="thumb" key={file.name}>
      <div className="thumbInner">
        <img
          src={file.preview}
          className="img-drag"
        />
      </div>
    </div>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  const saveProducts = (dataProduct) => {
    Meteor.call('newProduct', dataProduct, function(error, result) {
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
  }

  const onSubmit = data => {

    const dataProduct = data;
    dataProduct.img = files;

    setLoading(true);

    if (files.length < 1) {
      dataProduct.img = '';
      saveProducts(dataProduct);
    } else {
      let file = files[0];
      let upload = new Slingshot.Upload('imageUploads');

      upload.send(file, function (error, downloadUrl) {

        if (error) {
          setLoading(false);
          alert(`Error, ${error}`);
        } else {
          dataProduct.img = downloadUrl;
          saveProducts(dataProduct);
        }

      });
    }
    
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
      <TitleSection title="Agregar productos" back={true} />
      <Form onSubmit={ handleSubmit(onSubmit) }>
        <Row>
          <Col md={6}>
            <Card>
              <Card.Body>
                <Form.Group controlId="name">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control 
                    type="text"
                    defaultValue=""
                    placeholder="Nombre"
                    {...register("name", { required: true })}
                  />
                  {errors.name && <p className="mb-0 text-danger">* Nombre es requerido.</p>}
                </Form.Group>
                <Form.Group className="mt-3" controlId="description">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    style={{ height: '100px' }}
                    {...register("description")}
                  />
                </Form.Group>
                <Form.Group className="mt-3" controlId="category">
                  <Form.Label>Categoría</Form.Label>
                  <select className="form-select" {...register("category")}>
                    <option></option>
                    {renderOptions(allCategories)}
                  </select>
                </Form.Group>
                <Row className="mt-3">
                  <Form.Group as={Col} controlId="number">
                    <Form.Label>Piezas</Form.Label>
                    <Form.Control 
                      type="number"
                      placeholder="Ejemplo: 123"
                      min="0"
                      {...register("pieces", { required: true })}
                    />
                    {errors.product && (<p className="text-danger font-weight-bold">
                      Introduce el valor inicial de piezas
                    </p>)}
                  </Form.Group>

                  <Form.Group as={Col} controlId="points">
                    <Form.Label>Valor en puntos</Form.Label>
                    <Form.Control 
                      type="number"
                      placeholder="Ejemplo: 123"
                      min="0"
                      {...register("points", { required: true })}
                    />
                    {errors.product && (<p className="text-danger font-weight-bold">
                      Introduce el valor en puntos del producto
                    </p>)}
                  </Form.Group>
                </Row>
                <Row className="mt-3">
                  <Col xs={12}><hr /></Col>
                  <Form.Group as={Col} controlId="number">
                    <Form.Label>Enviar notificación cuando el producto llegue al mínimo de cantidad</Form.Label>
                    <Form.Control 
                      type="notificationInventory"
                      placeholder="Ejemplo: 123"
                      min="0"
                    />
                  </Form.Group>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} className="mt-3 mt-md-0">
            <Card>
              <Card.Body>
                <div {...getRootProps({className: 'dropzone'})}>
                  <input {...getInputProps()} />
                  <p>Arrastre y suelte la foto del producto aquí, o haga clic para seleccionarla</p>
                </div>
                {files.length > 0 && (
                  <div className="text-end" onClick={() => setFiles([])}>
                    <FontAwesomeIcon icon={faTimes} color="gray" />
                  </div>
                )}
                <aside className="thumbsContainer">
                  {thumbs}
                </aside>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col xs={12} className="text-end">
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
