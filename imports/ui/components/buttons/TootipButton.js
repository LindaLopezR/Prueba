import React from 'react';
import { Button, OverlayTrigger, Tooltip, } from 'react-bootstrap';

export default TooltipButton = props => {
  const { condition, content, handleSave = () => {}, tooltipMessage, variant } = props;

  const styleBtn = condition && "disable-btn";

  return (
    <OverlayTrigger overlay={condition ? <Tooltip id="tooltip-disabled">{tooltipMessage}</Tooltip> : <div />}>
      <span>
        <Button
          variant={variant}
          onClick={handleSave}
          disabled={condition}
          className={styleBtn}
        >
          {content}
        </Button>
      </span>
    </OverlayTrigger>
  );
};
