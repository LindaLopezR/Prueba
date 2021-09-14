import React, { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import * as XLSX from 'xlsx';

import LoadingComponent from '/imports/ui/components/loading/LoadingComponent';
import ConfirmModal from '/imports/ui/components/modals/ConfirmModal';

function actionUsers(data, method, ids) {

  data.map(i => {
    let dataUser = i;
    if (!ids) {
      dataUser = {
        username: i['Oracle ID'].toString(),
        name: i['Full Name'],
        img: '',
        numberEmployee: i['Oracle ID'],
      };
    }

    Meteor.call(method, dataUser, function(error, result) {
      if (error) {
        return alert(`Error, ${error.reason}`);
      }
    });
  });
}

export default ImportUsers = () => {

  const [ loading, setLoading ] = useState(false);
  const [ mdsSummary, setMdsSummary ] = useState(null);

  const [ showModal, setShowModal ] = useState(false);
  const [ titleModal, setTitleModal ] = useState('');
  const [ messageModal, setMessageModal ] = useState('');

  const loadFile = (e) => {
    setMdsSummary(null);

    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onload = function (e) {
      const data = e.target.result;
      const readedData = XLSX.read(data, {type: 'binary', cellDates: true });
      const wsname = readedData.SheetNames[0];
      const ws = readedData.Sheets[wsname];

      const dataParse = XLSX.utils.sheet_to_json(ws, {
        cellDates: true,
        raw: true,
        dateNF:'yyyy-mm-dd',
      });

      setLoading(true);

      Meteor.call('previewEmployees', dataParse, function(error, result) {
        setLoading(false);
        if (error) {
          setLoading(false);
          setTitleModal('Error');
          setMessageModal(error.reason || 'Error');
          return setShowModal(true);
        }
        
        if (result) {
          setLoading(false);
          setMdsSummary(result);
          console.log('Res => ', result);
        }
        
      });
    };
    reader.readAsBinaryString(file);
  };

  const createNewUsers = () => {
    const { data, dataUpdate, dataEliminate, countAlreadyExists, countToImport, countToEliminate } = mdsSummary;

    setLoading(true);

    countToImport > 0 && actionUsers(data, 'newUser');
    countAlreadyExists > 0 && actionUsers(dataUpdate);
    countToEliminate > 0 && actionUsers(dataEliminate, 'deleteEmployees', dataEliminate);

    setMdsSummary(null);
    setLoading(false);
  
    setTitleModal('Éxito');
    setMessageModal('Base de empleados actualizada.');
    return setShowModal(true);
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
    
      <Form>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Control
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            type="file"
            className="form-control form-control-sm"
            onChange={e => loadFile(e)}
          />
        </Form.Group>
        {mdsSummary && (
          <Row>
            <Col sm={6} md={4}>
              <h3 className="title-teal">
                <small>Total de usuarios en el archivo:{' '}</small>
                {mdsSummary.countTotal}
              </h3>
            </Col>
            <Col sm={6} md={4}>
              <h3 className="title-teal">
                <small>Total de usuarios nuevos:{' '}</small>
                {mdsSummary.countToImport}
              </h3>
            </Col>
            <Col sm={6} md={4}>
              <h3 className="title-teal">
                <small>Total de usuarios a actualizar:{' '}</small>
                {mdsSummary.countAlreadyExists}
              </h3>
            </Col>
            <Col sm={6} md={6}>
              <h3 className="title-teal">
                <small>Usuarios del sistema a eliminar:{' '}</small>
                {mdsSummary.countToEliminate}
              </h3>
            </Col>
            <Col xs={12} md={6}>
              {(mdsSummary.countToImport > 0 ||
                mdsSummary.countAlreadyExists > 0 ||
                mdsSummary.countToEliminate > 0) &&
                  <Button
                    type="button"
                    variant="action"
                    onClick={() => createNewUsers()}
                  >
                    Actualizar base de empleados
                  </Button>}
            </Col>
          </Row>
        )}
      </Form>
    </section>
  );
}
