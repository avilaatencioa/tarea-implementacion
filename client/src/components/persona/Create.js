import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Form from './Form';
import { create, reset } from '../../actions/persona/create';

class Create extends Component {
  static propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    created: PropTypes.object,
    create: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired
  };

  componentWillUnmount() {
    this.props.reset();
  }

  render() {
    if (this.props.created)
      return (
        <Redirect
          to={`edit/%2Fpersonas%2F${encodeURIComponent(this.props.created.data.createPersona.persona['_id'])}`}
        />
      );

    return (
      <div>
        <h1>Nueva persona</h1>

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

        <Form onSubmit={this.props.create} values={this.props.item} />
        <Link to="." className="btn btn-primary pull-left mb-3 ml-2">
           Volver al listado
        </Link>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { created, error, loading } = state.persona.create;
  return { created, error, loading };
};

const mapDispatchToProps = dispatch => ({
  create: values => dispatch(create(values)),
  reset: () => dispatch(reset())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Create);
