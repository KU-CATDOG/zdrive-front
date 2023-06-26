function path(root, sublink) {
  return `${root}${sublink}`;
}

const ZDRIVE = "/zdrive";

// add const based on path from Router.js
// eslint-disable-next-line import/prefer-default-export
export const PATHS = {
  root: ZDRIVE,
  login: path(ZDRIVE, "/login"),
  main: path(ZDRIVE, "/main"),
  project: {
    add: path(ZDRIVE, "/project/add"),
    list: path(ZDRIVE, "/project/list"),
    detail: path(ZDRIVE, "/project/detail"),
    edit: path(ZDRIVE, "/project/edit"),
  },
  about: path(ZDRIVE, "/about"),
};
