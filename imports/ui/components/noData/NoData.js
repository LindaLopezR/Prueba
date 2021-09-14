import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default NoData = props => {
  const { icon, title, } = props;

  return (
    <div className="d-flex align-items-center justify-content-center flex-column">
      <FontAwesomeIcon icon={icon} size="6x" className="icon-lightColor" />
      <h3 className="mt-3">{title}</h3>
    </div>
  );
};
