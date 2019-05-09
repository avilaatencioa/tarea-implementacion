import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { retrieve, reset } from '../../actions/persona/show';
import { del } from '../../actions/persona/delete';

class Show extends Component {
  static propTypes = {
    retrieved: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    eventSource: PropTypes.instanceOf(EventSource),
    retrieve: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    deleteError: PropTypes.string,
    deleteLoading: PropTypes.bool.isRequired,
    deleted: PropTypes.object,
    del: PropTypes.func.isRequired
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

    const item = this.props.retrieved;
    return (
      <div>
        <h1>Mostrar {item && item._id}</h1>

        {this.props.loading && (
          <div className="alert alert-info" role="status">
            Cargando...
          </div>
        )}
        {this.props.error && (
          <div className="alert alert-danger" role="alert">
            <span className="fa fa-exclamation-triangle" aria-hidden="true" />{' '}
            {this.props.error}
          </div>
        )}
        {this.props.deleteError && (
          <div className="alert alert-danger" role="alert">
            <span className="fa fa-exclamation-triangle" aria-hidden="true" />{' '}
            {this.props.deleteError}
          </div>
        )}

        {item && (
          <table className="table table-responsive table-striped table-hover">
            <thead>
              <tr>
                <th>Field</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Nombres</th>
                <td>{item.nombres}</td>
              </tr>
              <tr>
                <th scope="row">Apellidos</th>
                <td>{item.apellidos}</td>
              </tr>
              <tr>
                <th scope="row">Edad</th>
                <td>{item.edad}</td>
              </tr>
              <tr>
                <th scope="row">Fecha de nacimiento</th>
                <td>{item.birthday}</td>
              </tr>
              <tr>
                <th scope="row">no. identificación</th>
                <td>{item.ci}</td>
              </tr>
              <tr>
                  <th scope="row">Cantidad de hijos</th>
                  <td>{item.hijos}</td>
              </tr>
              <tr>
                  <th scope="row">Raza</th>
                  <td>{item.raza}</td>
              </tr>
              <tr>
                  <th scope="row">Salario</th>
                  <td>{item.salario}</td>
              </tr>
              <tr>
                  <th scope="row">Cargo</th>
                  <td>{item.cargo}</td>
              </tr>

            </tbody>
          </table>
        )}
        <Link to=".." className="btn btn-primary">
          Volver al listado
        </Link>
        {item && (
          <Link to={`/personas/edit/${encodeURIComponent(item.id)}`}>
            <button className="btn btn-warning ml-1">Editar</button>
          </Link>
        )}
        <button onClick={this.del} className="btn btn-danger ml-1">
          Eliminar
        </button>
      </div>
    );
  }

  renderLinks = (type, items) => {
    if (Array.isArray(items)) {
      return items.map((item, i) => (
        <div key={i}>{this.renderLinks(type, item)}</div>
      ));
    }

    return (
      <Link to={`../../${type}/show/${encodeURIComponent(items)}`}>{items}</Link>
    );
  };
}

const mapStateToProps = state => ({
  retrieved: state.persona.show.retrieved,
  error: state.persona.show.error,
  loading: state.persona.show.loading,
  eventSource: state.persona.show.eventSource,
  deleteError: state.persona.del.error,
  deleteLoading: state.persona.del.loading,
  deleted: state.persona.del.deleted
});

const mapDispatchToProps = dispatch => ({
  retrieve: id => dispatch(retrieve(id)),
  del: item => dispatch(del(item)),
  reset: eventSource => dispatch(reset(eventSource))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Show);
