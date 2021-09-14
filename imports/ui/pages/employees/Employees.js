import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { faKey, faUsersCog } from '@fortawesome/free-solid-svg-icons';

import { CardCircleIcon } from '/imports/ui/components/buttons/CardButtons';
import TitleSection from '/imports/ui/components/pages/TitleSection';

const optionsEmployees = [
  {title: 'Actualizar base de empleados', link: '/employeesUpdate', icon: faUsersCog, type: 'admin'},
  {title: 'Administrar contraseñas', link: '/employeesPasswords', icon: faKey, type: 'admin'},
];

export default Employees = () => {

  const renderOption = (data, index) => {
    const { icon, iconTooltip, link, title, type} = data;
  
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
      <TitleSection title="Empleados" classes="text-center" back={true} />
      <Row>
        {optionsEmployees.map((item, index) => renderOption(item, index))}
      </Row>
    </section>
  );
};
