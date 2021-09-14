import React from 'react';
import { Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const CardCircleIcon = props => {
  const { icon, iconTooltip, link, title, type } = props;

  const colorItems = props.roles 
    ? props.roles[0] == 'user' && 'userColor'
    : null;

  return (
    <a href={link} className="text-decoration-none">
      <Card className={`button-card ${type} ${colorItems}`}>
        <Card.Body className="d-flex align-items-center">
          <h2>
            {iconTooltip
              ? (<span className="fa-layers fa-fw iconItem">
                  <FontAwesomeIcon icon={icon} />
                  <FontAwesomeIcon
                    icon={iconTooltip}
                    transform="shrink-8 right-9 up-6"
                    className="index-icon"
                  />
                </span>)
              : (<div className="iconItem">
                  <FontAwesomeIcon icon={icon} />
                </div>)
            }{' '}
            <span>{title}</span>
          </h2>
        </Card.Body>
      </Card>
    </a>
  );
};
