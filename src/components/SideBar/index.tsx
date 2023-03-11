import loadable from '@loadable/component';

const SideBarLazy = loadable(() => import('./component'));

export default SideBarLazy;
