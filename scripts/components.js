var CP = CP || {};
CP.components = {};


/*
One component for all tables. It does not care what page it's on or what report it's 
displaying. One minor data change is included to simulate times at work where the data 
comes in slightly different from the way one would like. In this case, a user id is 
included in the data returned.
*/
CP.components.table = class extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			//report:null
		};
	}

	componentDidMount() {
		// Some things need to update when the language is changed.
		if (this.props.canForceUpdate) CP.addToInstances(this);
	}

	_getColumns(data) {
		return data.fields.map((field) =>{
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
				<tr key={row.userId}>
					{data.fields.map((field)=>{
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
			let direction = CP.getRTL() ? ' rtl' : '';
			markup = 
				<table className={"table table-responsive"+direction}>
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
		this.getReport = this.getReport.bind(this);
	}

	componentDidMount() {
		CP.getReport = this.getReport;
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
					<h1><i className="fas fa-bolt mx-2"></i>{CP.getLanguageId(this.state.titleId)}</h1>
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

CP.components.primarynav = class extends React.Component {
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
		/*
		This function arranges the data so that it will be friendly to the primarynav component.
		*/
		let arrParentKeys = [],
			arrChildLinks = [],
			objParents = {};

		data.forEach(function(item){
			/*
			Parent items will not have a parent id. This primarynav only goes one layer down, 
			from parent to a single set of children.
			*/
			if (!item.parentId) {
				/*
				Array is just parent names, to preserve the order. Data will come from the object.
				*/
				arrParentKeys.push(item.id);
				objParents[item.id] = item;
			} else {
				arrChildLinks.push(item);
			}
		});
		arrChildLinks.forEach(function(item){
			/*
			Starting the parent object's child array if it doesn't exist, adding to it if it does exist.
			*/
			let parent = objParents[item.parentId];
			parent.arrChildMenu = parent.arrChildMenu || [];
			parent.arrChildMenu.push(item);
		});
		let arrNavItems = [];
		arrParentKeys.forEach(function(key){
			/*
			Now that the objects are built, add them in the original order.
			*/
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
					{CP.getLanguageId(navItem.id)}<i className="fas fa-chevron-right float-right mt-1"></i>
				</a>)
			:
				getLink(navItem)
			;
	
			// If there's a child menu for this link.
			if (navItem.arrChildMenu) {
					let childLinks = navItem.arrChildMenu.map((childLink)=>{
						return (
							<li className="nav-item" key={childLink.id}>
								{getLink(childLink, "pl-4")}
							</li>
						)						
					});
					childMenuMarkup = (
						<ul id={navItem.id+'-child'} className="sub-menu nav collapse" data-parent={'#'+that.props.containerId}>
							{childLinks}
						</ul>
					);
			}

			return (
				<li className="nav-item" key={navItem.id}>
					{linkMarkup}
					{childMenuMarkup}
				</li>
			);			
		});
	}

	render() {
		let that = this;
		return (
			<ul className="nav flex-column accordian"  id={that.props.containerId}>
				{that._getLinks(that.props.containerId)}
			</ul>
		);
	}
}
