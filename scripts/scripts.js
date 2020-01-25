/*
function manageResize() {
	console.log('manageResize()');
}
$(window).on('resize', _.debounce(manageResize, 200));
*/

let CP = CP || (function(){

	let languageId = 'en',
		localization = null,
		navigation = null,
		instances = [];

	let APP = {
		init: function() {
			// Whatever stuff needs to happen on init.
			this.addListeners();
			let that = this;

			let initSources = {
				localization:{path:'localization/'+languageId+'/language.json', requestData:{}, callback: function(data){
					//console.log('-- localization', data);
					//CP.localization = data;
				}},
				navigation:{path:'data/navigation.json', requestData:{}, callback: function(data){
					//console.log('-- navigation', data);
					//CP.navigation = data;
				}}
			}

			that.getMultipleSources(initSources, (data)=>{
				localization = data.localization;
				navigation = data.navigation;
				ReactDOM.render(
					<CP.components.sidebar canForceUpdate={true} containerId="accordian-parent" data={navigation} />, document.getElementById('sidebar')
				);

				ReactDOM.render(
					<CP.components.report canForceUpdate={true} />, document.getElementById('report-container')
				);
			});
			
			//console.log(CP);
		},
		addToInstances: function(instance) {
			instances.push(instance);
		},
		setLocalization: function(langId = 'en', obj = null) {
			languageId = langId;
			localization = obj;
		},
		getLocalization: function() {
			return localization || null;
		},
		getLanguageElement: function(id) {
			return localization[id] || '';
		},
		updateLocalization: function(langId = 'en') {
			let that = this;
			that.getMultipleSources({
				objNewLanguage: {
					path:'localization/'+langId+'/language.json',
					requestData:{},
					callback: function(data){
						//console.log('-- localization', data);
						//that.languageId = langId;
						//that.localization = data;
						//console.log('-- CP', CP);
						//that.methods.renderAllComponents();
					}
				}
			},(data)=>{
				console.log('getMultipleSources Total:', data, that);
				//that.setLocalization(langId, data.objNewLanguage);
				languageId = langId;
				localization = Object.assign({},data.objNewLanguage);
				that.renderAllComponents();
			});

			//return this.localization;
		},
		getReport: function(path, callback) {
			/*
			Just a placeholder so we know this exists. It will be written over with a function from the table 
			component. This is done so we can refresh the component from the outside.
			*/
		},
		getData: function(path = '', params = null) {
			let finalPath = params ? path += this.getQueryString(params) : path;

			/*
			The function argument in this promise has "async", which allows us to use 
			"await" within the function.
			*/
			return new Promise( async (resolve, reject) => {
			/*
			We could just return the fetch call because fetch returns a promise, but 
			I want to use a promise chain.

			Because we're using the magic word "await", we an write this as if it's a 
			regular bit of JavaScript. Fetch returns a promise anyway, but saying await 
			allows us to reference the result on the very next line.
			*/
			let response = await fetch(finalPath);
			  
			/*
			Because we used await, we can just do this next line without any fuss. 
			Anything other than a successful, okay call will just reject with null.
			*/
				//console.log('response', response);
			if (response.ok) {
				resolve(response.json());
			} else {
				reject( console.error('Poop happened.', response) );
			}
			});
		},
		getMultipleSources: function(arrSources = []) {
			/*
			myExampleSources = [
				'my/path', 
				{path:'my/second/path', params:{one:"stuff",two:"things"}, 
				'my/third/path'}
			];
			*/
			let that = this;
			if (!Array.isArray(arrSources)) arrSources = [arrSources];
			let arrPromises = arrSources.map((source)=>{
				return typeof source === 'string' ? that.getData(source) : that.getData(source.path, source.params);
			});

			return Promise.all(arrPromises);
		},
		addListeners: function() {
			let that = this;
			// Just in case we need some delegated listeners outside of Bootstrap or React.
			$('body').on('change', function(evt){
				if (evt.target.id === 'language-dropdown') {
					//console.log(evt.target.value, CP);
					CP.updateLocalization(evt.target.value);
				}
			});
		},
		renderAllComponents: function() {
			/*
			There are times when we want to update all component instances from the outside. For example, when we change the 
			localization settings then we need to run the render function of applicable components. If a component may need 
			to be updated in this way, it will be instantiated with a prop called canForceUpdate with a value of true.
			*/
			instances.forEach((instance)=>{
				instance.forceUpdate();
			});
		}
	};

	return APP;
}());
