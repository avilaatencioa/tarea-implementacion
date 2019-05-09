import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Form from './Form';
import { retrieve, update, reset } from '../../actions/persona/update';
import { del } from '../../actions/persona/delete';

class Update extends Component {
  static propTypes = {
    retrieved: PropTypes.object,
    retrieveLoading: PropTypes.bool.isRequired,
    retrieveError: PropTypes.string,
    updateLoading: PropTypes.bool.isRequired,
    updateError: PropTypes.string,
    deleteLoading: PropTypes.bool.isRequired,
    deleteError: PropTypes.string,
    updated: PropTypes.object,
    deleted: PropTypes.object,
    eventSource: PropTypes.instanceOf(EventSource),
    retrieve: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.retrieve(decodeURIComponent(this.props.match.params.id));
  }

  componentWillUnmount() {
    this.props.reset(this.props.eventSource);
  }

  del = () => {
    if (window.confirm('Seguro que desea eliminar el elemento?'))
      this.props.del(this.props.retrieved);
  };

  render() {
    if (this.props.deleted) return <Redirect to=".." />;

    const item = this.props.updated ? this.props.updated : this.props.retrieved;
    console.log('aaaaa', item);
    return (
      <div>
        <h1>Editar {item && item._id}</h1>

        {this.props.created && (
          <div className="alert alert-success" role="status">
            {this.props.created['_id']} creado.
          </div>
        )}
        {this.props.updated && (
          <div className="alert alert-success" role="status">
            {this.props.updated['_id']} actualizado.
          </div>
        )}
        {(this.props.retrieveLoading ||
          this.props.updateLoading ||
          this.props.deleteLoading) && (
          <div className="alert alert-info" role="status">
            Cargando...
          </div>
        )}
        {this.props.retrieveError && (
          <div className="alert alert-danger" role="alert">
            <span className="fa fa-exclamation-triangle" aria-hidden="true" />{' '}
            {this.props.retrieveError}
          </div>
        )}
        {this.props.updateError && (
          <div className="alert alert-danger" role="alert">
            <span className="fa fa-exclamation-triangle" aria-hidden="true" />{' '}
            {this.props.updateError}
          </div>
        )}
        {this.props.deleteError && (
          <div className="alert alert-danger" role="alert">
            <span className="fa fa-exclamation-triangle" aria-hidden="true" />{' '}
            {this.props.deleteError}
          </div>
        )}

        {item && (
          <Form
            onSubmit={values => this.props.update(item, values)}
            initialValues={item}
          />
        )}
        <Link to=".." className="btn btn-primary">
          Volver al listado
        </Link>
        <button onClick={this.del} className="btn btn-danger ml-1">
          Eliminar
        </button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  retrieved: state.persona.update.retrieved,
  retrieveError: state.persona.update.retrieveError,
  retrieveLoading: state.persona.update.retrieveLoading,
  updateError: state.persona.update.updateError,
  updateLoading: state.persona.update.updateLoading,
  deleteError: state.persona.del.error,
  deleteLoading: state.persona.del.loading,
  eventSource: state.persona.update.eventSource,
  created: state.persona.create.created,
  deleted: state.persona.del.deleted,
  updated: state.persona.update.updated
});

const mapDispatchToProps = dispatch => ({
  retrieve: id => dispatch(retrieve(id)),
  update: (item, values) => dispatch(update(item, values)),
  del: item => dispatch(del(item)),
  reset: eventSource => dispatch(reset(eventSource))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Update);
