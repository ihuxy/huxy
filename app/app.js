import React from 'react';
import {useRouter,components as comp} from '@common';
import routers from './router';

const {Spinner}=comp;

import configs from './configs';

const App=()=>{
  const {components}=useRouter({routers,...configs});
  return components??<Spinner global />;
};

export default App;


