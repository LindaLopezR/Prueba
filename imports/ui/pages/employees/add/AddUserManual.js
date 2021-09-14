import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';

import LoadingComponent from '/imports/ui/components/loading/LoadingComponent';
import ConfirmModal from '/imports/ui/components/modals/ConfirmModal';

export default AddProducts = () => {

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const [ loading, setLoading ] = useState(false);
  const [ files, setFiles ] = useState([]);
  const [ showModal, setShowModal ] = useState(false);
  const [ titleModal, setTitleModal ] = useState('');
  const [ messageModal, setMessageModal ] = useState('');

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
    },
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

  const saveUser = (dataUser) => {
    Meteor.call('newUser', dataUser, function(error, result) {
      setLoading(false);
      if (error) {
        setTitleModal('Error');
        setMessageModal(error.reason);
        return setShowModal(true);
      }

      if (result) {
        reset();
        setFiles([]);
        setTitleModal('Éxito');
        setMessageModal('Nuevo contacto creado.');
        return setShowModal(true);
      };
    });
  }

  const onSubmit = data => {

    const dataUser = data;
    dataUser.numberEmployee = parseInt(data.username)

    setLoading(true);

    if (files.length < 1) {
      dataUser.img = '';
      saveUser(dataUser);
    } else {
      let file = files[0];
      let upload = new Slingshot.Upload('imageUploads');

      upload.send(file, function (error, downloadUrl) {

        if (error) {
          setLoading(false);
          alert(`Error, ${error}`);
        } else {
          dataUser.img = downloadUrl;
          saveUser(dataUser);
        }

      });
    }
  };

  if (loading) {
    return <LoadingComponent />;
  };

  return (
    <section>
      <ConfirmModal 
        show={showModal}
        handleClose={() => setShowModal(false)}
        title={titleModal}
        message={messageModal}
      />
      <Row>
        <Col md={12}>
          <hr />
        </Col>
      </Row>
      <Form onSubmit={ handleSubmit(onSubmit) }>
        <Row>
          <Col md={6}>
            <Card>
              <Card.Body>
                <Row>
                  <Col xs={12}>
                    <Form.Group controlId="number">
                      <Form.Label>Número de empleado</Form.Label>
                      <Form.Control 
                        type="number"
                        defaultValue=""
                        placeholder="Número"
                        {...register("username", { required: true })}
                      />
                      {errors.username && <p className="mb-0 text-danger">
                        * Número de empleado es requerido.
                      </p>}
                    </Form.Group>
                  </Col>
                  <Col xs={6} className="mt-3">
                    <Form.Group controlId="name">
                      <Form.Label>Nombre</Form.Label>
                      <Form.Control 
                        type="text"
                        defaultValue=""
                        placeholder="Nombre"
                        {...register("name", { required: true })}
                      />
                      {errors.name && <p className="mb-0 text-danger">
                        * Nombre es requerido.
                      </p>}
                    </Form.Group>
                  </Col>
                  <Col xs={6} className="mt-3">
                    <Form.Group controlId="lastName">
                      <Form.Label>Apellido</Form.Label>
                      <Form.Control 
                        type="text"
                        defaultValue=""
                        placeholder="Apellido"
                        {...register("lastName", { required: true })}
                      />
                      {errors.lastName && <p className="mb-0 text-danger">
                        * Apellido es requerido.
                      </p>}
                    </Form.Group>
                  </Col>
                  {/* <Col xs={6} className="mt-3">
                    <Form.Group controlId="department">
                      <Form.Label>Departamento</Form.Label>
                      <Form.Control 
                        type="text"
                        defaultValue=""
                        placeholder="Departamento"
                        {...register("department")}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={6} className="mt-3">
                    <Form.Group controlId="area">
                      <Form.Label>Área</Form.Label>
                      <Form.Control 
                        type="text"
                        defaultValue=""
                        placeholder="Área"
                        {...register("area")}
                      />
                    </Form.Group>
                  </Col> */}
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} className="mt-3 mt-md-0">
            <Card>
              <Card.Body>
                <div {...getRootProps({className: 'dropzone'})}>
                  <input {...getInputProps()} />
                  <p>Arrastre y suelte su foto de perdil aquí, o haga clic para seleccionarla</p>
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
            <Button type="submit" variant="success">
              Guardar
            </Button>
          </Col>
        </Row>
      </Form>
    </section>
  );
};
