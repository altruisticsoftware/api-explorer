const React = require('react');

class ApiList extends React.Component {
  constructor(props) {
    super(props);
    const petStore = '/swagger-files/petstore.json';
    this.state = {
      apis: {
        petstore: {
          preferred: '1.0.0',
          versions: {
            '1.0.0': {
              swaggerUrl: petStore,
            },
          },
        },
      },
      selected: petStore,
    };

    this.changeApi = this.changeApi.bind(this);
  }

  componentDidMount() {
    fetch('https://api.apis.guru/v2/list.json')
      .then(res => res.json())
      .then(apis => this.setState({ apis: Object.assign({}, this.state.apis, apis) }));

    this.props.fetchSwagger(this.state.selected);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.selected !== this.state.selected) {
      this.props.fetchSwagger(this.state.selected);
    }
  }

  changeApi(e) {
    this.setState({ selected: e.currentTarget.value });
  }
  render() {
    return (
      <h3>
        Select an API from the OpenAPI Directory:&nbsp;
        <select onChange={this.changeApi} value={this.state.selected}>
          { Object.keys(this.state.apis).map((name) => {
            const api = this.state.apis[name];
            return (
              <option value={api.versions[api.preferred].swaggerUrl} key={name}>
                {name.substring(0, 30)}
              </option>);
          }) }
        </select>
      </h3>
    );
  }
}

module.exports = ApiList;