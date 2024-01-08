import React from 'react';

import './styles.scss';

interface IProps {
  visible: boolean;
  children: React.ReactNode;
}

const Dialog = (props: IProps) => {

  return (
    <div className={`ffa-dialog ${props.visible ? '' : 'hidden'}`}>
      {props.children}
    </div>
  );
};

export default Dialog;