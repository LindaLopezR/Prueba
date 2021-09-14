import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTimes, } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router-dom';

import ActionModal from '/imports/ui/components/modals/ActionModal';
import LoadingView from '/imports/ui/components/loading/LoadingView';
import ConfirmModal from '/imports/ui/components/modals/ConfirmModal';
import TitleSection from '/imports/ui/components/pages/TitleSection';

export default DeleteProducts = () => {

  const history = useHistory();
  const [ loading, setLoading ] = useState(false);
  const [ name, setName ] = useState('');
  const [ dataProducts, setDataProducts ] = useState([]);
  const [ showModal, setShowModal ] = useState(false);
  const [ titleModal, setTitleModal ] = useState('');
  const [ messageModal, setMessageModal ] = useState('');
  const [ showModalAction, setShowModalAction ] = useState(false);
  const [ selectDeleteProduct, setSelectDeleteProduct ] = useState(null);

  const searchItem = () => {
    const filters = { name };

    setLoading(true);

    Meteor.call('searchProducts', filters, function(error, result) {
      setLoading(false);
      if (error) {
        setTitleModal('Error');
        setMessageModal(error.reason);
        return setShowModal(true);
      }

      if (result) {
        setDataProducts(result);
      }
    });
  };

  useEffect(() => {
    searchItem();
  }, []);

  const deleteProduct = (productId) => {
    setLoading(true);

    Meteor.call('deleteProduct', productId, function(error, result) {
      setLoading(false);
      if (error) {
        setTitleModal('Error');
        setMessageModal(error.reason);
        return setShowModal(true);
      }

      if (result) {
        setTitleModal('Éxito');
        setMessageModal('Producto eliminado');
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
      dataField: 'description',
      text: 'Descripción',
      formatter: (cell, row) => (
        cell ? cell : '--'
      ),
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
              setSelectDeleteProduct(row._id);
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
          setSelectDeleteProduct(null);
        }}
        title={'Eliminar'}
        message={'¿Desea eliminar este producto?'}
        handleAction={() => {
          setShowModalAction(false);
          deleteProduct(selectDeleteProduct);
        }}
        titleAction="Eliminar"
      />
      <TitleSection title="Productos" back={true} />
      <Row className="mb-3">
        <Col xs={6}>
          <h4 className="title-info">
            Total: {''}
            {dataProducts.length}
          </h4>
        </Col>
        <Col xs={6} className="text-end">
          <Button variant="teal" onClick={() => history.push('/addProducts')}>
            Nuevo producto
          </Button>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
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
                      variant="success"
                      className="btn-100 mt-0 mt-md-3"
                      onClick={() => searchItem()}
                    >
                      Buscar
                    </Button>
                  </Col>
                  <Col xs={12}><hr /></Col>
                </Row>
              </Form>
              {dataProducts.length > 0 && (
                <div className="table-responsive">
                  <BootstrapTable
                    ref={ n => node = n }
                    keyField='_id'
                    data={ dataProducts }
                    columns={ columns }
                    pagination={paginationFactory()}
                    striped
                    condensed
                  />
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </section>
  );
};
