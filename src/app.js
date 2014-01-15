/**
 * @jsx React.DOM
 */
 var ResultModel = Backbone.Model.extend({
	initialize: function (attributes, options) {
		this.type = options.type || 'team';
		this.event = options.event || '94';
	},

	url: function() {
		return 'api/results/event/' + this.event + '/type/' + this.type + '/' + this.id + '.json';
	}
});

var ResultCollection = Backbone.Collection.extend({
	model: ResultModel,
	comparator: 'rank',

	initialize: function (models, options) {
		this.type = options.type || 'team';
		this.event = options.event || '94';
	},

	url: function() {
		return 'api/results/event/' + this.event + '/type/' + this.type + '.json';
	}
}); 


var Result = React.createClass({
  render: function() {
    console.log('Rendering result component.')
    return (
      <tr>
        <td>{this.props.data.attributes.rank}</td>
        <td>{this.props.data.attributes.bib}</td>
        <td>{this.props.data.attributes.firstName + ' ' + this.props.data.attributes.lastName}</td>
        <td>{this.props.data.attributes.time}</td>
      </tr>
    );
  }
});

var ResultList = React.createClass({
  render: function() {
    console.log('Rendering ResultsList component.', this.props.data);
    var resultNodes = this.props.data.slice(0, 20).map(function(result) {
      return <Result key={result.cid} data={result} />;
    });
    console.log('Result Nodes.', resultNodes);
    return (
      <tbody>
        {resultNodes}
      </tbody>
    );
  }
});

var Search = React.createClass({
  render: function() {
    return (
      <input onChange={this.props.handleChange}/>
    );
  }
});

var TeamResults = React.createClass({
  componentWillMount: function () {
		// provide the context so that we can remove all event callbacks if/when the
		// component is removed
		this.props.results.on('add change remove, reset', this.forceUpdate.bind(this, null), this);
		this.props.results.fetch({add: false, reset: true});
  },

 	componentWillUnmount: function () {
 		// provide context so that only this component's callbacks are removed
 		this.props.results.off(null, null, this);
 	},

  handleChange:function(event) {
    var value = event.target.value;
    console.log('Value: ' + value);

    value = value.toLowerCase();
    var filteredCollection = this.props.result.filter(function(result) {
      return (result.attributes.name.toLowerCase().indexOf(value) !== -1);
    });

    // this.setState({
    //   data: filteredCollection
    // });
  },

  render: function() {
    return (
      <div>
        <Search handleChange={this.handleChange}/>
        <table className="results">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Bib #</th>
              <th>Name</th>
              <th>Time</th>
            </tr>
          </thead>
          <ResultList data={this.props.results} />
        </table>
      
      </div>
    );
  }
});


React.renderComponent(
  <TeamResults results={new ResultCollection([], {
  	type: 'individual',
  	event: '94'
  })}/>,
  document.getElementById('container')
);