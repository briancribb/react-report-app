/*
function manageResize() {
	console.log('manageResize()');
}
$(window).on('resize', _.debounce(manageResize, 200));
*/
var CP = CP || {};
CP.methods = {
	nav: {},
	init: function() {
		// Whatever stuff needs to happen on init.
		//this.addListeners();
		ReactDOM.render(
			<CP.components.table />, document.getElementById('report-table')
		);

		CP.methods.getData('data/navigation.json', (data) =>{
			console.log('data', data);
			ReactDOM.render(
				<CP.components.sidebar containerId="accordian-parent" data={data} />, document.getElementById('sidebar')
			);
		});
		
		console.log(CP);
	},
	getData: function(path, callback) {
		/*
		Just a placeholder so we know this exists. It will be written over with a function 
		from the table component.
		*/
	},
	getData: function(path, callback) {
		let that = this;
		fetch(path)
			.then(response => response.json()) // Returns a promise, so gotta have another then.
			.then( json => {
				callback(json);
			})
			.catch( error => {
				console.log('error', error);
			});
	},
	addListeners: function() {
		// Just in case we need some delegated listeners outside of Bootstrap or React.
	}
};