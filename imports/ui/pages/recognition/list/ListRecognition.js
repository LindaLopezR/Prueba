import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

import { useAllQualities, useAllUsers } from '/imports/startup/client/hooks';
import { dateFormatter } from '/imports/ui/pages/utils/formatters';
import { getNameItem, renderOptions } from '/imports/ui/components/form/FormComponents';

import LoadingView from '/imports/ui/components/loading/LoadingView';
import ConfirmModal from '/imports/ui/components/modals/ConfirmModal';
import TitleSection from '/imports/ui/components/pages/TitleSection';

const selectRow = {
  mode: 'checkbox',
  clickToSelect: true,
  classes: 'selection-row'
};

export default ListRecognition = () => {

  const history = useHistory();
  const [ loading, setLoading ] = useState(false);

  const [ dataRecognitions, setDataRecognitions ] = useState([]);
  const [ quality, setQuality ] = useState('');
  const [ qualitySelected, setQualitySelected ] = useState(null);
  const [ behavior, setBehavior ] = useState('');
  const [ owner, setOwner ] = useState('');
  const [ showModal, setShowModal ] = useState(false);
  const [ titleModal, setTitleModal ] = useState('');
  const [ messageModal, setMessageModal ] = useState('');

  const { loading: loading1, allQualities } = useAllQualities();
  const { loading: loading2, allUsers } = useAllUsers();

  const searchItem = () => {
    const filters = {
      quality,
      behavior,
      owner
    };

    setLoading(true);

    Meteor.call('searchRecognition', filters, function(error, result) {
      setLoading(false);
      if (error) {
        setTitleModal('Error');
        setMessageModal(error.reason);
        return setShowModal(true);
      }

      if (result) {
        setDataRecognitions(result);
      }
    });
  };

  useEffect(() => {
    searchItem();
  }, []);

  const columns = [
    {
      dataField: 'owner',
      text: 'Usuario reconocido',
      formatter: (cell, row) => getNameItem(cell, allUsers),
    }, {
      dataField: 'username',
      text: 'Reconocedor',
      formatter: (cell, row) => getNameItem(cell, allUsers),
    }, {
      dataField: 'quality',
      text: 'Cualidad',
      formatter: (cell, row) => getNameItem(cell, allQualities),
    }, {
      dataField: 'date',
      text: 'Fecha',
      formatter: dateFormatter
    }
  ];

  const handleGetSelectedData = () => {
    const deleteRecognitions = node.selectionContext.selected;

    setLoading(true);

    deleteRecognitions.map(recognitionId => {
      Meteor.call('deleteRecognition', recognitionId, function(error, result) {
        setLoading(false);
        if (error) {
          setTitleModal('Error');
          setMessageModal(error.reason);
          return setShowModal(true);
        }
        return searchItem();
      });
    });
  };

  const setBehaviors = () => {
    const data = allQualities.find(i => i._id == qualitySelected);
    return renderOptions(data.behaviors);
  }

  if (loading || loading1 || loading2) {
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
      <TitleSection title="Reconocimientos" back={true} />
      <Row>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Form>
                <Row>
                  <Form.Label className="mb-0">
                    <strong>Buscar</strong>
                  </Form.Label>
                  <Col xs={12}><hr /></Col>
                  <Col md={6}>
                    <Form.Group controlId="values">
                      <Form.Label>Valores</Form.Label>
                      <select
                        className="form-select"
                        value={quality}
                        onChange={(e) => {
                          setQuality(e.target.value);
                          setQualitySelected(e.target.value);
                        }}
                      >
                        <option value="all">Todas</option>
                        {renderOptions(allQualities)}
                      </select>
                    </Form.Group>
                  </Col>
                  {qualitySelected && qualitySelected != 'all' && (
                    <Col md={6} className="mt-3">
                      <Form.Group controlId="values">
                        <Form.Label>Comportamientos</Form.Label>
                        <select
                          className="form-select"
                          value={behavior}
                          onChange={(e) => setBehavior(e.target.value)}
                        >
                          <option value="all">Todos</option>
                          {setBehaviors()}
                        </select>
                      </Form.Group>
                    </Col>
                  )}
                  <Col xs={12} className="mt-3">
                    <Form.Group controlId="employee">
                      <Form.Label>Empleado</Form.Label>
                      <select
                        className="form-select"
                        value={owner}
                        onChange={(e) => setOwner(e.target.value)}
                      >
                        <option value="all">Todos</option>
                        {renderOptions(allUsers)}
                      </select>
                    </Form.Group>
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
                    <Button
                      variant="success"
                      onClick={() => searchItem()}
                    >
                      Buscar
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mt-3 mt-md-0">
          <Alert variant="primary">
            <Alert.Heading>
              Total: {''}
              {dataRecognitions.length}
            </Alert.Heading>
          </Alert>
          {dataRecognitions.length > 0 && (
            <Card>
              <Card.Body>
                <div className="table-responsive">
                  <BootstrapTable
                    ref={ n => node = n }
                    keyField='_id'
                    data={ dataRecognitions }
                    columns={ columns }
                    pagination={paginationFactory()}
                    striped
                    condensed
                    selectRow={ selectRow }
                  />
                </div>
                <div className="text-end">
                  <Button variant="teal" onClick={ handleGetSelectedData }>
                    Eliminar reconocimientos seleccionados
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
