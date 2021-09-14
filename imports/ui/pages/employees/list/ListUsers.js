import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

import LoadingComponent from '/imports/ui/components/loading/LoadingComponent';
import ConfirmModal from '/imports/ui/components/modals/ConfirmModal';

const columns = [
  {
    dataField: 'name',
    text: 'Nombre',
    formatter: (cell, row) => {
      const owner = row.profile.name;
      return (
        <center>
          {owner}
        </center>
      )
    }
  }, {
    dataField: 'numberEmployee',
    text: 'Número de empleado',
    formatter: (cell, row) => {
      const number = row.profile.numberEmployee;
      return (
        <center>
          {number}
        </center>
      )
    }
  }
];

const selectRow = {
  mode: 'checkbox',
  clickToSelect: true,
  classes: 'selection-row'
};

export default ListUsers = () => {

  const [ employee, seyEmployee ] = useState('');
  const [ userName, setUserName ] = useState('');
  const [ loading, setLoading ] = useState(false);
  const [ users , setUsers ] = useState([]);
  const [ showModal, setShowModal ] = useState(false);
  const [ titleModal, setTitleModal ] = useState('');
  const [ messageModal, setMessageModal ] = useState('');

  const searchItem = () => {
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
        setUsers(result);
      } 
    });
  };

  useEffect(() => {
    searchItem();
  }, []);

  const handleGetSelectedData = () => {
    const deleteUsers = node.selectionContext.selected;

    setLoading(true);

    deleteUsers.map(userId => {
      Meteor.call('deleteEmployees', userId, function(error, result) {
        setLoading(false);
        if (error) {
          setTitleModal('Error');
          setMessageModal(error.reason);
          return setShowModal(true);
        }
        if (result) {
          return searchItem();
        }
      });
    });
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
      <Row>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Form>
                <Form.Group controlId="noEmpleado">
                  <Form.Label>Número de empleado</Form.Label>
                  <Form.Control
                    type="number"
                    value={employee}
                    placeholder="# Empleado"
                    onChange={(e) => seyEmployee(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="owner">
                  <Form.Label>Por nombre</Form.Label>
                  <Form.Control
                    type="text"
                    value={userName}
                    placeholder="Nombre"
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </Form.Group>
                <div className="text-end mt-3">
                  <hr />
                  <Button
                    variant="success"
                    onClick={() => searchItem()}
                  >
                    Buscar
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mt-3 mt-md-0">
          <Alert variant="primary">
            <Alert.Heading>
              Total: {''}
              {users.length}
            </Alert.Heading>
          </Alert>
          {users.length > 0 && (
            <Card>
              <Card.Body>
                <div className="table-responsive">
                  <BootstrapTable
                    ref={ n => node = n }
                    keyField='_id'
                    data={ users }
                    columns={ columns }
                    pagination={paginationFactory()}
                    striped
                    condensed
                    selectRow={ selectRow }
                  />
                </div>
                <div className="text-end">
                  <Button variant="teal" onClick={ handleGetSelectedData }>
                    Eliminar usuarios seleccionadas
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </section>
  );
};
