import React, { useState } from 'react';
import { Card, Col, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { Steps, Step } from 'react-step-builder';

import { useAllQualities, useAllUsers } from '/imports/startup/client/hooks';

import ActionModal from '/imports/ui/components/modals/ActionModal';
import BackButton from '/imports/ui/components/buttons/BackButton';
import ConfirmModal from '/imports/ui/components/modals/ConfirmModal';
import LoadingView from '/imports/ui/components/loading/LoadingView';

import EmployeeStep from '/imports/ui/components/employeeStep/EmployeeStep';
import MessageStep from '/imports/ui/components/employeeStep/MessageStep';
import BehaviorStep from '/imports/ui/components/employeeStep/BehaviorStep';
import QualityStep from '/imports/ui/components/employeeStep/QualityStep';
import FinalStep from '/imports/ui/components/employeeStep/FinalStep';
import TitleSection from '/imports/ui/components/pages/TitleSection';

export default NewRecognition = (props) => {

  const history = useHistory();
  const { register, handleSubmit } = useForm();
  const [ loading, setLoading ] = useState(false);
  const [ idRecognition, setIdRecognition ] = useState('');
  const [ showModal, setShowModal ] = useState(false);
  const [ titleModal, setTitleModal ] = useState('');
  const [ messageModal, setMessageModal ] = useState('');
  const [ showModalAction, setShowModalAction ] = useState(false);
  const [ titleModalAction, setTitleModalAction ] = useState('');
  const [ messageModalAction, setMessageModalAction ] = useState('');

  const { loading: loading1, allQualities } = useAllQualities();
  const { loading: loading2, allUsers } = useAllUsers();


  const onSubmit = data => {
    setLoading(true);

    data.username = props.userId;

    Meteor.call('newRecognition', data, function(error, result) {
      setLoading(false);
      if (error) {
        setTitleModal('Error');
        setMessageModal(error.reason);
        return setShowModal(true);
      }

      if (result) {
        setIdRecognition(result);
        setTitleModalAction('Éxito');
        setMessageModalAction('Tu reconocimiento ha sido enviado a revisión.');

        return setShowModalAction(true);
      }
    });
  };

  if (loading || loading1 || loading2) {
    return <LoadingView />;
  };

  return (
    <section>
      <ConfirmModal 
        show={showModal}
        handleClose={() => setShowModal(false)}
        title={titleModal}
        message={messageModal}
      />
      <ActionModal
        show={showModalAction}
        handleClose={() => setShowModalAction(false)}
        title={titleModalAction}
        message={messageModalAction}
        handleAction={() => history.push(`/recognition/view/${idRecognition}`)}
        titleAction="Ver"
      />
      <TitleSection title="Reconocimiento" back={true} />
      <Form onSubmit={ handleSubmit(onSubmit) }>
        <Card>
          <Card.Body>
            <Steps>
              <Step title="Usuario a reconocer" component={EmployeeStep} />
              <Step title="Valor" component={QualityStep} qualitites={allQualities} />
              <Step title="Comportamiento" component={BehaviorStep} qualitites={allQualities} />
              <Step title="Mensaje" component={MessageStep} />
              <Step
                title="Guardar"
                component={FinalStep}
                qualitites={allQualities}
                users={allUsers}
                saveRecognition={(data) => onSubmit(data)}
              />
            </Steps>
          </Card.Body>
        </Card>
      </Form>
    </section>
  );
};
