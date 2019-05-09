import { SubmissionError } from 'redux-form';
import {
  extractHubURL,
  normalize,
  mercureSubscribe as subscribe
} from '../../utils/dataAccess';
import { success as createSuccess } from './create';
import { loading, error } from './delete';
const {
    REACT_APP_API_ENTRYPOINT: GRAPHGL_HOST_HTTP,
} = process.env;

export function retrieveError(retrieveError) {
  return { type: 'PERSONA_UPDATE_RETRIEVE_ERROR', retrieveError };
}

export function retrieveLoading(retrieveLoading) {
  return { type: 'PERSONA_UPDATE_RETRIEVE_LOADING', retrieveLoading };
}

export function retrieveSuccess(retrieved) {
  return { type: 'PERSONA_UPDATE_RETRIEVE_SUCCESS', retrieved };
}

export function retrieve(id) {
  return dispatch => {
    dispatch(retrieveLoading(true));

    let query = `{ persona(id:"${id}") {_id,id,nombres,apellidos,edad,birthday,ci,hijos,raza,salario,cargo} }`;
    return fetch(GRAPHGL_HOST_HTTP+'/graphql', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
          },
          body: JSON.stringify({"query": query })
      }).then(response =>
        response
            .json()
            .then(retrieved => ({ retrieved, hubURL: extractHubURL(response) }))
    )
        .then(({ retrieved, hubURL }) => {
            retrieved = normalize(retrieved.data.persona);

            dispatch(retrieveLoading(false));
            dispatch(retrieveSuccess(retrieved));

            if (hubURL) dispatch(mercureSubscribe(hubURL, retrieved['id']));
        })
        .catch(e => {
            dispatch(retrieveLoading(false));
            dispatch(retrieveError(e.message));
        });

    /*return fetch(id)
      .then(response =>
        response
          .json()
          .then(retrieved => ({ retrieved, hubURL: extractHubURL(response) }))
      )
      .then(({ retrieved, hubURL }) => {
        retrieved = normalize(retrieved);

        dispatch(retrieveLoading(false));
        dispatch(retrieveSuccess(retrieved));

        if (hubURL) dispatch(mercureSubscribe(hubURL, retrieved['@id']));
      })
      .catch(e => {
        dispatch(retrieveLoading(false));
        dispatch(retrieveError(e.message));
      });*/
  };
}

export function updateError(updateError) {
  return { type: 'PERSONA_UPDATE_UPDATE_ERROR', updateError };
}

export function updateLoading(updateLoading) {
  return { type: 'PERSONA_UPDATE_UPDATE_LOADING', updateLoading };
}

export function updateSuccess(updated) {
  return { type: 'PERSONA_UPDATE_UPDATE_SUCCESS', updated };
}

export function update(item, values) {
  return dispatch => {
    dispatch(updateError(null));
    dispatch(createSuccess(null));
    dispatch(updateLoading(true));

    let {id, nombres, apellidos, birthday, cargo, ci, edad, hijos, raza, salario} = values;
    let mutation = `mutation { updatePersona(input: { id:"${id}", nombres:"${nombres}", apellidos: "${apellidos}", birthday: "${birthday}",cargo:"${cargo}", ci:"${ci}", edad:"${edad}", hijos:"${hijos}", raza:"${raza}", salario:"${salario}"}) { persona { _id, id, nombres, apellidos, birthday, cargo, ci, edad, hijos, raza, salario } }}`;

    fetch(GRAPHGL_HOST_HTTP+'/graphql', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
          },
          body: JSON.stringify({"query": mutation })
      }).then(response =>
        response
            .json()
            .then(retrieved => ({ retrieved, hubURL: extractHubURL(response) }))
    )
        .then(({ retrieved, hubURL }) => {
            retrieved = normalize(retrieved.data.updatePersona.persona);

            dispatch(updateLoading(false));
            dispatch(updateSuccess(retrieved));

            if (hubURL) dispatch(mercureSubscribe(hubURL, retrieved['id']));
        })
        .catch(e => {
            dispatch(updateLoading(false));

            if (e instanceof SubmissionError) {
                dispatch(updateError(e.errors._error));
                throw e;
            }

            dispatch(updateError(e.message));
        });
    /*return fetch(item['@id'], {
      method: 'PUT',
      headers: new Headers({ 'Content-Type': 'application/ld+json' }),
      body: JSON.stringify(values)
    })
      .then(response =>
        response
          .json()
          .then(retrieved => ({ retrieved, hubURL: extractHubURL(response) }))
      )
      .then(({ retrieved, hubURL }) => {
        retrieved = normalize(retrieved);

        dispatch(updateLoading(false));
        dispatch(updateSuccess(retrieved));

        if (hubURL) dispatch(mercureSubscribe(hubURL, retrieved['@id']));
      })
      .catch(e => {
        dispatch(updateLoading(false));

        if (e instanceof SubmissionError) {
          dispatch(updateError(e.errors._error));
          throw e;
        }

        dispatch(updateError(e.message));
      });*/
  };
}

export function reset(eventSource) {
  return dispatch => {
    if (eventSource) eventSource.close();

    dispatch({ type: 'PERSONA_UPDATE_RESET' });
    dispatch(error(null));
    dispatch(loading(false));
    dispatch(createSuccess(null));
  };
}

export function mercureSubscribe(hubURL, topic) {
  return dispatch => {
    const eventSource = subscribe(hubURL, [topic]);
    dispatch(mercureOpen(eventSource));
    eventSource.addEventListener('message', event =>
      dispatch(mercureMessage(normalize(JSON.parse(event.data))))
    );
  };
}

export function mercureOpen(eventSource) {
  return { type: 'PERSONA_UPDATE_MERCURE_OPEN', eventSource };
}

export function mercureMessage(retrieved) {
  return dispatch => {
    if (1 === Object.keys(retrieved).length) {
      dispatch({ type: 'PERSONA_UPDATE_MERCURE_DELETED', retrieved });
      return;
    }

    dispatch({ type: 'PERSONA_UPDATE_MERCURE_MESSAGE', retrieved });
  };
}
