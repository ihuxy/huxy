import React from 'react';
import styles from './index.less';

const Spinner=({global})=>{
  const className=global?`${styles.spinner} ${styles.global}`:styles.spinner;
  return <div className={className}>
    <figure className={styles.spinning} />
  </div>;
};

export default Spinner;







