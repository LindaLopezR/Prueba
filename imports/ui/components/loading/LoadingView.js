import React from 'react';

export default LoadingView = () => {
	return (
		<div className="loading-view">
			<div id="loader" />
			<span className="sr-only mt-2">Cargando...</span>
		</div>
	);
}
