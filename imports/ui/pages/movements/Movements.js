import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import DatePicker from 'react-datepicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs, faHistory, faTable } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router-dom';

import { badgeStatus, dateFormatter, orderCollection, }  from '/imports/ui/pages/utils/formatters';
import { getNameItem, renderOptions } from '/imports/ui/components/form/FormComponents';
import { useAllQualities, useAllUsers } from '/imports/startup/client/hooks';

import FormModal from '/imports/ui/components/modals/FormModal';
import LoadingView from '/imports/ui/components/loading/LoadingView';
import ConfirmModal from '/imports/ui/components/modals/ConfirmModal';
import TitleSection from '/imports/ui/components/pages/TitleSection';

const allMovements = [
  {_id: 'assignment', name: 'Asignación', value: 'assignment'},
  {_id: 'exchange', name: 'Intercambio por producto', value: 'exchange'},
];

const allStatus = [
  {_id: 'PENDIENT', name: 'Pendiente', value: 'PENDIENT'},
  {_id: 'APPROVED', name: 'Aprobado', value: 'APPROVED'},
  {_id: 'CANCELLED', name: 'Cancelado', value: 'CANCELLED'},
  {_id: 'DELIVERED', name: 'Entrega de productos', value: 'DELIVERED'},
];

export default Movements = () => {

  const history = useHistory();
  const [ loading, setLoading ] = useState(false);
  const [ movements, setMovements ] = useState([]);
  const [ startDate, setStartDate ] = useState();
  const [ finishDate, setFinishDate ] = useState();
  const [ quality, setQuality ] = useState('');
  const [ qualitySelected, setQualitySelected ] = useState(null);
  const [ behavior, setBehavior ] = useState('');
  const [ movement, setMovement ] = useState('');
  const [ status, setStatus ] = useState('') ;
  const [ owner, setOwner ] = useState('');
  const [ recognitionData, setRecognitionData ] = useState(null);
  const [ recognitionCancel, setCancelRecognition ] = useState(null);
  const [ productStatus, setProductStatus ] = useState(null);
  const [ defaultPoints, setDefaultPoints ] = useState(0);

  const [ showModal, setShowModal ] = useState(false);
  const [ titleModal, setTitleModal ] = useState('');
  const [ messageModal, setMessageModal ] = useState('');

  const [ showModalAction, setShowModalAction ] = useState(false);
  const [ showModalConfirm, setShowModalConfirm ] = useState(false);
  const [ showModalProduct, setShowModalProduct ] = useState(false);
  
  const { loading: loading1, allQualities } = useAllQualities();
  const { loading: loading2, allUsers } = useAllUsers();

  const onSubmit = () => {

    const filters = {
      startDate,
      finishDate,
      quality,
      behavior,
      owner,
      status,
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

    Meteor.call('getMoventsRecognition', filters, function(error, result) {
      setLoading(false);
      if (error) {
        setTitleModal('Error');
        setMessageModal(error.reason);
        return setShowModal(true);
      }

      if (result) {
        setMovements(result);
      }
    });
  };

  useEffect(() => {
    setLoading(true);

    onSubmit();
  }, []);

  const updateRecognition = (data) => {
    
    const query = {
      recognition: recognitionData._id,
      userId: recognitionData.owner,
      points: data
    };

    setShowModalAction(false);
    setLoading(true);

    Meteor.call('updatePointsUser', query, function(error, result) {
      setLoading(false);
      if (error) {
        setTitleModal('Error'); 
        setMessageModal(error.reason);
        return setShowModal(true);
      }

      if (result) {
        setTitleModal('Éxito');
        setMessageModal('Puntos asignados');
        onSubmit();
        return setShowModal(true);
      }
    });
  };

  const cancelRecognition = () => {
    const query = {
      recognition: recognitionCancel._id,
    };

    setLoading(true);

    Meteor.call('cancelRecognition', query, function(error, result) {
      setLoading(false);
      if (error) {
        setTitleModal('Error');
        setMessageModal(error.reason);
        return setShowModal(true);
      }

      if (result) {
        setShowModalConfirm(false);
        setCancelRecognition(null);
        setTitleModal('Éxito');
        setMessageModal('Reconocimiento cancelado');
        onSubmit();
        return setShowModal(true);
      }
    });
  };

  const productDelivered = () => {
    const query = {
      recognition: productStatus._id,
    };

    Meteor.call('productDelivered', query, function(error, result) {
      setLoading(false);
      if (error) {
        setTitleModal('Error');
        setMessageModal(error.reason);
        return setShowModal(true);
      }

      if (result) {
        setShowModalProduct(false);
        setProductStatus(null);
        setTitleModal('Éxito');
        setMessageModal('Información actualizada');
        onSubmit();
        return setShowModal(true);
      }
    });
  };

  const setBehaviors = () => {
    const data = allQualities.find(i => i._id == qualitySelected);
    return renderOptions(data.behaviors);
  };

  const renderActions = (cell, row) => {
    if (row.type == 'assignment') {
      const changeStatus = () => {
        return (
          <center>
            <Button
              variant="teal"
              onClick={() => {
                const qualityPoints = allQualities.find(quality => quality._id == row.quality);
                const points = qualityPoints.defaultPoints && qualityPoints.defaultPoints != ''
                  ? qualityPoints.defaultPoints
                  : null;
                setDefaultPoints(points);
                setRecognitionData(row);
                setShowModalAction(true);
              }}
              size="sm"
            >
              Aprobar
            </Button>
            <Button
              variant="danger"
              className="ml-3"
              onClick={() => {
                setCancelRecognition(row);
                setShowModalConfirm(true);
              }}
              size="sm"
            >
              Cancelar
            </Button>
          </center>
        )
      }
      const actionBtn = {
        'PENDIENT': changeStatus(),
        'APPROVED': <center>--</center>,
        'CANCELLED': <center>--</center>,
      }

      return actionBtn[row.status];
    }

    if (row.type == 'exchange') {
      if (row.status == 'DELIVERED') {
        return <center>
          Entrega de producto:{' '}
          {dateFormatter(row.delivered)}
        </center>;
      }

      return <center>
        <Button
          variant="teal"
          onClick={() => {
            setProductStatus(row);
            setShowModalProduct(true);
          }}
          size="sm"
        >
          Producto entregado
        </Button>
      </center>
    }
  }

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
      formatter: (cell, row) => <center>
        {cell ? cell : '--'}
      </center>
    }, {
      dataField: 'type',
      text: 'Tipo',
      formatter: (cell, row) => {
        switch(cell) {
          case 'assignment':
            return 'Asignación';
          case 'exchange':
            return 'Intercambio por producto'
          default:
            return '--';
        }
      }
    }, {
      dataField: 'points',
      text: 'Puntos',
      formatter: (cell, row) => (
        <center>
          {cell && row.type == 'assignment' && '+'}
          {cell && row.type == 'exchange' && '-'}
          {cell ? cell : '--'}
        </center>)
    }, {
      dataField: 'status',
      text: 'Status',
      formatter: badgeStatus
    }, {
      dataField: 'actions',
      text: 'Acciones',
      formatter: (cell, row) => renderActions(cell, row)
    }
  ];

  if (loading || loading1 || loading2) {
    return <LoadingView />;
  };

  let finalUsers = allUsers.map(item => {
    item.name = `${item.profile.name} ${item.profile.lastName}`;
    return item;
  });

  finalItems = orderCollection(finalUsers);

  return (
    <section>
      <ConfirmModal 
        show={showModal}
        handleClose={() => setShowModal(false)}
        title={titleModal}
        message={messageModal}
      />
      <ActionModal
        show={showModalConfirm}
        handleClose={() => setShowModalConfirm(false)}
        title={'Cancelar'}
        message={'¿Desea cancelar el reconocimiento?'}
        handleAction={() => cancelRecognition()}
        titleAction="Aceptar"
      />
      <ActionModal
        show={showModalProduct}
        handleClose={() => setShowModalProduct(false)}
        title={'Entrega de producto'}
        message={'¿El producto se ha entregado?'}
        handleAction={() => productDelivered()}
        titleAction="Si"
      />
      <FormModal
        show={showModalAction}
        handleClose={() => {
          setDefaultPoints(0);
          setShowModalAction(false);
        }}
        title={'Asignar puntos'}
        message={defaultPoints ? 'Puntos default' : 'Asignar puntos'}
        handleAction={(data) => {
          setDefaultPoints(0);
          updateRecognition(data)
        }}
        titleAction="Actualizar"
        value={defaultPoints}
      />
      <TitleSection title="Ver movimientos" back={true} />
      <Row className="mb-3">
        <Col xs={6}>
          <h4 className="title-info">
            Total: {''}
            {movements.length}
          </h4>
        </Col>
        <Col xs={6} className="text-end">
          <Button variant="teal" onClick={() => history.push('/newRecognition')}>
            Nuevo reconocimiento
          </Button>
          <Button
            variant="outline-secondary"
            onClick={() => history.push('/settingsRecognitions')}
            className="ml-1"
          >
            <FontAwesomeIcon icon={faCogs} />{' '}
            Ajustes
          </Button>
        </Col>
      </Row>
      <Row>
        <Col md={8}>
          {movements.length > 0
            ? (
              <div className="table-responsive">
                <BootstrapTable
                  keyField='_id'
                  data={ movements }
                  columns={ columns }
                  pagination={paginationFactory()}
                  striped
                  condensed
                />
              </div>)
            : <div className="mt-5">
                <NoData title="Sin datos por mostrar" icon={faHistory} />
              </div>
          }
        </Col>
        <Col md={4} className="order-first order-md-last mb-3 mb-md-0">
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
                  {/* <Col md={6} className="mt-3">
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
                  )} */}
                  <Col xs={12} className="mt-3">
                    <Form.Group controlId="employee">
                      <Form.Label>Empleado</Form.Label>
                      <select
                        className="form-select"
                        value={owner}
                        onChange={(e) => setOwner(e.target.value)}
                      >
                        <option value="all">Todos</option>
                        {renderOptions(finalUsers)}
                      </select>
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mt-3">
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
                  <Col md={6} className="mt-3">
                    <Form.Group controlId="endDate">
                      <Form.Label>Status</Form.Label>
                      <select
                        className="form-select"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option value="all">Todos</option>
                        {renderOptions(allStatus)}
                      </select>
                    </Form.Group>
                  </Col>
                  <Col xs={12} className="text-end mt-3">
                    <Button variant="success" onClick={() => onSubmit()}>
                      <FontAwesomeIcon icon={faTable} />{' '}
                      Generar movimiento
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
