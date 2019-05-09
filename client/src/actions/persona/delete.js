const {
    REACT_APP_API_ENTRYPOINT: GRAPHGL_HOST_HTTP,
} = process.env;

export function error(error) {
  return { type: 'PERSONA_DELETE_ERROR', error };
}

export function loading(loading) {
  return { type: 'PERSONA_DELETE_LOADING', loading };
}

export function success(deleted) {
  return { type: 'PERSONA_DELETE_SUCCESS', deleted };
}

export function del(item) {
  return dispatch => {
    dispatch(loading(true));
      const id = item['id'];
      let mutation = `mutation { deletePersona(input: {id:"${id}"}) { persona { _id } }}`;

      return fetch(GRAPHGL_HOST_HTTP+'/graphql', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
          },
          body: JSON.stringify({"query": mutation })
      }).then(() => {
          dispatch(loading(false));
          dispatch(success(item));
      })
          .catch(e => {
              dispatch(loading(false));
              dispatch(error(e.message));
          });

      /*return fetch(item['@id'], { method: 'DELETE' })
      .then(() => {
        dispatch(loading(false));
        dispatch(success(item));
      })
      .catch(e => {
        dispatch(loading(false));
        dispatch(error(e.message));
      });*/
  };
}
