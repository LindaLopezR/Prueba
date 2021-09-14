import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { faBoxes, faClipboardList, faPlusCircle, faShoppingCart, faTags, } from '@fortawesome/free-solid-svg-icons';

import { CardCircleIcon } from '/imports/ui/components/buttons/CardButtons';
import TitleSection from '/imports/ui/components/pages/TitleSection';

const optionsStore = [
  {title: 'Productos', link: '/deleteProducts', icon: faShoppingCart, type: 'store'},
  {title: 'Categorias', link: '/categories', icon: faTags, type: 'store'},
  {title: 'Revisar inventarios', link: '/inventories', icon: faBoxes, type: 'store'},
  {title: 'Requerimientos', link: '/requirements', icon: faClipboardList, type: 'store'},
];

export default Store = () => {

  const renderOption = (data, index) => {
    const { icon, iconTooltip, link, title, type } = data;
  
    return (
      <Col xs={12} md={6} className="mt-3" key={`item-${index}`}>
        <CardCircleIcon
          icon={icon}
          iconTooltip={iconTooltip}
          link={link}
          title={title}
          type={type}
        />
      </Col>
    );
  };

  return (
    <section>
      <TitleSection title="Administrar tienda" back={true} />
      <Row>
        {optionsStore.map((item, index) => renderOption(item, index))}
      </Row>
    </section>
  );
};
