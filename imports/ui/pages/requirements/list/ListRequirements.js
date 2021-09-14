import React, { useEffect, useState } from 'react';
import { Badge, Button, Card, Col, Row } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory, faTimes, } from '@fortawesome/free-solid-svg-icons';

import { useAllProducts } from '/imports/startup/client/hooks';
import { dateFormatter } from '/imports/ui/pages/utils/formatters';
import { getNameItem } from '/imports/ui/components/form/FormComponents';


import ActionModal from '/imports/ui/components/modals/ActionModal';
import LoadingView from '/imports/ui/components/loading/LoadingView';
import ConfirmModal from '/imports/ui/components/modals/ConfirmModal';
import TitleSection from '/imports/ui/components/pages/TitleSection';

export default ListRequirements = () => {

  const [ loading, setLoading ] = useState(false);
  const [ dataRequirements, setDataRequirements ] = useState([]);
  const [ showModal, setShowModal ] = useState(false);
  const [ titleModal, setTitleModal ] = useState('');
  const [ messageModal, setMessageModal ] = useState('');

  const [ selectCancelOrder, setSelectCancelOrder ] = useState(null);
  const [ showModalCancel, setShowModalCancel ] = useState(false);

  const { loading: loading1, allProducts } = useAllProducts();

  const getOrders = () => {
    setLoading(true);

    Meteor.call('searchRequirements', function(error, result) {
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

  const cancelOrder = () => {
    setLoading(true);

    Meteor.call('cancelRequirement', selectCancelOrder, function(error, result) {
      setLoading(false);
      if (error) {
        setTitleModal('Error');
        setMessageModal(error.reason);
        return setShowModal(true);
      }

      if (result) {
        setShowModalCancel(false)
        setSelectCancelOrder(null);
        setTitleModal('Éxito');
        setMessageModal('Orden cancelada');
        getOrders();
        return setShowModal(true);
      }
    });
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
          case 'DELIVERED':
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
      dataField: 'cancel',
      text: 'Cancelar',
      formatter: (cell, row) => (
        <center>
          {row.status == 'CANCELLED'
          ? <center>
            Fecha de cancelado:{' '}
            {dateFormatter(row.dateCancelled)}
          </center>
          : <Button
          variant="danger"
          className="btn-circle"
          onClick={() => {
            setSelectCancelOrder(row._id);
            setShowModalCancel(true)
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </Button>}
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
        handleClose={() => setShowModal(false)}
        title="Cancelar"
        message="¿Desea cancelar esta orden?"
        handleAction={() => cancelOrder()}
        titleAction="Aceptar"
      />
      <ConfirmModal 
        show={showModal}
        handleClose={() => setShowModal(false)}
        title={titleModal}
        message={messageModal}
      />
      <TitleSection title="Historial" back={true} />
      <Row>
        <Col md={12}>
          {dataRequirements.length > 0
            ? (
              <Card>
                <Card.Body>
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
