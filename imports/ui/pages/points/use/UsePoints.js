import React, { useEffect, useState } from 'react';
import { Button, Col, Image, Row, } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import Slider from 'react-slick';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxes, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

import { useAllActiveProducts } from '/imports/startup/client/hooks';

import ActionModal from '/imports/ui/components/modals/ActionModal';
import ConfirmModal from '/imports/ui/components/modals/ConfirmModal';
import BackButton from '/imports/ui/components/buttons/BackButton';
import TootipButton from '/imports/ui/components/buttons/TootipButton';

const settingsPoints = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 1,
  initialSlide: 0,
  autoplay: true,
  autoplaySpeed: 2000,
  pauseOnHover: true,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        dots: true
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 2
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ],
};

export default UsePoints = (props) => {

  const history = useHistory();

  const { userId } = props;
  const [ loading, setLoading ] = useState(false);
  const [ pointsUser, setPointsUser ] = useState(0);
  const [ productSelected, setProductSelect ] = useState(null);
  const [ showModalAction, setShowModalAction ] = useState(false);
  const [ showModal, setShowModal ] = useState(false);
  const [ titleModal, setTitleModal ] = useState('');
  const [ messageModal, setMessageModal ] = useState('');

  const { loading: loading1, allProducts } = useAllActiveProducts();

  const addProductCart = () => {
    const data = {productId: productSelected._id}
    let products = [];
    products = JSON.parse(localStorage.getItem('PRODUCTS_CART')) || [];
    products.push(data);
    localStorage.setItem('PRODUCTS_CART', JSON.stringify(products));

    setProductSelect(null);
    setShowModalAction(false);
  };

  const renderProduct = (data, index) => {
    const imgProduct = data.img ? data.img : '/img/not-img.jpg';
    const disabled = parseInt(data.points) > parseInt(pointsUser);

    return (
      <div key={`item-${index}`} className="text-center">
         <figure className="img-product-cart">
          <Image
            className="img-carrousel"
            src={imgProduct}
            alt={`Producto ${data.name}`}
          />
        </figure>
        <div className="name-product-content">
          <h4 className="mt-2">{data.name}</h4>
        </div>
        <h5 className="text-dark">
          <small>Puntos: <strong>{data.points}</strong></small>
        </h5>
        <TootipButton
          condition={disabled}
          handleSave={() => {
            setProductSelect(data);
            setShowModalAction(true);
          }}
          content={<FontAwesomeIcon icon={faShoppingCart} />}
          tooltipMessage="Puntos insuficientes"
          variant="primary"
        />
        {disabled && <p className="text-danger">* Puntos insuficientes</p>}
      </div>
    );
  }

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

  useEffect(() => {
    getPoints();
  }, []);

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
      <ActionModal
        show={showModalAction}
        handleClose={() => {
          setProductSelect(null);
          setShowModalAction(false);
        }}
        title={'Confirmación'}
        message={`¿Desea agregar ${productSelected && productSelected.name} a su carrito?`}
        handleAction={() => addProductCart()}
        titleAction="Aceptar"
      />
      <Row>
        <Col xs={12} md={6}>
          <h1>Mis puntos</h1>
        </Col>
        <Col xs={12} md={6} className="text-md-end">
          <h1>{pointsUser}</h1>
        </Col>
        <Col xs={12} className="text-end">
          <Button
            variant="teal"
            onClick={() => history.push('/cart')}
          >
            <FontAwesomeIcon icon={faShoppingCart} />{' '}
            Ver mi carrito
          </Button>
        </Col>
        <Col xs={12}>
          <hr />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          {allProducts.length > 0 
            ? <Slider {...settingsPoints}>
                {allProducts.map((product, index) => renderProduct(product, index))}
              </Slider>
            : <NoData icon={faBoxes} title="Productos no disponibles"/>
          }
        </Col>
      </Row>
      <Row className="mt-3">
        <Col xs={12}>
          <BackButton handleBack={() => history.push('/')} />
        </Col>
      </Row>
    </section>
  );
};
