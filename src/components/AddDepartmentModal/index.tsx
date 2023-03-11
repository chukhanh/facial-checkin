import loadable from '@loadable/component';

const AddDepartmentModalLazy = loadable(() => import('./component'));

export default AddDepartmentModalLazy;
