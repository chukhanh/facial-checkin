import loadable from '@loadable/component';

const LoginLazy = loadable(() => import('./component'));

export default LoginLazy;
