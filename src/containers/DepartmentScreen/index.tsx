import loadable from '@loadable/component';

const DepartmentScreenLazy = loadable(() => import('./component'));

export default DepartmentScreenLazy;
