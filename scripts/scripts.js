/*
function manageResize() {
	console.log('manageResize()');
}
$(window).on('resize', _.debounce(manageResize, 200));
*/
var CP = CP || {};
CP.methods = {
	nav: {},
	init: function(appData) {
		// Whatever stuff needs to happen on init.
		//this.addListeners();
		ReactDOM.render(
			<CP.components.table data={appData.tableData} />, document.getElementById('report-table')
		);
		ReactDOM.render(
			<CP.components.sidebar containerId="accordian-parent" data={appData.sidebarData} />, document.getElementById('sidebar')
		);
		console.log(CP);
	},
	addListeners: function() {
		// Just in case we need some delegated listeners outside of Bootstrap or React.
	}
};

/*
This data would normally come from an AJAX call and there would be deferred objects 
or promises or whatever, but this is just an example so I'm just tossing stuff in there 
with hoisted variables.
*/
var appData = {
	tableData: {
		fields: [
			{id: "id",                label: 'User ID'},
			{id: "username",          label: 'Username'},
			{id: "first_name",        label: 'First Name'},
			{id: "last_name",         label: 'Last Name'},
			{id: "email",             label: 'Email'},
			{id: "city",              label: 'City'},
			{id: "state",             label: 'State'},
			{id: "animal_scientific", label: 'Scientific Name'},
			{id: "animal_common",     label: 'Common Name'},
			{id: "drug_name",         label: 'Drug Name'},
		],
		rows: [
			{
				"id": 1,
				"username": "gwinwright0",
				"first_name": "Guenna",
				"last_name": "Winwright",
				"email": "gwinwright0@flavors.me",
				"city": "Little Rock",
				"state": "AR",
				"animal_scientific": "unavailable",
				"animal_common": "Malay squirrel (unidentified)",
				"drug_name": "Rexall Alcohol Prep"
			},
			{
				"id": 2,
				"username": "astartin1",
				"first_name": "Ave",
				"last_name": "Startin",
				"email": "astartin1@infoseek.co.jp",
				"city": "Pittsburgh",
				"state": "PA",
				"animal_scientific": "Boa caninus",
				"animal_common": "Emerald green tree boa",
				"drug_name": "HEMORRHOIDS RELIEF"
			},
			{
				"id": 3,
				"username": "kpickle2",
				"first_name": "Kathryn",
				"last_name": "Pickle",
				"email": "kpickle2@netlog.com",
				"city": "Irvine",
				"state": "CA",
				"animal_scientific": "Camelus dromedarius",
				"animal_common": "Camel, dromedary",
				"drug_name": "ADVANCED HYDRO-LIQUID COMPACT (REFILL)"
			},
			{
				"id": 4,
				"username": "amathivat3",
				"first_name": "Annaliese",
				"last_name": "Mathivat",
				"email": "amathivat3@rambler.ru",
				"city": "Birmingham",
				"state": "AL",
				"animal_scientific": "Nectarinia chalybea",
				"animal_common": "Lesser double-collared sunbird",
				"drug_name": "Torsemide"
			},
			{
				"id": 5,
				"username": "lweatherup4",
				"first_name": "Lissa",
				"last_name": "Weatherup",
				"email": "lweatherup4@craigslist.org",
				"city": "Indianapolis",
				"state": "IN",
				"animal_scientific": "Lemur catta",
				"animal_common": "Lemur, ring-tailed",
				"drug_name": "Midazolam Hydrochloride"
			},
			{
				"id": 6,
				"username": "tlegassick5",
				"first_name": "Terrill",
				"last_name": "Le Gassick",
				"email": "tlegassick5@weather.com",
				"city": "Pensacola",
				"state": "FL",
				"animal_scientific": "Corvus albicollis",
				"animal_common": "Raven, white-necked",
				"drug_name": "Phenobarbital Sodium"
			}
		]
	},
	/*
	Simulating a weird server data response due to business logic or legacy code.
	*/
	sidebarData: [
			{id:"about", label:"About", parentId:null, href:"#"},
			{id:"stuff", label:"Stuff", parentId:null, href:"#"},
			{id:"things", label:"Things", parentId:null, href:"#"},
			{id:"whatnot", label:"Whatnot", parentId:null, href:"#"},
			{id:"settings", label:"Settings", parentId:null, href:"#"},
			{id:"sub01", label:"My Stuff", parentId:"stuff", href:"#"},
			{id:"sub02", label:"Your Stuff", parentId:"stuff", href:"#"},
			{id:"sub03", label:"His Stuff", parentId:"stuff", href:"#"},
			{id:"sub04", label:"Her Stuff", parentId:"stuff", href:"#"},
			{id:"sub11", label:"What Not", parentId:"whatnot", href:"#"},
			{id:"sub12", label:"What Now?", parentId:"whatnot", href:"#"},
			{id:"sub13", label:"What The...?", parentId:"whatnot", href:"#"},
			{id:"sub13", label:"Account", parentId:"settings", href:"#"},
			{id:"sub13", label:"Account", parentId:"settings", href:"#"},
			{id:"sub13", label:"Account", parentId:"settings", href:"#"},
	]
}
