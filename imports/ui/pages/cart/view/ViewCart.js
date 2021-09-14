import React, { useEffect, useState } from 'react';
import { Card, Col, Row, } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { faShoppingCart, } from '@fortawesome/free-solid-svg-icons';

import { useAllActiveProducts } from '/imports/startup/client/hooks';

import ConfirmModal from '/imports/ui/components/modals/ConfirmModal';
import LoadingView from '/imports/ui/components/loading/LoadingView';
import TableProducts from '/imports/ui/components/tables/TableProducts';
import TitleSection from '/imports/ui/components/pages/TitleSection';
import TootipButton from '/imports/ui/components/buttons/TootipButton';

export default ListCategories = (props) => {

  const { userId } = props;
  const history = useHistory();
  const [ pointsUser, setPointsUser ] = useState(0);
  const [ loading, setLoading ] = useState(false);

  const [ showModal, setShowModal ] = useState(false);
  const [ titleModal, setTitleModal ] = useState('');
  const [ messageModal, setMessageModal ] = useState('');
  const [ listProducts, getListProducts ] = useState([]);
  const [ pointsTotal, getPointsTotal ] = useState(0);

  const { loading: loading1, allProducts } = useAllActiveProducts();

  const products = localStorage.getItem('PRODUCTS_CART');
  const dataProducts = JSON.parse(products);

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

  const getTotalPoints = () => {
    if (listProducts && listProducts.length > 0) {
      let msgTotal = listProducts.reduce(function(prev, cur) {
        return prev + cur.points;
      }, 0);
      getPointsTotal(msgTotal)

    } else {
      getPointsTotal(0);
    }
  }

  useEffect(() => {
    getPoints();
  }, []);

  useEffect(() => {
    getTotalPoints();
  }, [listProducts]);

  useEffect(() => {
    if (dataProducts && dataProducts.length > 0) {
      let data = [];
      dataProducts.map(product => allProducts.map(i => {
        if (product.productId == i._id) {
          data.push(i);
        }
      }));
      getListProducts(data);
    }
  }, [allProducts]);

  const deleteItem = (item) => {
    const data = listProducts.filter(i => i._id !== item._id);
    localStorage.setItem('PRODUCTS_CART', JSON.stringify(data));

    getListProducts(data);
  }

  if (loading || loading1) {
    return <LoadingView />;
  };

  const disabled = parseInt(pointsTotal) > parseInt(pointsUser);

  return (
    <section>
      <ConfirmModal 
        show={showModal}
        handleClose={() => setShowModal(false)}
        title={titleModal}
        message={messageModal}
      />
      <TitleSection title="Carrito" back={true} />
      <Row>
        <Col md={12}>
          <Card>
            <Card.Body>
              {listProducts.length > 0
                ? (
                  <Row>
                    <Col xs={12}>
                      <TableProducts
                        products={listProducts}
                        deleteOption={true}
                        deleteAction={(item) => deleteItem(item)}
                      />
                    </Col>
                    <Col xs={12} className="text-end">
                      <h4>
                        <span className="font-weight-light">Total de puntos:</span>{' '}
                        {pointsTotal}
                      </h4>
                      <h4>
                        <span className="font-weight-light">Cantidad de productos:</span>{' '}
                        {listProducts.length}
                      </h4>
                    </Col>
                    <Col xs={12} className="text-end mt-3">
                      <TootipButton
                        condition={disabled}
                        handleSave={() => history.push('/order')}
                        content={"Canjear"}
                        tooltipMessage="Puntos insuficientes"
                        variant="teal"
                      />
                      {disabled && <p className="text-danger">* Puntos insuficientes</p>}
                    </Col>
                  </Row>
                  )
                : <NoData title="Tu carrito está vacío." icon={faShoppingCart} />
              }
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </section>
  );
};
