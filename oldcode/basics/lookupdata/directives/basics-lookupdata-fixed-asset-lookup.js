
(function (angular) {
	'use strict';

	var moduleName = 'basics.lookupdata';

	angular.module(moduleName).directive('basicsLookupdataFixedAssetLookup',['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'FixedAsset',
				valueMember: 'Id',
				displayMember: 'Asset',
				dialogOptions: {
					width: '680px'
				},
				dialogUuid: '8a97006c125542f993f2b178fa6a11f0',
				uuid: '347a9ff3188842d8816da3d506d87adb',
				columns: [
					{ id: 'Asset', field: 'Asset', name: 'Asset', width: 100, name$tr$: 'cloud.common.asset',sortable: true },
					{ id: 'Description', field: 'Description', name: 'Description', width: 100, name$tr$: 'cloud.common.entityDescription',sortable: true },
					{ id: 'CompanyCode', field: 'CompanyFk', name: 'Company Code', width: 100, name$tr$: 'cloud.common.entityCompanyCode',
						formatter: 'lookup',
						formatterOptions:{
							lookupType: 'Company',
							displayMember: 'Code'
						},sortable: true},
					{ id: 'CompanyName', field: 'CompanyFk', name: 'Company Name', width: 100, name$tr$: 'cloud.common.entityCompanyName',
						formatter: 'lookup',
						formatterOptions:{
							lookupType: 'Company',
							displayMember: 'CompanyName'
						},sortable: true},
					{ id: 'StartDate', field: 'StartDate', name: 'StartDate', width: 100, name$tr$: 'basics.company.entityStartDate',sortable: true },
					{ id: 'EndDate', field: 'EndDate', name: 'EndDate', width: 100, name$tr$: 'basics.company.entityEndDate',sortable: true }
				],
				events: [],
				title: {
					name: 'cloud.common.fixedAssetTitle'
				},
				pageOptions: {
					enabled: true
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
		}]);

})(angular);