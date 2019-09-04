/*
function manageResize() {
	console.log('manageResize()');
}
$(window).on('resize', _.debounce(manageResize, 200));
*/
var CP = CP || {};
CP.language = 'en';
CP.localization = null;
CP.navigation = null;
CP.methods = {
	init: function() {
		// Whatever stuff needs to happen on init.
		//this.addListeners();
		ReactDOM.render(
			<CP.components.table />, document.getElementById('report-table')
		);

		let initSources = {
			localization:{path:'localization/'+CP.language+'/language.json', requestData:{}, callback: function(data){
				console.log('-- localization', data);
				//CP.localization = data;
			}},
			navigation:{path:'data/navigation.json', requestData:{}, callback: function(data){
				console.log('-- navigation', data);
				//CP.navigation = data;
			}}
		}

		CP.methods.getMultipleSources(initSources, (data)=>{
			console.log('getMultipleSources', data);
			CP.localization = data.localization;
			CP.navigation = data.navigation;
			ReactDOM.render(
				<CP.components.sidebar containerId="accordian-parent" data={CP.navigation} />, document.getElementById('sidebar')
			);
		});
		
		//console.log(CP);
	},
	getReport: function(path, callback) {
		/*
		Just a placeholder so we know this exists. It will be written over with a function from the table 
		component. This is done so we can refresh the component from the outside.
		*/
	},
	getMultipleSources: function(dfd_sources = null, finalCallback) {
		if (!dfd_sources) return;
		console.log('getMultipleSources()');
		/*
		dfd_sources
		=============
		Object Key:     The name of this property will end up as the name of the result in the final object.
		Properties:
		1. path:        The path for the AJAX call.
		2. requestData: An object for query string parameters, to be submitted with jQuery's ajax method.
		3. callback:    A callback function just for that source.
		dfd_sources = {
			myFirstSource:  { path:'https://httpbin.org/get', requestData{stuff:"things"}, callback: function(){} },
			mySecondSource: { path:'https://httpbin.org/get', requestData{more:"stuff"}, callback: function(){} }	
		}

		finalCallback
		=============
		This runs after all of the sources have arrived. All of the data from all of the sources will be 
		accessible from there, because their results will be added to a top-level object.
		*/

		var that		= this,
			dfd_array	= [],
			objData		= {
				count		: 0
			}; // We're eventually going to dump all of our data into this object.


		// Each source is an object, so we can add more properties to it, like its own Deferred.
		$.each( dfd_sources, function( key, value ) {
			/*
			The key and value are just from the items in the sources object above. The key is the name of the source, 
			and the value is the object with the path, callback, etc.

			key:	'myFirstSource'
			value:	{ path:'path/to/data/stuff.json' ... }
			*/
			value.dfd = $.Deferred();  // Adding a Deferred to the source object.
			dfd_array.push(value.dfd); // Adding the whole object to the array that we're going to use with AJAX.

			/*
			This done() function will fire whenever this deferred object is resolved. It's made in the scope of this 
			function, so we don't need to specifically name it. We have access to the value object, though, so code 
			could be written to target something by name.
			*/
			value.dfd.done(function(singleData) {
				// Do stuff when this particular deferred resolves. Like increment the count.
				objData.count ++;

				// Add this one's data to the main object with the key as the property name so we can see it later.
				objData[key] = singleData;

				/*

				Logging an array so we can see the string and pass in the single data.

				(•_•)
				<)   )╯  All the single data!
			    /    \ 

				*/

				// Call the individual callback for this source, if one was included.
				if (value.callback) value.callback(singleData);
			});


			$.ajax({
				url: value.path,
				dataType: "json"
			}).done(function(data) {

				//All done with this JSON file, so we'll resolve its Deferred object. and pass in its data.
				value.dfd.resolve(data);
			});
		});

		/*
		When all of the Deferred objects are resolved, do some stuff.
		http://stackoverflow.com/questions/5627284/pass-in-an-array-of-deferreds-to-when
		*/
		$.when.apply(null, dfd_array).done(function() {
			// Call the final callback function with the full set of results from all calls.
			finalCallback(objData);
		});
	},
	getSingleData: function(path, callback) {
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