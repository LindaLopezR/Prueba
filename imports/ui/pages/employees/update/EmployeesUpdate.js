import React, { useState } from 'react';
import { Card, Col, Form, Row } from 'react-bootstrap';

import TitleSection from '/imports/ui/components/pages/TitleSection';

import AddUserManual from '../add/AddUserManual';
import ImportUsers from '../add/ImportUsers';
import ListUsers from '../list/ListUsers';

export default EmployeesUpdate = () => {

  const [ actionManual, setActionManual ] = useState(null);
  const [ actionType, setActionType ] = useState('manual')

  return (
    <section>
      <TitleSection title="Actualizar base de empleados" back={true} />
      <Row>
        <Col xs={12}>
          <Card>
            <Card.Body>
              <Card.Title>
                <Form.Check 
                  type="radio"
                  label="Manual"
                  name="type"
                  value="manual"
                  checked={actionType === 'manual'}
                  onChange={() => setActionType('manual')}
                />
              </Card.Title>
              {actionType == "manual" && (
                <>
                  <div className="form-check form-check-inline">
                    <Form.Check 
                      type="radio"
                      label="Agregar empleado"
                      name="actionManual"
                      value="addUser"
                      checked={actionManual === 'addUser'}
                      onChange={() => setActionManual('addUser')}
                    />
                  </div>
                  <div className="form-check form-check-inline">
                    <Form.Check 
                      type="radio"
                      label="Remover empleado"
                      name="actionManual"
                      value="deleteUser"
                      checked={actionManual === 'deleteUser'}
                      onChange={() => setActionManual('deleteUser')}
                    />
                  </div>
                  { actionManual === 'addUser' && <AddUserManual /> }
                  { actionManual === 'deleteUser' && <ListUsers /> }
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} className="mt-3">
          <Card>
            <Card.Body>
              <Card.Title>
                <Form.Check 
                  type="radio"
                  label="Importar archivo"
                  name="type"
                  value="import"
                  checked={actionType === 'import'}
                  onChange={() => setActionType('import')}
                />
              </Card.Title>
              {actionType == "import" && (
                <ImportUsers />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </section>
  );
};
