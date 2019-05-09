import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';

class Form extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    error: PropTypes.string
  };

  renderField = data => {
    data.input.className = 'form-control';

    const isInvalid = data.meta.touched && !!data.meta.error;
    if (isInvalid) {
      data.input.className += ' is-invalid';
      data.input['aria-invalid'] = true;
    }

    if (this.props.error && data.meta.touched && !data.meta.error) {
      data.input.className += ' is-valid';
    }

    return (
      <div className={`form-group`}>
        <label
          htmlFor={`persona_${data.input.name}`}
          className="form-control-label"
        >
          {data.input.name}
        </label>
        <input
          {...data.input}
          type={data.type}
          step={data.step}
          required={data.required}
          placeholder={data.placeholder}
          id={`persona_${data.input.name}`}
        />
        {isInvalid && <div className="invalid-feedback">{data.meta.error}</div>}
      </div>
    );
  };

  render() {
    return (
      <form onSubmit={this.props.handleSubmit} style={{paddingLeft: '10px', paddingRight: '10px'}}>
        <Field
          component={this.renderField}
          name="nombres"
          type="text"
          placeholder="nombres"
        />
        <Field
          component={this.renderField}
          name="apellidos"
          type="text"
          placeholder="apellidos"
          required={true}
        />
        <Field
          component={this.renderField}
          name="edad"
          type="text"
          placeholder="edad"
          required={true}
        />
        <Field
          component={this.renderField}
          name="birthday"
          type="dateTime"
          placeholder="fecha de nacimiento"
          required={true}
        />
        <Field
          component={this.renderField}
          name="ci"
          type="string"
          placeholder="no. identificación"
          required={true}
        />
        <Field
          component={this.renderField}
          name="hijos"
          type="text"
          placeholder="cantidad de hijos"
        />
        <Field
          component={this.renderField}
          name="raza"
          type="text"
          placeholder="raza"
        />
        <Field
          component={this.renderField}
          name="salario"
          type="text"
          placeholder="salario"
        />
         <Field
          component={this.renderField}
          name="cargo"
          type="text"
          placeholder="cargo"
        />

        <button type="submit" className="btn btn-success pull-right mb-3">
          Enviar
        </button>
      </form>
    );
  }
}

export default reduxForm({
  form: 'persona',
  enableReinitialize: true,
  keepDirtyOnReinitialize: true
})(Form);
