import React, { useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';

import { dateFormatter }  from '/imports/ui/pages/utils/formatters';
import { getNameItem, renderOptions } from '/imports/ui/components/form/FormComponents';
import { useAllQualities, useAllUsers } from '/imports/startup/client/hooks';

import LoadingView from '/imports/ui/components/loading/LoadingView';
import ConfirmModal from '/imports/ui/components/modals/ConfirmModal';
import TitleSection from '/imports/ui/components/pages/TitleSection';

const allMovements = [
  {_id: 1, name: 'Restar', value: 'substract'},
];

export default Reports = () => {

  const [ loading, setLoading ] = useState(false);
  const [ dataResults, setDataResults ] = useState([]);
  const [ startDate, setStartDate ] = useState(null);
  const [ finishDate, setFinishDate ] = useState(null);
  const [ quality, setQuality ] = useState('');
  const [ qualitySelected, setQualitySelected ] = useState(null);
  const [ behavior, setBehavior ] = useState('');
  const [ movement, setMovement ] = useState('');
  const [ owner, setOwner ] = useState('');

  const [ showModal, setShowModal ] = useState(false);
  const [ titleModal, setTitleModal ] = useState('');
  const [ messageModal, setMessageModal ] = useState('');

  const { loading: loading1, allQualities } = useAllQualities();
  const { loading: loading2, allUsers } = useAllUsers();

  const columns = [
    {
      dataField: 'date',
      text: 'Fecha',
      formatter: dateFormatter
    }, {
      dataField: 'owner',
      text: 'Usuario reconocido',
      formatter: (cell, row) => getNameItem(cell, allUsers),
    }, {
      dataField: 'number',
      text: 'Número',
      formatter: (cell, row) => <center>{cell}</center>
    }, {
      dataField: 'type',
      text: 'Tipo',
      formatter: (cell, row) => {
        switch(cell) {
          case 'add':
            return 'Asignado';
          case 'substract':
            return 'Restar'
          default:
            return '--';
        }
      }
    }, {
      dataField: 'points',
      text: 'Puntos',
      formatter: (cell, row) => (
        <center>
          {row.type == 'add' && '+'}
          {row.type == 'substract' && '-'}
          {cell ? cell : '--'}
        </center>)
    }
  ];

  const onSubmit = () => {

    const filters = {
      startDate,
      finishDate,
      quality,
      behavior,
      owner,
      movement
    };

    if (startDate && finishDate) {
      const start = new Date(startDate).getTime();
      const finish = new Date(finishDate).getTime();
      if (start > finish) {
        setTitleModal('Error');
        setMessageModal('La fecha de finalización debe ser mayor que la fecha de inicio');
        return setShowModal(true);
      }
    }

    setLoading(true);

    Meteor.call('generateReportRecognitions', filters, function(error, result) {
      setLoading(false);
      if (error) {
        setTitleModal('Error');
        setMessageModal(error.reason);
        return setShowModal(true);
      }

      if (result) {
        setDataResults(result);
      }
    })
  };

  const setBehaviors = () => {
    const data = allQualities.find(i => i._id == qualitySelected);
    return renderOptions(data.behaviors);
  };

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
      <TitleSection title="Hacer reporte" back={true} />
      <Row>
        <Col md={6}>
          {dataResults.length > 0
            ? <div className="table-responsive">
                <BootstrapTable
                  keyField='_id'
                  data={ dataResults }
                  columns={ columns }
                  pagination={paginationFactory()}
                  striped
                  condensed
                />
              </div>
            : <div className="mt-5">
                <NoData title="Sin datos por mostrar" icon={faChartLine} />
              </div>
          }
        </Col>
        <Col md={6} className="mt-3 mt-md-0">
          <Form>
            <Card>
              <Card.Body>
                <p>Filtros</p>
                <hr />
                <Row>
                  <Col xs={6}>
                    <Form.Group controlId="startDate">
                      <Form.Label>Empieza</Form.Label>
                      <DatePicker
                        dateFormat="dd/MM/yyyy"
                        className="form-select input-calendar"
                        onChange={(date) => setStartDate(date)}
                        selected={startDate}
                      />
                      {startDate && <Button
                        variant="teal"
                        className="mt-1"
                        onClick={() => setStartDate(null)}
                        size="sm"
                      >
                        Limpiar
                      </Button>}
                    </Form.Group>
                  </Col>
                  <Col xs={6}>
                    <Form.Group controlId="endDate">
                      <Form.Label>Termina</Form.Label>
                      <DatePicker
                        dateFormat="dd/MM/yyyy"
                        className="form-select input-calendar"
                        onChange={(date) => setFinishDate(date)}
                        selected={finishDate}
                      />
                      {finishDate && <Button
                        variant="teal"
                        className="mt-1"
                        onClick={() => setFinishDate(null)}
                        size="sm"
                      >
                        Limpiar
                      </Button>}
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mt-3">
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
                        <option value="all">Todos</option>
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
                  <Col xs={12} className="mt-3">
                    <Form.Group controlId="endDate">
                      <Form.Label>Tipo de movimiento</Form.Label>
                      <select
                        className="form-select"
                        value={movement}
                        onChange={(e) => setMovement(e.target.value)}
                      >
                        <option value="all">Todos</option>
                        {renderOptions(allMovements)}
                      </select>
                    </Form.Group>
                  </Col>
                  <Col xs={12} className="text-end mt-3">
                    <Button variant="success" onClick={() => onSubmit()}>
                      <FontAwesomeIcon icon={faChartLine} />{' '}
                      Generar reporte
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Form>
        </Col>
      </Row>
    </section>
  );
};
