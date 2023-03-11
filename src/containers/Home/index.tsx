import loadable from '@loadable/component';

const HomeLazy = loadable(() => import('./component'));

export default HomeLazy;
