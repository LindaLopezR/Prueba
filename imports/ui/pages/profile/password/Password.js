import React, { useState } from 'react';

import ConfirmModal from '/imports/ui/components/modals/ConfirmModal';
import LoadingComponent from '/imports/ui/components/loading/LoadingComponent';
import { Passwords } from '/imports/ui/components/form/Passwords';

export default Password = (props) => {

  const { user } = props;
  const [ loading, setLoading ] = useState(false);
  const [ showModal, setShowModal ] = useState(false);
  const [ titleModal, setTitleModal ] = useState('');
  const [ messageModal, setMessageModal ] = useState('');

  const changePassword = data => {

    const { password, confirmPassword } = data;

    if (password !== confirmPassword) {
      setTitleModal('Error');
      setMessageModal('Contraseñas no coinciden.');
      return setShowModal(true);
    }

    const json = {
      userId: user,
      password,
    };

    setLoading(true);

    Meteor.call('confirmUserPassword', json, (error, result) => {
      setLoading(false);

      if (error) {
        setTitleModal('Error');
        setMessageModal(error.reason);
        return setShowModal(true);
      }
    });
  };

  if (loading) {
    return <LoadingComponent />;
  };

  return (
    <section>
      <ConfirmModal 
        show={showModal}
        handleClose={() => setShowModal(false)}
        title={titleModal}
        message={messageModal}
      />
      <h4>Cambiar contraseña</h4>
      <Passwords
        handleSave={(data) => changePassword(data)}
      /> 
    </section>
  );
};
