import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export default LoadingComponent = () => {
	return (
		<div className="d-flex align-items-center justify-content-center flex-column mt-5 mb-5">
			<FontAwesomeIcon icon={faSpinner} className="icon-secondaryColor" size="3x" pulse />
			<h3 className="d-none d-md-block mt-3">Espere...</h3>
		</div>
	);
}
