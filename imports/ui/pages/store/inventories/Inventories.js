import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faBoxes, } from '@fortawesome/free-solid-svg-icons';

import { useAllActiveProducts } from '/imports/startup/client/hooks';
import { renderOptions } from '/imports/ui/components/form/FormComponents';
import { getNameItem } from '/imports/ui/components/form/FormComponents';

import LoadingView from '/imports/ui/components/loading/LoadingView';
import ConfirmModal from '/imports/ui/components/modals/ConfirmModal';
import TitleSection from '/imports/ui/components/pages/TitleSection';

export default Inventories = () => {

  const history = useHistory();
  const [ loading, setLoading ] = useState(false);
  const [ product, setProduct ] = useState('');
  const [ inventories, setInventories ] = useState([]);
  const [ showModal, setShowModal ] = useState(false);
  const [ titleModal, setTitleModal ] = useState('');
  const [ messageModal, setMessageModal ] = useState('');

  const { loading: loading1, allProducts } = useAllActiveProducts();

  const searchItem = () => {
    const filters = { product };

    setLoading(true);

    Meteor.call('searchInventory', filters, function(error, result) {
      setLoading(false);
      if (error) {
        setTitleModal('Error');
        setMessageModal(error.reason);
        return setShowModal(true);
      }

      if (result) {
        setInventories(result);
      }
    });
  };

  useEffect(() => {
    searchItem();
  }, []);

  const columns = [
    {
      dataField: 'product',
      text: 'Producto',
      formatter: (cell, row) => getNameItem(cell, allProducts)
    }, {
      dataField: 'pieces',
      text: 'Piezas',
      formatter: (cell, row) => (
        <center>
          {cell}
        </center>
      )
    },{
      dataField: 'orders',
      text: 'Número de ordenes',
      formatter: (cell, row) => (
        <center>
          {cell ? cell.length : '--'}
        </center>
      )
    }, {
      dataField: 'edit',
      text: 'Editar existencias',
      formatter: (cell, row) => (
        <center>
          <Button
            variant="teal"
            className="btn-circle"
            onClick={() => history.push(`/editInventory/${row._id}`)}
          >
            <FontAwesomeIcon icon={faPencilAlt} />
          </Button>
        </center>
      )
    },
  ];

  if (loading || loading1) {
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
      <ConfirmModal 
        show={showModal}
        handleClose={() => setShowModal(false)}
        title={titleModal}
        message={messageModal}
      />
      <TitleSection title="Revisar inventarios" back={true} />
      <Row>
        <Col md={12} className="mt-3 mt-md-0">
          <Card>
            <Card.Body>
              <Form>
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
                      onClick={() => searchItem()}
                    >
                      Buscar
                    </Button>
                  </Col>
                  <Col xs={12}><hr /></Col>
                </Row>
              </Form>
            
              {inventories.length > 0
                ? (<div className="table-responsive">
                    <BootstrapTable
                      ref={ n => node = n }
                      keyField='_id'
                      data={ inventories }
                      columns={ columns }
                      pagination={paginationFactory()}
                      condensed
                      striped
                    />
                  </div>)
                : (<div className="mt-5">
                    <NoData title="Sin datos por mostrar" icon={faBoxes} />
                  </div>)
              }
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </section>
  );
};
