var CP = CP || {};
CP.components = {};

CP.components.table = class extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			//report:null
		};
	}

	componentDidMount() {
		if (this.props.canForceUpdate) CP.addToInstances(this);
	}

	_getColumns(data) {
		return data.fields.slice(1).map((field) =>{
			return(
				<th key={field.id}>
				{CP.getLanguageId(field.id)}
				</th>
			);
		});
	}

	_getRows(data){
		return data.rows.map((row) =>{
			return(
				<tr key={row.id}>
					{data.fields.slice(1).map((field)=>{
						return(<td key={field.id}>{row[field.id]}</td>);
					})}
				</tr>
			);
		});
	}

	render() {
		let that = this,
			markup = null;

		if (this.props.data) {
			let columns = that._getColumns(that.props.data);
			let rows = that._getRows(that.props.data);
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
		CP.getReport = this.getReport.bind(this);
		if (this.props.canForceUpdate) CP.addToInstances(this);
		this.getReport();
	}

	getReport(reportName = 'report-general') {
		let that = this;
		that.setState({
			initialized:false,
		});

		let path = 'data/'+reportName+'.json';

		CP.getData(path).then((data)=>{
			that.setState({
				reportName: reportName,
				titleId: data.titleId,
				report:data.report,
				initialized:true
			});
		});

	}

	render() {
		let that = this,
			markup = null;

		if (this.state.initialized && this.state.titleId && this.state.report) {
			markup = 
				<div>
					<h1><i class="fas fa-bolt mr-2"></i>{CP.getLanguageId(this.state.titleId)}</h1>
					<CP.components.table data={this.state.report} />
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
		this.state = {
			navItems:this._transformData(props.data)
		};
		this.handleClick = this.handleClick.bind(this);
	}

	componentDidMount() {
		let that = this;
		//if (that.props.instanceName) CP.instances[that.props.instanceName] = this;
		if (that.props.canForceUpdate) CP.addToInstances(this);
	}

	getNavItem(id) {
		return this.props.data.find(function(item){
			return item.id === id;
		});
	}

	handleClick(evt) {
		console.log('handleClick', this.getNavItem(evt.target.id));
		evt.preventDefault();
		let navItem = this.getNavItem(evt.target.id);
		if (navItem.action && navItem.action === 'report') {
			CP.getReport(navItem.target);
		}
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
		console.log('arrNavItems', arrNavItems);
		return arrNavItems;		
	}

	_getLinks() {
		let that = this;

		function getLink(navItem, extraClasses = '') {
			let strClasses = extraClasses ? ("nav-link " + extraClasses) : "nav-link";
			let markup = <a id={navItem.id} onClick={that.handleClick} className={strClasses} href="#">{CP.getLanguageId(navItem.id)}</a>;
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
					{CP.getLanguageId(navItem.id)}<i class="fas fa-chevron-right float-right mt-1"></i>
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
		return (
			<ul class="sidebar-nav nav flex-column accordian"  id={that.props.containerId}>
				{that._getLinks(that.props.containerId)}
			</ul>
		);
	}
}
