// grid columns definition here
angular.module('businesspartner.main').value('businesspartnerMainBeserveAddGridCfg', [
	{
		id: 'resulttype', field: 'resulttype', name$tr$: 'businesspartner.main.crefodlg.gridcolstatus',
		formatter: 'image', formatterOptions: {imageSelector: 'businesspartnerMainBeserveAddIconService', tooltip: true},
		pinned: true, readonly: true, width: 35, sortable: true, resizable: true, cssClass: 'text-center'
	},
	{
		id: 'companyname', field: 'companyname', name$tr$: 'businesspartner.main.crefodlg.gridcolname',
		formatter: 'description', width: 170, sortable: true, resizable: true
	},
	{
		id: 'zipcode', field: 'zipcode', name$tr$: 'businesspartner.main.crefodlg.gridcolzipcode',
		formatter: 'description', width: 50, sortable: true, resizable: true
	},
	{
		id: 'location', field: 'location', name$tr$: 'businesspartner.main.crefodlg.gridcollocation',
		formatter: 'description', width: 100, sortable: true, resizable: true, hidden: true
	},
	{
		id: 'address', field: 'address', name$tr$: 'businesspartner.main.crefodlg.gridcoladdress',
		formatter: 'description', width: 180, sortable: true, resizable: true
	},
	{
		id: 'phonecomplete', field: 'phonecomplete', name$tr$: 'businesspartner.main.crefodlg.gridcolphone',
		formatter: 'description', width: 80, sortable: true, resizable: true
	},
	{
		id: 'bedirectno', field: 'bedirectno', name$tr$: 'businesspartner.main.crefodlg.gridcolbedirectno',
		formatter: 'description', width: 70, sortable: true, resizable: true
	},
	{
		id: 'crefono', field: 'crefono', name$tr$: 'businesspartner.main.crefodlg.gridcolcrefono',
		formatter: 'description', width: 70, sortable: true, resizable: true
	},
	{
		id: 'score', field: 'score', name$tr$: 'businesspartner.main.crefodlg.gridcolscore',
		formatter: 'description', width: 40, sortable: true, resizable: true
	},
	{
		id: 'branchcode', field: 'branchcode', name$tr$: 'businesspartner.main.crefodlg.gridcolbranchcode',
		formatter: 'description', width: 80, sortable: true, resizable: true
	},
	{
		id: 'faxcomplete', field: 'faxcomplete', name$tr$: 'businesspartner.main.crefodlg.gridcolfax',
		formatter: 'description', width: 80, sortable: true, resizable: true
	},
	{
		id: 'email', field: 'email', name$tr$: 'businesspartner.main.crefodlg.gridcolemail',
		formatter: 'description', width: 80, sortable: true, resizable: true
	},
	{
		id: 'interneturl', field: 'interneturl', name$tr$: 'businesspartner.main.crefodlg.gridcolinterneturl',
		formatter: 'description', width: 80, sortable: true, resizable: true
	},
	{
		id: 'vatno', field: 'vatno', name$tr$: 'businesspartner.main.crefodlg.gridcolvatno',
		formatter: 'description', width: 80, sortable: true, resizable: true
	},
	{
		id: 'taxnoused', field: 'taxnoused', name$tr$: 'businesspartner.main.crefodlg.gridcoltaxnoused',
		formatter: 'description', width: 80, sortable: true, resizable: true
	},
	{
		id: 'traderegisterused', field: 'traderegisterused', name$tr$: 'businesspartner.main.crefodlg.gridcoltraderegisterused',
		formatter: 'description', width: 80, sortable: true, resizable: true
	},
	{
		id: 'traderegisternoused', field: 'traderegisternoused', name$tr$: 'businesspartner.main.crefodlg.gridcoltraderegisternoused',
		formatter: 'description', width: 80, sortable: true, resizable: true
	}
]);

// grid columns definition here
angular.module('businesspartner.main').value('businesspartnerMainBeserveResultGridCfg', [
	{
		id: 'resulttyp', field: 'resulttyp', name$tr$: 'businesspartner.main.crefodlg.gridcolstatus',
		formatter: 'image', formatterOptions: {imageSelector: 'businesspartnerMainBeserveResultIconService', tooltip: true},
		width: 50, sortable: true, resizable: true, cssClass: 'text-center'
	},
	{
		id: 'name', field: 'name', name$tr$: 'businesspartner.main.crefodlg.gridcolname',
		formatter: 'description', readonly: true, width: 300, sortable: true, resizable: true
	},
	{
		id: 'address', field: 'address', name$tr$: 'businesspartner.main.crefodlg.gridcoladdress',
		formatter: 'description', width: 200, sortable: true, resizable: true
	},
	{
		id: 'phone', field: 'phone', name$tr$: 'businesspartner.main.crefodlg.gridcolphone',
		formatter: 'description', width: 100, sortable: true, resizable: true
	},
	{
		id: 'fax', field: 'fax', name$tr$: 'businesspartner.main.crefodlg.gridcolfax',
		formatter: 'description', width: 100, sortable: true, resizable: true
	},
	{
		id: 'updateinfo', field: 'updateinfo', name$tr$: 'businesspartner.main.crefodlg.gridcolupdateinfo',
		formatter: 'description', width: 200, sortable: true, resizable: true
	}
]);

// grid columns definition here
angular.module('businesspartner.main').value('businesspartnerMainBeserveUpdateGridCfg', [
	{
		id: 'update', field: 'update', name$tr$: 'businesspartner.main.crefodlg.gridcolupdate',
		pinned: true, formatter: 'boolean', editor: 'boolean', width: 60, sortable: false, resizable: true
	},
	{
		id: 'name', field: 'name', name$tr$: 'businesspartner.main.crefodlg.gridcolname',
		formatter: 'description', width: 300, sortable: true, resizable: true
	},
	{
		id: 'address', field: 'address', name$tr$: 'businesspartner.main.crefodlg.gridcoladdress',
		formatter: 'description', width: 300, sortable: true, resizable: true
	},
	{
		id: 'bedirectno', field: 'bedirectno', name$tr$: 'businesspartner.main.crefodlg.gridcolbedirectno',
		formatter: 'description', width: 100, sortable: true, resizable: true
	},
	{
		id: 'crefono', field: 'crefono', name$tr$: 'businesspartner.main.crefodlg.gridcolcrefono',
		formatter: 'description', width: 100, sortable: true, resizable: true
	}
]);
