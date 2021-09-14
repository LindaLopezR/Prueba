import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { useHistory } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTimes, } from '@fortawesome/free-solid-svg-icons';

import ActionModal from '/imports/ui/components/modals/ActionModal';
import LoadingView from '/imports/ui/components/loading/LoadingView';
import ConfirmModal from '/imports/ui/components/modals/ConfirmModal';
import TitleSection from '/imports/ui/components/pages/TitleSection';

export default Qualities = (props) => {

  const history = useHistory();
  const [ loading, setLoading ] = useState(false);
  const [ name, setName ] = useState('');
  const [ dataQualities, setDataQualities ] = useState([]);
  const [ showModal, setShowModal ] = useState(false);
  const [ showModalAction, setShowModalAction ] = useState(false);
  const [ titleModal, setTitleModal ] = useState('');
  const [ messageModal, setMessageModal ] = useState('');
  const [ selectDeleteQuality, setSelectDeleteQuality ] = useState(null);

  const searchItem = () => {
    const filters = { name };

    setLoading(true);

    Meteor.call('searchQuality', filters, function(error, result) {
      setLoading(false);
      if (error) {
        setTitleModal('Error');
        setMessageModal(error.reason);
        return setShowModal(true);
      }

      if (result) {
        setDataQualities(result);
      }
    });
  };

  useEffect(() => {
    searchItem();
  }, []);

  const deleteQuality = (qualityId) => {

    setLoading(true);
    setSelectDeleteQuality(null);

    Meteor.call('deleteQuality', qualityId, function(error, result) {
      setLoading(false);
      if (error) {
        setTitleModal('Error');
        setMessageModal(error.reason);
        return setShowModal(true);
      }

      if (result) {
        setTitleModal('Éxito');
        setMessageModal('Cualidad eliminada');
        searchItem();
        return setShowModal(true);
      }
    });
  };

  const columns = [
    {
      dataField: 'name',
      text: 'Nombre',
    }, {
      dataField: 'edit',
      text: 'Editar',
      formatter: (cell, row) => (
        <center>
          <Button
            variant="teal"
            className="btn-circle"
            onClick={() => history.push(`/editQuality/${row._id}`)}
          >
            <FontAwesomeIcon icon={faPencilAlt} />
          </Button>
        </center>
      )
    }, {
      dataField: 'delete',
      text: 'Eliminar',
      formatter: (cell, row) => (
        <center>
          <Button
            variant="danger"
            className="btn-circle"
            onClick={() => {
              setShowModalAction(true);
              setSelectDeleteQuality(row._id);
            }}
          >
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </center>
      )
    }
  ];

  if (loading) {
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
      <ActionModal
        show={showModalAction}
        handleClose={() => {
          setShowModalAction(false);
          setSelectDeleteQuality(null);
        }}
        title={'Eliminar'}
        message={'¿Desea eliminar esta cualidad?'}
        handleAction={() => {
          setShowModalAction(false);
          deleteQuality(selectDeleteQuality);
        }}
        titleAction="Eliminar"
      />
      <TitleSection classes="text-center" title="Valores" back={true} />
      <Row className="mb-3">
        <Col xs={6}>
          <h4 className="title-info">
            Total: {''}
            {dataQualities.length}
          </h4>
        </Col>
        <Col xs={6} className="text-end">
          <Button variant="teal" onClick={() => history.push('/newQuality')}>
            Nuevo valor
          </Button>
        </Col>
      </Row>
      <Row>
        <Col md={12} className="mt-3 mt-md-0">
          {dataQualities.length > 0 && (
            <Card>
              <Card.Body>
                <Form>
                  <Row>
                    <Form.Group as={Col} controlId="name">
                      <Form.Label>Buscar por nombre</Form.Label>
                      <Form.Control 
                        type="text"
                        value={name}
                        placeholder="Nombre"
                        onChange={(e) => setName(e.target.value)}
                      />
                    </Form.Group>
                    <Col xs={3} className="text-end mt-3">
                      <Button
                        variant="primary"
                        className="btn-100 mt-0 mt-md-3"
                        onClick={() => searchItem()}
                      >
                        Buscar
                      </Button>
                    </Col>
                    <Col xs={12}><hr /></Col>
                  </Row>
                </Form>
                <div className="table-responsive">
                  <BootstrapTable
                    keyField='_id'
                    data={ dataQualities }
                    columns={ columns }
                    pagination={paginationFactory()}
                    striped
                    condensed
                  />
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </section>
  );
};