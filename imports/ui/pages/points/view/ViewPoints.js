import React, { useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router-dom';

import { badgeStatus, dateFormatter } from '/imports/ui/pages/utils/formatters';

import ConfirmModal from '/imports/ui/components/modals/ConfirmModal';
import LoadingView from '/imports/ui/components/loading/LoadingView';
import NoData from '/imports/ui/components/noData/NoData';
import TitleSection from '/imports/ui/components/pages/TitleSection';
import UserCard from '/imports/ui/components/cards/UserCard';

export default ViewPoints = (props) => {

  const { userId } = props;
  const [ loading, setLoading ] = useState(false);
  const [ showModal, setShowModal ] = useState(false);
  const [ titleModal, setTitleModal ] = useState('');
  const [ messageModal, setMessageModal ] = useState('');
  const [ pointsUser, setPointsUser ] = useState(0);
  const [ dataPoints, setDataPoints ] = useState([]);

  const history = useHistory();

  const getPoints = () => {
    setLoading(true);
    Meteor.call('pointsByUser', userId, function(error, result) {
      setLoading(false);

      if (error) {
        setTitleModal('Error');
        setMessageModal(error.reason);
        return setShowModal(true);
      }

      if (result) {
        setPointsUser(result);
      }
    });
  };

  const historyPoints = () => {
    setLoading(true);
    Meteor.call('pointsHistoryByUser', userId, function(error, result) {
      setLoading(false);

      if (error) {
        setTitleModal('Error');
        setMessageModal(error.reason);
        return setShowModal(true);
      }

      if (result) {
        setDataPoints(result);
      }
    });
  }

  useEffect(() => {
    getPoints();
    historyPoints();
  }, []);

  if (loading) {
    return <LoadingView />;
  }

  const columns = [
    {
      dataField: 'date',
      text: 'Fecha',
      formatter: dateFormatter
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
      dataField: 'type',
      text: 'Tipo',
      formatter: (cell, row) => {
        if (row.username == userId) {
          return 'Reconocedor';
        }
        switch(cell) {
          case 'assignment':
            return 'Asignado';
          case 'exchange':
            return 'Canje';
          default:
            return '--';
        }
      }
    }, {
      dataField: 'status',
      text: 'Estatus',
      formatter: badgeStatus
    }, {
      dataField: 'note',
      text: 'Detalle',
      formatter: (cell, row) => {
        if (row.type == 'assignment') {
          return (
            <center>
              <a
                className="btn btn-teal"
                href={`/recognition/view/${row._id}`}
                role="button"
                target="_blank"
                size="sm"
              >
                Ver reconocimiento
              </a>
          </center>
          )
        }
        return (
          <center>
            {cell ? cell : '--'}
          </center>
        )
      }
    }
  ];

  return (
    <section>
      <ConfirmModal 
        show={showModal}
        handleClose={() => setShowModal(false)}
        title={titleModal}
        message={messageModal}
      />
      <TitleSection classes="text-center" title="Mis puntos" back={true} />
      <Row className="mt-5">
        <Col md={4}>
          <UserCard user={props.userId} />
        </Col>
        <Col md={8} className="mt-3 mt-md-0">
          <h3 className="text-end">
            <span className="font-weight-light">Puntos:</span> {pointsUser}
          </h3>
          {dataPoints.length > 0
            ? (
              <div className="table-responsive">
                <BootstrapTable
                  keyField='_id'
                  data={ dataPoints }
                  columns={ columns }
                  pagination={paginationFactory()}
                  striped
                  condensed
                />
              </div>)
            : <NoData title="Sin datos por mostrar" icon={faCoins} />}
        </Col>
      </Row>
    </section>
  );
};
