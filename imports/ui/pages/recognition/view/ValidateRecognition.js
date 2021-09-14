import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Alert, Button } from 'react-bootstrap';

import { useRecognitionById } from '/imports/startup/client/hooks';

import ActionModal from '/imports/ui/components/modals/ActionModal';
import FormModal from '/imports/ui/components/modals/FormModal';
import LoadingView from '/imports/ui/components/loading/LoadingView';
import RecognitionCard from '/imports/ui/components/cards/RecognitionCard';
import TitleSection from '/imports/ui/components/pages/TitleSection';
import { recognitionColorStatus } from '../../utils/formatters';

export default ValidateRecognition = () => {

  const history = useHistory();
  const { id } = useParams();

  const [ loading, setLoading ] = useState(false);
  const [ defaultPoints, setDefaultPoints ] = useState(0);
  const [ showModalAction, setShowModalAction ] = useState(false);
  const [ showModalConfirm, setShowModalConfirm ] = useState(false);

  const { loading: loading1, recognition, allQualities, allUsers } = useRecognitionById(id);

  const cancelRecognition = () => {
    const query = {
      recognition: id,
    };

    setLoading(true);

    Meteor.call('cancelRecognition', query, function(error, result) {
      setLoading(false);
      if (error) {
        setTitleModal('Error');
        setMessageModal(error.reason);
        return setShowModal(true);
      }

      if (result) {
        alert('Reconocimiento cancelado');
        history.push('/movements');
      }
    });
  };

  const updateRecognition = (data) => {
    
    const query = {
      recognition: recognition._id,
      userId: recognition.owner,
      points: data
    };

    setShowModalAction(false);
    setLoading(true);

    Meteor.call('updatePointsUser', query, function(error, result) {
      setLoading(false);
      if (error) {
        setTitleModal('Error'); 
        setMessageModal(error.reason);
        return setShowModal(true);
      }

      if (result) {
        alert('Puntos asignados');
        history.push('/movements');
      }
    });
  };

  if (loading || loading1) {
    return <LoadingView />;
  };

  return (
    <section>
      <FormModal
        show={showModalAction}
        handleClose={() => {
          setDefaultPoints(0);
          setShowModalAction(false);
        }}
        title={'Asignar puntos'}
        message={defaultPoints ? 'Puntos default' : 'Asignar puntos'}
        handleAction={(data) => {
          setDefaultPoints(0);
          updateRecognition(data)
        }}
        titleAction="Actualizar"
        value={defaultPoints}
      />
      <ActionModal
        show={showModalConfirm}
        handleClose={() => setShowModalConfirm(false)}
        title={'Cancelar'}
        message={'¿Desea cancelar el reconocimiento?'}
        handleAction={() => cancelRecognition()}
        titleAction="Aceptar"
      />
      <TitleSection classes="mt-3" title="Reconocimiento" />
      <RecognitionCard
        data={recognition}
        qualitites={allQualities}
        users={allUsers}
      />
      {recognition && recognition.status !== 'PENDIENT' && (
        <Alert variant={recognitionColorStatus(recognition.status)}>
          <Alert.Heading className="text-center">
            {recognition.status}
          </Alert.Heading>
        </Alert>
      )}
      {recognition && recognition.status == 'PENDIENT' && (
        <Alert variant="light">
          <center>
            <Button
              variant="teal"
              onClick={() => {
                const qualityPoints = allQualities.find(quality => quality._id == recognition.quality);
                const points = qualityPoints.defaultPoints && qualityPoints.defaultPoints != ''
                  ? qualityPoints.defaultPoints
                  : null;
                setDefaultPoints(points);
                setShowModalAction(true);
              }}
            >
              Aprobar
            </Button>
            <Button
              variant="danger"
              className="ml-3"
              onClick={() => setShowModalConfirm(true)}
            >
              Cancelar
            </Button>
          </center>
        </Alert>
      )}
    </section>
  );
};
