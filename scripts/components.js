var CP = CP || {};
CP.components = {};
CP.components.table = class extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			report:null
		};
	}

	componentDidMount() {
		let that = this;
		if (that.props.canForceUpdate) CP.instances.push(this);
		this.getReport();
	}

	_getColumns(report) {
		let that = this;
		return report.fields.slice(1).map((field) =>{
			return(
				<th key={field.id}>
				{CP.methods.getLanguageElement(field.id)}
				</th>
			);
		});
	}

	_getRows(report){
		let that = this;
		return report.rows.map((row) =>{
			return(
				<tr key={row.id}>
					{that.state.report.fields.slice(1).map((field)=>{
						return(<td key={field.id}>{row[field.id]}</td>);
					})}
				</tr>
			);
		});
	}

	render() {
		console.log('--- table', this);
		let that = this,
			markup = null;

		if (this.state.initialized) {
			let columns = that._getColumns(that.props.report);
			let rows = that._getRows(that.props.report);
			markup = 
				<table className="table table-responsive">
					<thead>
						<tr>
							{columns}
						</tr>
					</thead>
					<tbody>
						{rows}
					</tbody>
				</table>
		} else {
			markup = 
				<div>
					<i className="fas fa-spinner fa-spin"></i> Loading...
				</div>
		}
		return(markup);
	}
}

CP.components.report = class extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			titleId:null,
			reportName:'',
			report:null
		};
	}

	componentDidMount() {
		let that = this;
		CP.methods.getReport = that.getReport.bind(this);
		if (that.props.canForceUpdate) CP.instances.push(this);
		this.getReport();
	}

	getReport(reportName = 'report-general') {
		let that = this;
		that.setState({
			initialized:false,
			reportName: reportName
		});


		let objSource = {
			[this.state.reportName]:{path:'data/'+reportName+'.json', requestData:{}, callback: function(data){
				//console.log('-- '+reportName, data);
				that.setState({
					titleId: data.titleId,
					report:data.report,
					initialized:true
				});
			}}
		}

		CP.methods.getMultipleSources(objSource, (data)=>{});
	}

	render() {
		console.log('--- report', this.state, CP.methods.getLocalization());
		let that = this,
			markup = null;

		if (this.state.initialized && this.state.titleId) {
			markup = 
				<div>
					<h1><i class="fas fa-bolt mr-2"></i>{CP.methods.getLanguageElement(this.state.titleId)}</h1>
				</div>

		} else {
			markup = 
				<div>
					<i className="fas fa-spinner fa-spin"></i> Loading...
				</div>
		}
		return(markup);
	}
}

CP.components.sidebar = class extends React.Component {
	constructor(props) {
		super(props);
		this.state = {navItems:this._transformData(props.data)};
	}

	componentDidMount() {
		let that = this;
		//console.log('sidebar state', this.state);
		//if (that.props.instanceName) CP.instances[that.props.instanceName] = this;
		if (that.props.canForceUpdate) CP.instances.push(this);
	}

	_transformData(data) {
		let arrParentKeys = [],
				arrChildLinks = [],
				objParents = {};

		data.forEach(function(item){
			if (!item.parentId) {
				arrParentKeys.push(item.id);
				objParents[item.id] = item;
			} else {
				arrChildLinks.push(item);
			}
		});
		arrChildLinks.forEach(function(item){
			let parent = objParents[item.parentId];
			parent.arrChildMenu = parent.arrChildMenu || [];
			parent.arrChildMenu.push(item);
		});
		let arrNavItems = [];
		arrParentKeys.forEach(function(key){
			let parent = objParents[key]
			arrNavItems.push(parent);
		});
		return arrNavItems;		
	}

	_getLinks() {
		let that = this;


		function getLink(navItem, extraClasses = '') {
			let strClasses = extraClasses ? ("nav-link " + extraClasses) : "nav-link";


			let markup = <a className={strClasses}>{navItem.label}</a>;

			return markup;
		}

		return this.state.navItems.map((navItem) =>{
			let totalMarkup = null,
					linkMarkup = null,
					childMenuMarkup = null;

			// Primary link. It could be a toggle for a child menu.
			linkMarkup = navItem.arrChildMenu 
			?
				(<a className="nav-link" data-toggle="collapse" 
					 href={'#'+navItem.id+'-child'} role="button" 
					 aria-expanded="false" aria-controls={navItem.id+'-child'}
					>
					{navItem.label}<i class="fas fa-chevron-right float-right mt-1"></i>
				</a>)
			:
				getLink(navItem)
			;
	
			// If there's a child menu for this link.
			if (navItem.arrChildMenu) {
					let childLinks = navItem.arrChildMenu.map((childLink)=>{
						return (
							<li class="nav-item" key={childLink.id}>
								{getLink(childLink, "pl-4")}
							</li>
						)						
					});
					childMenuMarkup = (
						<ul id={navItem.id+'-child'} class="sub-menu nav collapse" data-parent={'#'+that.props.containerId}>
							{childLinks}
						</ul>
					);
			}

			return (
				<li class="nav-item" key={navItem.id}>
					{linkMarkup}
					{childMenuMarkup}
				</li>
			);			
		});
	}

	render() {
		console.log('--- sidebar', this);
		let that = this;
		if (that.state.initialized) {
			
		} else {
			
		}
		return (
			<ul class="sidebar-nav nav flex-column accordian"  id={that.props.containerId}>
				{that._getLinks(that.props.containerId)}
			</ul>
		);
	}
}
