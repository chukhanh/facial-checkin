import loadable from '@loadable/component';

const DepartmentListLazy = loadable(() => import('./component'));

export default DepartmentListLazy;
