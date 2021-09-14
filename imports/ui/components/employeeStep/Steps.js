import React from 'react';
import { Col, Row } from 'react-bootstrap';

export default Steps = (props) => {
  
  const { allSteps, current } = props;

  return (
    <Row>
      <Col xs={12}>
        <div className="bs-stepper-header">
          {allSteps.map((step, index) => {
            const itemStatus = index+1;
            let activeItem = 'inactiveItem';
            let activeText = 'inactive';

            if (itemStatus == current || itemStatus < current) {
              activeItem = 'active';
              activeText = 'activeText';
            }
            
            return (
              <>
                <div className="step-trigger">
                  <span className={`bs-stepper-circle ${activeItem}`}>
                    {itemStatus}
                  </span>
                  <span className={`bs-stepper-label title ${activeText}`}>
                    {step.title}
                  </span>
                </div>
                <div className="line" />
              </>
            )}
          )}
        </div>
      </Col>
    </Row> 
  );
};
