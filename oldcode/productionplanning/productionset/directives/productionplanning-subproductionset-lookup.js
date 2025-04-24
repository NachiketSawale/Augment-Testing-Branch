(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.productionset';
	angular.module(moduleName).directive('productionplanningSubProductionSetLookup', subProductionSetLookup);

	subProductionSetLookup.$inject = ['basicsLookupdataLookupFilterService', 'BasicsLookupdataLookupDirectiveDefinition'];

	function subProductionSetLookup(basicsLookupdataLookupFilterService, BasicsLookupdataLookupDirectiveDefinition) {

		const defaults = {
			lookupType: 'ProductionsetLookup',
			valueMember: 'Id',
			displayMember: 'Code',
			uuid: '9a319a1f4a7b4a2293ac4560efe57fa3',
			columns: [{
				id: 'Code',
				field: 'Code',
				name: 'Code',
				name$tr$: 'cloud.common.entityCode',
				formatter: 'code',
				width: 70
			},{
				id: 'Date',
				field: 'PlannedStart',
				name: 'Date',
				name$tr$: 'cloud.common.entityDate',
				formatter: 'dateutc',
				width: 100
			}, {
				id: 'Supplier',
				field: 'ProductionSiteFk',
				name: 'Supplier',
				name$tr$: 'cloud.common.entitySupplier',
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'SiteNew',
					displayMember: 'Code',
					version: 3
				},
				width: 100
			}],
			width: 500,
			height: 200,
			version: 3
		};

		return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults);
	}
})(angular);