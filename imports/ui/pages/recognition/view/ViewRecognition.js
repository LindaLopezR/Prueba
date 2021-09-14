import React from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { useRecognitionById } from '/imports/startup/client/hooks';

import BackButton from '/imports/ui/components/buttons/BackButton';
import RecognitionCard from '/imports/ui/components/cards/RecognitionCard';
import TitleSection from '/imports/ui/components/pages/TitleSection';

export default ViewRecognition = () => {

  const history = useHistory();
  const { id } = useParams();

  const { loading, recognition, allQualities, allUsers } = useRecognitionById(id);

  if (loading) {
    return <LoadingView />;
  };

  return (
    <section>
      <BackButton handleBack={() => history.push('/')} />
      <TitleSection classes="mt-3" title="Reconocimiento" />
      <RecognitionCard
        data={recognition}
        qualitites={allQualities}
        users={allUsers}
      />
    </section>
  );
};
