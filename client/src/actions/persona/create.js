import { SubmissionError } from 'redux-form';
const {
    REACT_APP_API_ENTRYPOINT: GRAPHGL_HOST_HTTP,
} = process.env;


export function error(error) {
  return { type: 'PERSONA_CREATE_ERROR', error };
}

export function loading(loading) {
  return { type: 'PERSONA_CREATE_LOADING', loading };
}

export function success(created) {
  return { type: 'PERSONA_CREATE_SUCCESS', created };
}

export function create(values) {
  return dispatch => {
    dispatch(loading(true));

    let {nombres, apellidos, birthday, cargo, ci, edad, hijos, raza, salario} = values;
    let mutation = `mutation { createPersona(input: { nombres:"${nombres}", apellidos: "${apellidos}", birthday: "${birthday}",cargo:"${cargo}", ci:"${ci}", edad:"${edad}", hijos:"${hijos}", raza:"${raza}", salario:"${salario}"}) { persona { _id, id } }}`;

      fetch(GRAPHGL_HOST_HTTP+'/graphql', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
          },
          body: JSON.stringify({"query": mutation })
      })
          .then(response => {
              dispatch(loading(false));

              return response.json();
          })
          .then(retrieved => dispatch(success(retrieved)))
          .catch(e => {
              dispatch(loading(false));

              if (e instanceof SubmissionError) {
                  dispatch(error(e.errors._error));
                  throw e;
              }

              dispatch(error(e.message));
          });

      /*return fetch('personas', { method: 'POST', body: JSON.stringify(values) })
        .then(response => {
          dispatch(loading(false));

          return response.json();
        })
        .then(retrieved => dispatch(success(retrieved)))
        .catch(e => {
          dispatch(loading(false));

          if (e instanceof SubmissionError) {
            dispatch(error(e.errors._error));
            throw e;
          }

          dispatch(error(e.message));
        });*/
  };
}

export function reset() {
  return dispatch => {
    dispatch(loading(false));
    dispatch(error(null));
  };
}
