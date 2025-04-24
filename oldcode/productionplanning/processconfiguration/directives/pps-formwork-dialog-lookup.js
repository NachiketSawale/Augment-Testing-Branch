(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.processconfiguration';
	angular.module(moduleName).directive('ppsProcessConfigurationFormworkDialogLookup', Lookup);

	Lookup.$inject = ['LookupFilterDialogDefinition',
		'BasicsLookupdataLookupDirectiveDefinition'];

	function Lookup(LookupFilterDialogDefinition,
		BasicsLookupdataLookupDirectiveDefinition) {

		var defaults = {
			lookupType: 'Formwork',
			valueMember: 'Id',
			displayMember: 'Code',
			version: 3,
			dialogUuid: '6253d833f2a94e97a7fa7df40303067d',
			uuid: '92af23c42c514fd99f804de294a3975c',
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