import React, { useState } from 'react';
import { Card, Col, Form, Row, } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { Steps, Step } from 'react-step-builder';

import { useAllActiveProducts, useAllUsers } from '/imports/startup/client/hooks';

import OrderConfirm from '/imports/ui/components/cartStep/OrderConfirm';
import OrderData from '/imports/ui/components/cartStep/OrderData';

import ActionModal from '/imports/ui/components/modals/ActionModal';
import ConfirmModal from '/imports/ui/components/modals/ConfirmModal';
import LoadingView from '/imports/ui/components/loading/LoadingView';
import TitleSection from '/imports/ui/components/pages/TitleSection';

export default OrderDetail = (props) => {

  const history = useHistory();
  const { register, handleSubmit } = useForm();
  const [ loading, setLoading ] = useState(false);
  const [ showModal, setShowModal ] = useState(false);
  const [ titleModal, setTitleModal ] = useState('');
  const [ messageModal, setMessageModal ] = useState('');
  const [ showModalConfirm, setShowModalConfirm ] = useState(false);

  const { loading: loading1, allUsers } = useAllUsers();
  const { loading: loading2, allProducts } = useAllActiveProducts();

  const onSubmit = data => {
    setLoading(true);
    const productsLocal = localStorage.getItem('PRODUCTS_CART');
    const dataProducts = JSON.parse(productsLocal);

    let infoProducts = [];
    let idsProducts = [];
    let namesProducts = [];
    dataProducts.map(product => allProducts.map(i => {
      if (product.productId == i._id) {
        infoProducts.push(i);
        idsProducts.push(i._id);
        namesProducts.push(`${i.name}, `);
      }
    }));

    let pointsTotal = infoProducts.reduce(function(prev, cur) {
      return prev + cur.points;
    }, 0);

    data.products = idsProducts;
    data.note = `Intercambio por: ${namesProducts}`;
    data.points = pointsTotal;
    data.owner = props.userId;

    console.log('Data => ', data);

    Meteor.call('orderUser', data, function(error, result) {
      setLoading(false);

      if (error) {
        return alert(`Error, ${error}`);
      }

      if (result) {
        localStorage.setItem('PRODUCTS_CART', JSON.stringify([]));
        return setShowModalConfirm(true);
      } 
    });
  };

  if (loading || loading1 || loading2) {
    return <LoadingView />;
  };

  return (
    <section>
      <ActionModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        title={titleModal}
        message={messageModal}
        handleAction={() => history.push('/usePoints')}
        titleAction="Aceptar"
      />
      <ConfirmModal 
        show={showModalConfirm}
        handleClose={() => {
          setShowModal(false);
          history.push('/usePoints');
        }}
        title="Éxito"
        message="Pasa por tu orden en horario de oficina"
      />
      <TitleSection title="Detalle del pedido" back={true} />
      <Row>
        <Col md={12}>
          <Card>
            <Card.Body>
              <Form onSubmit={ handleSubmit(onSubmit) }>
                <Steps>
                  {/* <Step
                    title="Datos del pedido"
                    component={OrderData}
                    userId={props.userId}
                    users={allUsers}
                  /> */}
                  <Step
                    title="Confirmación"
                    component={OrderConfirm}
                    userId={props.userId}
                    users={allUsers}
                    products={allProducts}
                    saveOrder={(data) => onSubmit(data)}
                  />
                </Steps>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </section>
  );
};
