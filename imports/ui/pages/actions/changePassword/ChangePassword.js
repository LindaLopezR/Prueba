import React, { useState } from 'react';
import { Button, Card, Form, Image } from 'react-bootstrap';
import { faUnlockAlt } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router-dom';

import LoadingView from '/imports/ui/components/loading/LoadingView';
import ConfirmModal from '/imports/ui/components/modals/ConfirmModal';
import NoData from '/imports/ui/components/noData/NoData';
import { Passwords } from '/imports/ui/components/form/Passwords';

const STAGES = {
  CHANGE_PASSWORD: 'CHANGE_PASSWORD',
  SUCCESS_PASSWORD: 'SUCCESS_PASSWORD',
};

export default ChangePassword = () => {

  const [ loading, setLoading] = useState(false);
  const [ showModal, setShowModal ] = useState(false);
  const [ titleModal, setTitleModal ] = useState('');
  const [ messageModal, setMessageModal ] = useState('');
  const [ currentStage, setCurrentStage ] = useState(STAGES.CHANGE_PASSWORD);

  const history = useHistory();

  const onSubmit = data => {

    const { password, confirmPassword } = data;

    if (password !== confirmPassword) {
      setTitleModal('Error');
      setMessageModal('Contraseñas no coinciden.');
      return setShowModal(true);
    }

    const tokensUrl = window.location.href.split('/');
    const json = {
      userId: tokensUrl[tokensUrl.length -1],
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

      if (result) {
        setCurrentStage(STAGES.SUCCESS_PASSWORD);
      }
    });
  };

  const renderFormPassword = () => {

    if (currentStage === STAGES.CHANGE_PASSWORD) {
      return <Passwords
        handleSave={(data) => onSubmit(data)}
      />;
    }

    if (currentStage === STAGES.SUCCESS_PASSWORD) {
      return (
        <Card>
          <Card.Body>
            <NoData icon={faUnlockAlt} title="Contraseña guardada" />
            <hr />
            <div className="text-center">
              <Button
                type="button"
                variant="action"
                onClick={() => history.push('/signin')}
              >
                Regresar
              </Button>
            </div>
          </Card.Body>
        </Card>
      );
    }
  }

  if (loading) {
    return <LoadingView />;
  }

  return (
    <div className="content-login">
      <ConfirmModal 
        show={showModal}
        handleClose={() => setShowModal(false)}
        title={titleModal}
        message={messageModal}
      />
      <div className="login">
        <div className="mx-auto text-center">
          <Image src="/img/logo.png" alt="Merit Medical logo"/>
        </div>
        <h4 className="text-center">
          Nueva contraseña
        </h4>
        {renderFormPassword()}
        <div>&nbsp;</div>
      </div>
    </div>
  );
  
};
