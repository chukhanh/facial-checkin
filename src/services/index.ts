import axios from 'axios';

import { BASE_URL } from '../constants';

const shareInstance = axios.create();

shareInstance.defaults.baseURL = BASE_URL;

export default shareInstance;
