import loadable from '@loadable/component';

const StaffListLazy = loadable(() => import('./component'));

export default StaffListLazy;
