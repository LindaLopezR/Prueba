import React, { useState } from 'react';
import { Button, Form, Image } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import LoadingView from '../../components/loading/LoadingView';
import ConfirmModal from '../../components/modals/ConfirmModal';

export default SignIn = () => {

  const [ admin, setAdmin ] = useState(true);
  const [ loading, setLoading] = useState(false);
  const [ showModal, setShowModal ] = useState(false);
  const [ titleModal, setTitleModal ] = useState('');
  const [ messageModal, setMessageModal ] = useState('');

  const history = useHistory();
  const { register, formState: { errors }, handleSubmit } = useForm();

  const formLogin = () => {
    return (
      <Form onSubmit={ handleSubmit(onSubmit) }>
        <Form.Group className="mb-3" controlId="noEmpleado">
          <Form.Label>Número de empleado</Form.Label>
          <Form.Control
            type="text"
            defaultValue=""
            placeholder="# Empleado"
            {...register("username", { required: true })}
          />
          {errors.username && (<p className="text-danger font-weight-bold">
            Introduce tu número de usuario
          </p>)}
        </Form.Group>
  
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            defaultValue=""
            placeholder="Contraseña"
            {...register("password", { required: true })}
          />
          {errors.password && (<p className="text-danger font-weight-bold">
            Introduce tu contraseña
          </p>)}
        </Form.Group>

        <div className="d-grid gap-2">
          <Button type="submit" variant="success">
            Entrar
          </Button>
        </div>
      </Form>
    );
  };

  const onSubmit = data => {

    const { username, password } = data;
    setLoading(true);

    Meteor.loginWithPassword(username, password, error => {

      if (error) {
        setLoading(false);
        setTitleModal('Error');
        setMessageModal(error.reason);
        return setShowModal(true);
      }

      // VALIDACIÓN DEPENDIENDO EL TIPO DE FORMULARIO
      const user = Meteor.user();
      const userRole = Meteor.roleAssignment.findOne({ 'user._id': user._id });

      if (!admin && (userRole.role._id == 'admin' || userRole.role._id == 'superadmin') 
      || admin && (userRole.role._id != 'admin' && userRole.role._id != 'superadmin')) {
        Meteor.logout();
        return alert('Error: Usuario no encontrado');
      }

      history.push('/');
    });
  };

  if (loading) {
    return <LoadingView />;
  }

  return (
    <div className="content-login">
      <ConfirmModal 
        show={showModal}
        handleClose={() => setShowModal(false)}
        title={titleModal}
        message={messageModal}
      />
      <div className="login">
        <div className="mx-auto text-center">
          <Image src="/img/logo.png" alt="Merit Medical logo"/>
          {admin && <h4 className="text-center">
            ADMINISTRADOR DE SISTEMA
          </h4>}
        </div>
        {formLogin()}
        <div>
          {/* <Button
            className="action-admin"
            onClick={() => setAdmin(!admin)}
            variant="teal"
          >
            {admin ? 'Usuario' : 'Admin'}
          </Button> */}
        </div>
      </div>
    </div>
  );
  
};
