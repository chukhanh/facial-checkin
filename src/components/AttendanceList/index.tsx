import loadable from '@loadable/component';

const AttendanceListLazy = loadable(() => import('./component'));

export default AttendanceListLazy;
