import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { list, reset } from '../../actions/persona/list';

class List extends Component {
  static propTypes = {
    retrieved: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.string,
    eventSource: PropTypes.instanceOf(EventSource),
    deletedItem: PropTypes.object,
    list: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired
  };

  constructor() {
        super();
        this.onChangeInput = this.onChangeInput.bind(this);
        this.filtrar = this.filtrar.bind(this);
        this.clearFiltro = this.clearFiltro.bind(this);
        this.state = {
            filtroPersonas: "",
        }
  };
  componentDidMount() {
    this.props.list(
      this.props.match.params.page &&
        decodeURIComponent(this.props.match.params.page)
    );
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.page !== nextProps.match.params.page)
      nextProps.list(
        nextProps.match.params.page &&
          decodeURIComponent(nextProps.match.params.page)
      );
  };
  componentWillUnmount() {
    this.props.reset(this.props.eventSource);
  };
  filtrar = () => {
      this.props.list('personas', this.state.filtroPersonas);
  };
  clearFiltro = () => {
      this.setState({
          filtroPersonas: "",
      }, function () {
          this.props.list();
          document.querySelector("#input-filtroPersonas").value = "";
      });
  };
  onChangeInput = event => {
        const {name, value} = event.target;
        this.setState({
            [name]: value
        });
  };
  formatoFecha = (fecha) => {
     const aux = fecha.split("T");
     if(aux.length > 1)
         return aux[0];
     else
        return fecha;
  };

  render() {
    return (
      <div>
        <h1>Listado de Personas</h1>

        {this.props.loading && (
          <div className="alert alert-info">Cargando...</div>
        )}
        {this.props.deletedItem && (
          <div className="alert alert-success">
            {this.props.deletedItem['@id']} deleted.
          </div>
        )}
        {this.props.error && (
          <div className="alert alert-danger">{this.props.error}</div>
        )}

        <p>
          <Link to="create" className="btn btn-primary ml-1 pull-left">
            Adicionar
          </Link>
        </p>

        <form className="form-inline pull-right mt-n3">
              <div className="form-group mb-5 mr-2">
                  <input type="text" name="filtroPersonas" className="form-control" ref={this.state.filtroPersonas} onChange={this.onChangeInput} id="input-filtroPersonas" placeholder="Nombre persona"/>
              </div>
              <button type="button" onClick={() => this.filtrar()} className="btn btn-primary mb-5">Filtrar</button>
             <button className={"btn btn-lg mb-5 "+ (this.state.filtroPersonas === "" ? "invisible": "visible")}>
                <i className="fa fa-times"></i>
             </button>
        </form>

        <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>id</th>
              <th>Nombres</th>
              <th>Apellidos</th>
              <th>Edad</th>
              <th>Fecha de nacimiento</th>
              <th>No. identificación</th>
              <th>Hijos</th>
              <th>Raza</th>
              <th>Salario</th>
              <th>Cargo</th>
              <th colSpan={2} />
            </tr>
          </thead>
          <tbody>
            {this.props.retrieved &&
              this.props.retrieved.edges.map(item => (
                <tr key={item.node._id}>
                  <th scope="row">
                      {item.node._id}
                  </th>
                  <td>{item.node.nombres}</td>
                  <td>{item.node.apellidos}</td>
                  <td>{item.node.edad}</td>
                  <td>{this.formatoFecha(item.node.birthday)}</td>
                  <td>{item.node.ci}</td>
                  <td>{item.node.hijos}</td>
                  <td>{item.node.raza}</td>
                  <td>{item.node.salario}</td>
                  <td>{item.node.cargo}</td>
                  <td>
                    <Link to={`show/${encodeURIComponent(item.node.id)}`}>
                      <span className="fa fa-search text-success" aria-hidden="true" />
                      <span className="sr-only">Show</span>
                    </Link>
                  </td>
                  <td>
                    <Link to={`edit/${encodeURIComponent(item.node.id)}`}>
                      <span className="fa fa-pencil text-warning" aria-hidden="true" />
                      <span className="sr-only">Edit</span>
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        </div>
        {this.pagination()}
      </div>
    );
  }

  pagination() {
    const view = this.props.retrieved && this.props.retrieved['hydra:view'];
    if (!view) return;

    const {
      'hydra:first': first,
      'hydra:previous': previous,
      'hydra:next': next,
      'hydra:last': last
    } = view;

    return (
      <nav aria-label="Page navigation">
        <Link
          to="."
          className={`btn btn-primary${previous ? '' : ' disabled'}`}
        >
          <span aria-hidden="true">&lArr;</span> First
        </Link>
        <Link
          to={
            !previous || previous === first ? '.' : encodeURIComponent(previous)
          }
          className={`btn btn-primary${previous ? '' : ' disabled'}`}
        >
          <span aria-hidden="true">&larr;</span> Previous
        </Link>
        <Link
          to={next ? encodeURIComponent(next) : '#'}
          className={`btn btn-primary${next ? '' : ' disabled'}`}
        >
          Next <span aria-hidden="true">&rarr;</span>
        </Link>
        <Link
          to={last ? encodeURIComponent(last) : '#'}
          className={`btn btn-primary${next ? '' : ' disabled'}`}
        >
          Last <span aria-hidden="true">&rArr;</span>
        </Link>
      </nav>
    );
  }

  renderLinks = (type, items) => {
    if (Array.isArray(items)) {
      return items.map((item, i) => (
        <div key={i}>{this.renderLinks(type, item)}</div>
      ));
    }

    return (
      <Link to={`../${type}/show/${encodeURIComponent(items)}`}>{items}</Link>
    );
  };
}

const mapStateToProps = state => {
  const {
    retrieved,
    loading,
    error,
    eventSource,
    deletedItem
  } = state.persona.list;
  return { retrieved, loading, error, eventSource, deletedItem };
};

const mapDispatchToProps = dispatch => ({
  list: (page,filtroPersonas) => dispatch(list(page,filtroPersonas)),
  reset: eventSource => dispatch(reset(eventSource))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(List);
