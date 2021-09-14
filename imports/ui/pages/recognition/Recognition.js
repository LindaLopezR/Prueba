import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { faAward, faHands, } from '@fortawesome/free-solid-svg-icons';

import { CardCircleIcon } from '/imports/ui/components/buttons/CardButtons';
import TitleSection from '/imports/ui/components/pages/TitleSection';

const optionsRecognition = [
  {title: 'Reconocimientos', link: '/recognitions', icon: faAward, type: 'store'},
  {title: 'Valores', link: '/qualities', icon: faHands, type: 'store'},
];

export default Recognition = (props) => {

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
          {...props}
        />
      </Col>
    );
  };

  return (
    <section>
      <TitleSection title="Reconocimientos" back={true} />
      <Row>
        {optionsRecognition.map((item, index) => renderOption(item, index))}
      </Row>
    </section>
  );
};
