import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { faUsers } from '@fortawesome/free-solid-svg-icons';

import LoadingView from '/imports/ui/components/loading/LoadingView';
import ConfirmModal from '/imports/ui/components/modals/ConfirmModal';
import TableUsers from '/imports/ui/components/tables/TableUsers';
import TitleSection from '/imports/ui/components/pages/TitleSection';

export default EmployeesPasswords = () => {

  const [ loading, setLoading ] = useState(false);
  const [ employee, seyEmployee ] = useState('');
  const [ userName, setUserName ] = useState('');
  const [ showModal, setShowModal ] = useState(false);
  const [ titleModal, setTitleModal ] = useState('');
  const [ messageModal, setMessageModal ] = useState('');
  const [ allEmployees, setEmployees ] = useState([]);

  const handleFilter = () => {
    const filters = {
      employee,
      userName
    };

    setLoading(true);

    Meteor.call('searchEmployee', filters, function(error, result) {
      setLoading(false);

      if (error) {
        return alert(`Error, ${error}`);
      }

      if (result) {
        setEmployees(result);
      } 
    })
  };

  useEffect(() => {
    handleFilter();
  }, []);

  const changePassword = (password, userId) => {
    setLoading(true);

    let data = {
      userId,
      newPassword : password
    };

    Meteor.call('setNewPassword', data, function(error, result){

      setLoading(false);

      if (error) {
        setTitleModal('Error');
        setMessageModal(error.reason);
        return setShowModal(true);
      } else if (result) {
        setTitleModal('Éxito');
        setMessageModal('Contraseña actualizada.');
        return setShowModal(true);
      }

    });
  };

  if (loading) {
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
      <TitleSection title="Administrar contraseñas" back={true} />
      <Form>
        <Row>
          <Col md={4}>
            <Form.Group controlId="noEmpleado">
              <Form.Label>Número de empleado</Form.Label>
              <Form.Control
                type="number"
                value={employee}
                placeholder="# Empleado"
                onChange={(e) => seyEmployee(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4} className="mt-3 mt-md-0">
            <Form.Group controlId="owner">
              <Form.Label>Por nombre</Form.Label>
              <Form.Control
                type="text"
                value={userName}
                placeholder="Nombre"
                onChange={(e) => setUserName(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <p className="mb-1">&nbsp;</p>
            <Button variant="teal" onClick={ handleFilter }>
              Buscar
            </Button>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col xs={12}>
            <Card className="card-employees-passwords">
              <Card.Body>
                {allEmployees.length > 0
                  ? <TableUsers
                      users={allEmployees}
                      changePassword={(passsword, userId) => changePassword(passsword, userId)}
                    />
                  : <NoData icon={faUsers} title="Sin empleados" />
                }
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Form>
    </section>
  );
};
