import loadable from '@loadable/component';

const CommentModalLazy = loadable(() => import('./component'));

export default CommentModalLazy;
