import React, { useEffect, useState } from 'react';
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

import LoadingComponent from '/imports/ui/components/loading/LoadingComponent';
import Steps from './Steps';

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
  }
];

export default EmployeeStep = (props) => {

  const [ employee, seyEmployee ] = useState('');
  const [ userName, setUserName ] = useState('');
  const [ loading, setLoading ] = useState(false);
  const [ users, setUsers ] = useState([]);

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
        setUsers(result);
      } 
    })
  };

  useEffect(() => {
    handleFilter();
  }, [])

  const selectRow = {
    mode: 'radio',
    clickToSelect: true,
    selected: [1],
    classes: 'selection-row',
    selectionRenderer: ({ mode, checked, ...rest }) => {
      let checkedItem = rest.checked;
      if (props.state.owner) {
        checkedItem = props.state.owner == rest.rowKey;
      }
      return (
        <input
          type={mode}
          checked={checkedItem}
          name="owner"
          value={props.getState('owner', rest.rowKey)}
          onChange={props.handleChange}
          { ...rest }
        />
      )
    }
  };

  const userId = Meteor.userId();
  const usersList = users.filter(user => user._id != userId);

  if (loading) {
    return <LoadingComponent />;
  };

  return (
    <>
      <Steps {...props} />
      <Row>
        <Col xs={12}>
          <Alert variant="primary">
            <Alert.Heading className="text-center">
              ¿A quién quieres reconocer?
            </Alert.Heading>
          </Alert>
        </Col>
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
        <Col xs={12}><hr /></Col>
        <Col xs={12}>
          {usersList.length > 0 && (
            <>
              <p>Selecciona al empleado a reconocer: </p>
              <div className="table-responsive">
                <BootstrapTable
                  ref={ n => node = n }
                  keyField="_id"
                  data={ usersList }
                  columns={ columns }
                  pagination={paginationFactory()}
                  selectRow={ selectRow }
                  condensed
                  striped
                />
              </div>
              <div className="text-end">
                <Button
                  type="button"
                  variant="teal"
                  onClick={ props.next }
                  disabled={!props.state.owner}
                >
                  Siguiente
                </Button>
              </div>
            </>
          )}
        </Col>
      </Row>
    </>
  );
};
