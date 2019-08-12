var CP = CP || {};
CP.components = {};
CP.components.table = class extends React.Component {
	constructor(props) {
		super(props);
		this.state = props.data;
	}

	_getColumns() {
		let that = this;
		return that.state.fields.slice(1).map((field) =>{
			return(
				<th key={field.id}>
					{field.label}
				</th>
			);
		});
	}

	_getRows(){
		let that = this;
		return that.state.rows.map((row) =>{
			return(
				<tr key={row.id}>
					{that.state.fields.slice(1).map((field)=>{
						return(<td key={field.id}>{row[field.id]}</td>);
					})}
				</tr>
			);
		});
	}

	render() {
		let that = this;
		let columns = that._getColumns();
		let rows = that._getRows();
		return (
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
		);
	}
}

CP.components.sidebar = class extends React.Component {
	constructor(props) {
		super(props);
		this.state = {navItems:this._transformData(props.data)};
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
				(<a className="nav-link">
					{navItem.label}
				</a>)
			;
	
			// If there's a child menu for this link.
			if (navItem.arrChildMenu) {
					let childLinks = navItem.arrChildMenu.map((childLink)=>{
						return (
							<li class="nav-item" key={childLink.id}>
								<a className="nav-link pl-4">
									{childLink.label}
								</a>
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