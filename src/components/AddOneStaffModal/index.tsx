import loadable from '@loadable/component';

const AddOneStaffModalLazy = loadable(() => import('./component'));

export default AddOneStaffModalLazy;
