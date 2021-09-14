import React, { useEffect, useState } from 'react';
import { Badge, Button, Card, Col, Form, Row } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCogs, faHistory, faTimes, } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router-dom';

import { useAllProducts } from '/imports/startup/client/hooks';
import { dateFormatter } from '/imports/ui/pages/utils/formatters';
import { getNameItem } from '/imports/ui/components/form/FormComponents';

import { renderOptions } from '/imports/ui/components/form/FormComponents';

import FormModal from '/imports/ui/components/modals/FormModal';
import ActionModal from '/imports/ui/components/modals/ActionModal';
import LoadingView from '/imports/ui/components/loading/LoadingView';
import ConfirmModal from '/imports/ui/components/modals/ConfirmModal';
import TitleSection from '/imports/ui/components/pages/TitleSection';

export default Requirementss = () => {

  const history = useHistory();
  const [ loading, setLoading ] = useState(false);
  const [ dataRequirements, setDataRequirements ] = useState([]);
  const [ product, setProduct ] = useState('');
  const [ showModal, setShowModal ] = useState(false);
  const [ titleModal, setTitleModal ] = useState('');
  const [ messageModal, setMessageModal ] = useState('');
  const [ showModalAction, setShowModalAction ] = useState(false);

  const [ selectCancelOrder, setSelectCancelOrder ] = useState(null);
  const [ showModalCancel, setShowModalCancel ] = useState(false);
  const [ selectApprovedOrder, setSelectApprovedOrder ] = useState(null);
  const [ showModalApproved, setShowModalApproved ] = useState(false);
  const [ valueOrder, setValueOrder ] = useState(0);

  const { loading: loading1, allProducts } = useAllProducts();

  const getOrders = () => {
    const filters = { product };

    setLoading(true);

    Meteor.call('searchRequirements', filters, function(error, result) {
      setLoading(false);
      if (error) {
        setTitleModal('Error');
        setMessageModal(error.reason);
        return setShowModal(true);
      }

      if (result) {
        setDataRequirements(result);
      }
    });
  }

  useEffect(() => {
    getOrders();
  }, []);

  const actionOrder = (type, data) => {
    const callback = (error, result) => {
      setLoading(false);
      if (error) {
        setTitleModal('Error');
        setMessageModal(error.reason);
        return setShowModal(true);
      }

      if (result) {
        setShowModalCancel(false)
        setSelectCancelOrder(null);
        setShowModalApproved(false)
        setSelectApprovedOrder(null);
        setShowModalAction(false);
        setValueOrder(0);
        getOrders();
        setTitleModal('Éxito');
        setMessageModal('Orden actualizada');
      };
    };

    if (type === 'cancel') {
      Meteor.call('cancelRequirement', selectCancelOrder, callback);
    } else if (type === 'approved') {
      Meteor.call('approvedRequirement', selectApprovedOrder, callback);
    } else if (type === 'update') {
      const query = {
        valueOrder,
        pieces: data,
      }
      Meteor.call('updateRequirement', query, callback);
    }
  }

  const columns = [
    {
      dataField: 'date',
      text: 'Fecha',
      formatter: dateFormatter
    }, {
      dataField: 'product',
      text: 'Producto',
      formatter: (cell, row) => getNameItem(cell, allProducts)
    }, {
      dataField: 'pieces',
      text: 'Piezas',
    }, {
      dataField: 'status',
      text: 'Status',
      formatter: (cell, row) => {
        let variant = '';
        switch(cell) {
          case 'PENDIENT':
            variant = 'primary';
            break;
          case 'APPROVED':
            variant = 'success';
            break;
          case 'CANCELLED':
            variant = 'danger';
            break;
          case 'COMPLETE':
            variant = 'info';
            break;
          default:
            variant = 'secondary';
            break;
        }
        return (
          <center>
            <Badge pill variant={variant}>
              {cell ? cell : '--'}
            </Badge>
          </center>
        );
      }
    }, {
      dataField: 'approved',
      text: 'Aprobar',
      formatter: (cell, row) => (
        <center>
          {row.status !== 'APPROVED' && row.status !== 'COMPLETE' && row.status !== 'PENDIENT' && '--'}
          {row.status == 'APPROVED' && (
            <>
              <p className="mb-0">
                Fecha de aprobación:{' '}
                {dateFormatter(row.dateApproved)}
              </p>
              <Button
                variant="success"
                onClick={() => {
                  setValueOrder(row);
                  setShowModalAction(true);
                }}
                size="sm"
              >
                Terminar
              </Button>
            </>
          )}
          {row.status == 'PENDIENT' && (
            <Button
              variant="success"
              className="btn-circle"
              onClick={() => {
                setSelectApprovedOrder(row._id);
                setShowModalApproved(true)
              }}
              size="sm"
            >
              <FontAwesomeIcon icon={faCheck} />
            </Button>
          )}
          {row.status == 'COMPLETE' && (
            <>
              Fecha de finalización:{' '}
              {dateFormatter(row.dateComplete)}
            </>
          )}
        </center>
      )
    }, {
      dataField: 'cancel',
      text: 'Cancelar',
      formatter: (cell, row) => (
        <center>
          {row.status == 'CANCELLED' && (
            <>
              Fecha de cancelado:{' '}
              {dateFormatter(row.dateCancelled)}
            </>
          )}
          {row.status !== 'CANCELLED' && row.status !== 'APPROVED' && '--'}
          {row.status == 'PENDIENT' || row.status == 'APPROVED' && (
            <Button
              variant="danger"
              className="btn-circle"
              onClick={() => {
                setSelectCancelOrder(row._id);
                setShowModalCancel(true)
              }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </Button>
          )}
        </center>
      )
    },
  ];

  if (loading || loading1) {
    return <LoadingView />;
  };

  return (
    <section>
      <ActionModal
        show={showModalCancel}
        handleClose={() => setShowModalCancel(false)}
        title="Cancelar"
        message="¿Desea cancelar esta orden?"
        handleAction={() => actionOrder('cancel')}
        titleAction="Aceptar"
      />
      <ActionModal
        show={showModalApproved}
        handleClose={() => setShowModalApproved(false)}
        title="Aprobar"
        message="¿Desea aprobar esta orden?"
        handleAction={() => actionOrder('approved')}
        titleAction="Aceptar"
      />
      <FormModal
        show={showModalAction}
        handleClose={() => setShowModalAction(false)}
        title={'Cantidad de productos'}
        message={''}
        handleAction={(data) => actionOrder('update',data)}
        titleAction="Actualizar"
        value={valueOrder.pieces}
      />
      <ConfirmModal 
        show={showModal}
        handleClose={() => setShowModal(false)}
        title={titleModal}
        message={messageModal}
      />
      <TitleSection title="Requerimientos" back={true} />
      <Row className="mb-3">
        <Col xs={6}>
          <h4 className="title-info">
            Total: {''}
            {dataRequirements.length}
          </h4>
        </Col>
        <Col xs={6} className="text-end">
          <Button variant="teal" onClick={() => history.push('/newRequirement')}>
            Nuevo requerimiento
          </Button>
          <Button
            variant="outline-secondary"
            onClick={() => history.push('/settingsRequirements')}
            className="ml-1"
          >
            <FontAwesomeIcon icon={faCogs} />{' '}
            Ajustes
          </Button>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          {dataRequirements.length > 0
            ? (
              <Card>
                <Card.Body>
                  <Row>
                    <Form.Group as={Col} controlId="product">
                      <Form.Label>Buscar por producto</Form.Label>
                      <select
                        className="form-select"
                        value={product}
                        onChange={(e) => setProduct(e.target.value)}
                      >
                        <option value="all">Todos</option>
                        {renderOptions(allProducts)}
                      </select>
                    </Form.Group>
                    <Col xs={3} className="mt-3">
                      <Button
                        variant="success"
                        className="btn-100 mt-0 mt-md-3"
                        onClick={() => getOrders()}
                      >
                        Buscar
                      </Button>
                    </Col>
                    <Col xs={12}><hr /></Col>
                  </Row>
                  <div className="table-responsive">
                    <BootstrapTable
                      ref={ n => node = n }
                      keyField='_id'
                      data={ dataRequirements }
                      columns={ columns }
                      pagination={paginationFactory()}
                      striped
                      condensed
                    />
                  </div>
                </Card.Body>
              </Card>
            )
            : (
              <div className="mt-5">
                <NoData title="Sin datos por mostrar" icon={faHistory} />
              </div>
            )}
        </Col>
      </Row>
    </section>
  );
};