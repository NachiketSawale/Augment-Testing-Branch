(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.productionplace';
	angular.module(moduleName).directive('ppsProductionPlaceDialogLookup', Lookup);

	Lookup.$inject = ['LookupFilterDialogDefinition',
		'BasicsLookupdataLookupDirectiveDefinition'];

	function Lookup(LookupFilterDialogDefinition,
		BasicsLookupdataLookupDirectiveDefinition) {

		var defaults = {
			lookupType: 'PpsProductionPlace',
			valueMember: 'Id',
			displayMember: 'Code',
			version: 3,
			columns: [
				{ id: 'Code', field: 'Code', name: 'Code', width: 180, formatter:'code', name$tr$: 'cloud.common.entityCode' },
				{ id: 'Description', field: 'Description', name: 'Description', width: 300, formatter:'description',  name$tr$: 'cloud.common.entityDescription'},
			],
			disableCache: true,
			width: 500,
			height: 200
		};
		return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
	}
})(angular);