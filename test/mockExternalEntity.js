export default function (state = 'not done', action) {
  switch (action.type) {
    case 'EXTERNAL_ACTION':
      return 'done';
    default:
      return state;
  }
};
