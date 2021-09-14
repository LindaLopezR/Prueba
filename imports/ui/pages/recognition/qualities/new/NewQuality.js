import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, FormGroup, ListGroup, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHiking, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useHistory, useParams } from 'react-router-dom';
import { SketchPicker } from 'react-color';
import { useForm } from 'react-hook-form';

import { useQualityById } from '/imports/startup/client/hooks';

import LoadingView from '/imports/ui/components/loading/LoadingView';
import ConfirmModal from '/imports/ui/components/modals/ConfirmModal';
import NoData from '/imports/ui/components/noData/NoData';
import TitleSection from '/imports/ui/components/pages/TitleSection';

const MODES = {
  NEW: 'NEW',
  EDIT: 'EDIT'
};

const MODE_NAMES = {
  NEW: 'Nuevo',
  EDIT: 'Editar'
};

export default NewQuality = (props) => {

  const { mode } = props;
  const history = useHistory();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const [ loading, setLoading ] = useState(false);
  const [ behavior, setBehavior ] = useState('');
  const [ listBehaviors, getListBehaviors ] = useState([]);
  const [ showModal, setShowModal ] = useState(false);
  const [ titleModal, setTitleModal ] = useState('');
  const [ messageModal, setMessageModal ] = useState('');
  const [ nameQuality, setNameQuality ] = useState('');
  const [ points, setPoints ] = useState('');

  const [ displayColor, setDisplayColor ] = useState(false);
  const [ colorSelected, setColorSelected ] = useState('#c9c9c9');

  let quality = null;
  if (mode === MODES.EDIT) {
    const { id } = useParams();
    const qualityData = useQualityById(id);
    quality = qualityData.quality;
  }

  useEffect(() => {

    if (quality) {
      const { behaviors, defaultPoints, name, color } = quality;

      setNameQuality(name);
      setColorSelected(color);
      getListBehaviors(behaviors);
      setPoints(defaultPoints ? defaultPoints : '');
      setLoading(false);
    }
  }, [quality]);

  const onSubmit = data => {

    const json = data;
    json.name = nameQuality;
    json.color = colorSelected;
    json.behaviors = listBehaviors;
    json.defaultPoints = points;

    if (listBehaviors.length < 1) {
      setTitleModal('Error');
      setMessageModal('Agrega al menos un comportamiento.');
      return setShowModal(true);
    }

    setLoading(true);

    const callback = (error, result) => {
      setLoading(false);
      if (error) {
        setTitleModal('Error');
        setMessageModal(error.reason);
        return setShowModal(true);
      }

      if (result) {
        history.goBack();
      };
    };

    if (mode === MODES.NEW) {
      Meteor.call('newQuality', json, callback);
    } else if (mode === MODES.EDIT) {
      Meteor.call('editQuality', quality._id, data, callback);
    }
  };

  const addBehavior = () => {
    const lower = behavior.toLocaleLowerCase();
    const validation = listBehaviors.filter(item => item.name.toLowerCase().includes(lower));

    if (validation.length > 0) {
      setTitleModal('Error');
      setMessageModal('El nombre del comportamiento ya existe.');
      return setShowModal(true);
    }

    const newItem = { name: behavior };
    setBehavior('');
    getListBehaviors([...listBehaviors, newItem]);
  };

  const deleteItem = (item) => {
    const data = listBehaviors.filter(i => i.name !== item.name);
    getListBehaviors(data);
  };

  if (loading) {
    return <LoadingView />;
  };

  const title = `${MODE_NAMES[mode]} valor`;

  return (
    <section>
      <ConfirmModal 
        show={showModal}
        handleClose={() => setShowModal(false)}
        title={titleModal}
        message={messageModal}
      />
      <TitleSection title={title} back={true} />
      <Form onSubmit={ handleSubmit(onSubmit) }>
        <Row>
          <Col xs={12}>
            <Card className="section-color">
              <Card.Body>
                <Row className="mb-3">
                  <Form.Group
                    as={Col}
                    xs={12}
                    md={6}
                    controlId="name"
                  >
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control 
                      type="text"
                      value={nameQuality}
                      placeholder="Nombre"
                      onChange={e => setNameQuality(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group
                    as={Col}
                    xs={10}
                    md={5}
                    controlId="defaultPoints"
                  >
                    <Form.Label>Puntos de default</Form.Label>
                    <Form.Control
                      type="text"
                      min={0}
                      value={points}
                      placeholder="Número de puntos"
                      onChange={e => setPoints(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group
                    as={Col}
                    xs={2}
                    md={1}
                    controlId="colorQuality"
                  >
                    <Form.Label>Color</Form.Label>
                    <div className="content-100">
                      <div
                        className="input-color"
                        onClick={() => setDisplayColor(!displayColor)}
                      >
                        <div
                          className="color-picker"
                          style={{ backgroundColor: colorSelected }}
                        />
                      </div>
                      { displayColor 
                        ? <div className="popover-color">
                            <div
                              className="cover-color"
                              onClick={() => setDisplayColor(false)}
                            />
                            <SketchPicker
                              color={colorSelected}
                              onChange={(color) => setColorSelected(color.hex)}
                            />
                          </div> 
                        : null
                      }

                    </div>
                  </Form.Group>
                </Row>

                <Row className="mt-3">
                  <Col md={6}>
                    <Row>
                      <Col md={6} className="my-1">
                        <Form.Label>Comportamientos</Form.Label>
                        <Form.Control
                          type="text"
                          name="behavior"
                          value={behavior}
                          onChange={(e) => setBehavior(e.target.value)}
                        />
                      </Col>
                      <Col md={6} className="my-1">
                        <p className="mb-2 d-none d-md-block">&nbsp;</p>
                        <Button
                          type="button"
                          variant="teal"
                          onClick={() => addBehavior()}
                        >
                          Agregar comportamiento
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                  <Col md={6} className="mt-3 mt-md-0">
                    {listBehaviors.length > 0 
                      ? (<ListGroup>
                        {listBehaviors.map((item, index) => (
                          <ListGroup.Item key={`behavior-${index}`}>
                            <Row>
                              <Col xs={10}>
                                {item.name}
                              </Col>
                              <Col xs={2}>
                                <Button
                                  type="button"
                                  variant="outline-danger"
                                  onClick={() => deleteItem(item)}
                                  size="sm"
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </Button>
                              </Col>
                            </Row>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>)
                      : <NoData icon={faHiking} title="Sin comportamientos" />
                    }
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} className="text-end mt-3">
            <hr />
            <Button
              variant="outline-secondary"
              className="mr-1"
              onClick={() => history.goBack()}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="success">
              Guardar
            </Button>
          </Col>
        </Row>
      </Form>
    </section>
  );
};
