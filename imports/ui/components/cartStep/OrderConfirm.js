import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';

import Steps from '../employeeStep/Steps';
import TableProducts from '/imports/ui/components/tables/TableProducts';

export default OrderConfirm = (props) => {

  const { products, saveOrder, state, userId, users } = props;
  const [ user, getUser ] = useState();
  const [ data, getData ] = useState();
  const [ listProducts, getListProducts ] = useState([]);

  const productsLocal = localStorage.getItem('PRODUCTS_CART');
  const dataProducts = JSON.parse(productsLocal);

  useEffect(() => {
    if (state.length > 0 && state.name) {
      getData({username: state.name});
      getUser(state.name);
    } else {
      const data = users.find(i => i._id == userId);
      getData({username: data.profile.name});
      getUser(data.profile.name);
    }
  }, []);

  useEffect(() => {
    if (dataProducts && dataProducts.length > 0) {
      let data = [];
      dataProducts.map(product => products.map(i => {
        if (product.productId == i._id) {
          data.push(i);
        }
      }));
      getListProducts(data);
    }
  }, [products]);

  return (
    <>
      <Steps {...props} />
      <Row>
        <Col xs={12}>
          <hr />
        </Col>
        <Col xs={6} className="mt-3 mb-3">
          <p className="font-weight-light text-muted mb-0">
            <small>Nombre</small>
          </p>
          <p>{user}</p>
        </Col>
        <Col xs={6} className="mt-3 mb-3">
          <h4>Tu pedido</h4>
          <Card>
            <Card.Body>
              <TableProducts
                products={listProducts}
                deleteOption={false}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} className="mt-3 text-end">
          <Button
            type="submit"
            variant="success"
            onClick={() => saveOrder(data)}
          >
            Finalizar
          </Button>
        </Col>
      </Row>
    </>
  );
};
