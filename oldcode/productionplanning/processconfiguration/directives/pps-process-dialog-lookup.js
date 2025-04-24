(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.processconfiguration';
	angular.module(moduleName).directive('ppsProcessConfigurationProcessDialogLookup', Lookup);

	Lookup.$inject = ['LookupFilterDialogDefinition',
		'BasicsLookupdataLookupDirectiveDefinition'];

	function Lookup(LookupFilterDialogDefinition,
		BasicsLookupdataLookupDirectiveDefinition) {

		var defaults = {
			lookupType: 'Process',
			valueMember: 'Id',
			displayMember: 'Code',
			version: 3,
			dialogUuid: '5d32cc2b1881447bba35643b3d9bf252',
			uuid: '0199e3af8b6b4339b4ff5ddfd4ab04ca',
			columns: [
				{ id: 'Code', field: 'Code', name: 'Code', width: 180, formatter:'code', name$tr$: 'cloud.common.entityCode' },
				{ id: 'Description', field: 'Description', name: 'Description', width: 300, formatter:'translation',  name$tr$: 'cloud.common.entityDescription'},
			],
			disableCache: true,
			width: 500,
			height: 200
		};
		return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
	}
})(angular);