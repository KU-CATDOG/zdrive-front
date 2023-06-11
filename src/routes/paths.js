function path(root, sublink) {
  return `${root}${sublink}`;
}

const ZDRIVE = '/zdrive';

// add const based on path from Router.js
export const PATHS = {
  root: ZDRIVE,
  login: path(ZDRIVE, '/login'),
  main: path(ZDRIVE, '/main'),
  project: {
    list: path(ZDRIVE, '/project/list'),
    detail: path(ZDRIVE, '/project/detail')
  }
}