import React, { useEffect } from 'react';
import { Button, Form, } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

export const Passwords = (props) => {

  const { handleSave = () => {} } = props;
  const { register, formState: { errors }, handleSubmit, reset } = useForm();

  return (
    <Form onSubmit={ handleSubmit(handleSave) }>
      <Form.Group className="mb-3" controlId="password">
        <Form.Label>Nueva contraseña</Form.Label>
        <Form.Control
          type="password"
          defaultValue=""
          placeholder="Contraseña"
          {...register("password", { required: true })}
        />
        {errors.password && (<p className="text-danger font-weight-bold">
          Introduce tu nueva contraseña
        </p>)}
      </Form.Group>

      <Form.Group className="mb-3" controlId="confirmPassword">
        <Form.Label>Confirmar contraseña</Form.Label>
        <Form.Control
          type="password"
          defaultValue=""
          placeholder="Confirmar contraseña"
          {...register("confirmPassword", { required: true })}
        />
        {errors.confirmPassword && (<p className="text-danger font-weight-bold">
          Confirma la contraseña
        </p>)}
      </Form.Group>
      <div className="text-end">
        <Button type="submit" variant="teal">
          Guardar
        </Button>
      </div>
    </Form>
  );
};