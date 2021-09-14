import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { faAward, faExchangeAlt, faEye, faPaste, faShoppingCart, faStore, faUsersCog } from '@fortawesome/free-solid-svg-icons';

import { CardCircleIcon } from '/imports/ui/components/buttons/CardButtons';
import UserCard from '/imports/ui/components/cards/UserCard';
import TitleSection from '/imports/ui/components/pages/TitleSection';

const optionsAdmin = [
  {title: 'Ver movimientos', link: '/movements', icon: faExchangeAlt, type: 'admin'},
  {title: 'Configurar valores', link: '/qualities', icon: faAward, type: 'admin'},
  // {title: 'Correr un reporte', link: '/reports', icon: faPaste, type: 'admin'},
  {title: 'Administrar empleados', link: '/employees', icon: faUsersCog, type: 'admin'},
  {title: 'Administrar la tienda', link: '/store', icon: faStore, type: 'admin'}
];

const optionsUser = [
  {title: 'Ver mis puntos', link: '/myPoints', icon: faEye, type: 'user'},
  {title: 'Usar mis puntos', link: '/usePoints', icon: faShoppingCart, type: 'user'},
  {title: 'Dar un reconocimiento', link: '/newRecognition', icon: faAward, type: 'user'},
];

export default Dashboard = (props) => {

  const { roles } = props;
  const [ isAdmin, setAdmin ] = useState(false);

  useEffect(() => {

    const user = roles[0] == 'admin' || roles[0] == 'superadmin';

    if (user) {
      setAdmin(user);
    }
  }, []);

  const renderOption = (data, index) => {
    const { icon, link, title, type } = data;
  
    return (
      <Col md={6} className="mt-3 mb-3" key={`item-${index}`}>
        <CardCircleIcon
          icon={icon}
          link={link}
          title={title}
          type={type}
        />
      </Col>
    );
  };

  return (
    <section>
      <TitleSection classes="text-center" title="¿Qué quieres hacer?" />
      <Row>
        <Col md={6} className="mt-3 mb-3">
          <UserCard designCol={true} user={props.userId} />
        </Col>
        {isAdmin
          ? optionsAdmin.map((item, index) => renderOption(item, index))
          : optionsUser.map((item, index) => renderOption(item, index))
        }
      </Row>
    </section>
  );
};
