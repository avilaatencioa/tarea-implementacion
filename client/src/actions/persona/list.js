import {
  normalize,
  extractHubURL,
  mercureSubscribe as subscribe
} from '../../utils/dataAccess';
import { success as deleteSuccess } from './delete';
const {
    REACT_APP_API_ENTRYPOINT: GRAPHGL_HOST_HTTP,
} = process.env;

export function error(error) {
  return { type: 'PERSONA_LIST_ERROR', error };
}

export function loading(loading) {
  return { type: 'PERSONA_LIST_LOADING', loading };
}

export function success(retrieved) {
  return { type: 'PERSONA_LIST_SUCCESS', retrieved };
}

export function list(page = 'personas', filtro='') {
  return dispatch => {
    dispatch(loading(true));
    dispatch(error(''));

      const query = "{ personas { edges { node {_id,id,nombres,apellidos,edad,birthday,ci,hijos,raza,salario,cargo} }} }";
      const queryFiltro = `{ personas(nombres:"${filtro}") { edges { node {_id,id,nombres,apellidos,edad,birthday,ci,hijos,raza,salario,cargo} }} }`;

      fetch(GRAPHGL_HOST_HTTP+'/graphql', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
          },
          body: JSON.stringify({"query": (filtro === "" ? query : queryFiltro) })
      })
          .then(response =>
              response
                  .json()
                  .then(retrieved => ({ retrieved, hubURL: extractHubURL(response) }))
          )
          .then(({ retrieved, hubURL }) => {
              retrieved = normalize(retrieved.data.personas);

              dispatch(loading(false));
              dispatch(success(retrieved));
          })
          .catch(e => {
              dispatch(loading(false));
              dispatch(error(e.message));
          });
  };
}

export function reset(eventSource) {
  return dispatch => {
    if (eventSource) eventSource.close();

    dispatch({ type: 'PERSONA_LIST_RESET' });
    dispatch(deleteSuccess(null));
  };
}

export function mercureSubscribe(hubURL, topics) {
  return dispatch => {
    const eventSource = subscribe(hubURL, topics);
    dispatch(mercureOpen(eventSource));
    eventSource.addEventListener('message', event =>
      dispatch(mercureMessage(normalize(JSON.parse(event.data))))
    );
  };
}

export function mercureOpen(eventSource) {
  return { type: 'PERSONA_LIST_MERCURE_OPEN', eventSource };
}

export function mercureMessage(retrieved) {
  return dispatch => {
    if (1 === Object.keys(retrieved).length) {
      dispatch({ type: 'PERSONA_LIST_MERCURE_DELETED', retrieved });
      return;
    }

    dispatch({ type: 'PERSONA_LIST_MERCURE_MESSAGE', retrieved });
  };
}
