var CP = CP || {};
CP.components = {};
CP.components.table = class extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			initialized:false,
			report:null
		};
	}

	componentDidMount() {
		let that = this;
		console.log('table state', this.state);
		CP.methods.getReport = that.getReport.bind(this);
		this.getReport();
	}

	getReport(reportName = 'report-general') {
		let that = this;
		that.setState({
			initialized:false
		});
		CP.methods.getData('data/'+reportName+'.json', (data) =>{
			that.setState({
				report:data,
				initialized:true
			});
		});
	}
  
	_getColumns() {
		let that = this;
		return that.state.report.fields.slice(1).map((field) =>{
			return(
				<th key={field.id}>
					{field.label}
				</th>
			);
		});
	}

	_getRows(){
		let that = this;
		return that.state.report.rows.map((row) =>{
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
		let that = this,
			markup = null;

		if (this.state.initialized) {
			let columns = that._getColumns();
			let rows = that._getRows();
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

CP.components.sidebar = class extends React.Component {
	constructor(props) {
		super(props);
		this.state = {navItems:this._transformData(props.data)};
	}

	componentDidMount() {
		let that = this;
		console.log('sidebar state', this.state);
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