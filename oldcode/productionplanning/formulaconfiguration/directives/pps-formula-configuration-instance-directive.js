(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.formulaconfiguration';
	angular.module(moduleName).directive('productionplanningFormulaConfigurationInstanceLookup', InstanccLookup);

	InstanccLookup.$inject = ['LookupFilterDialogDefinition',
		'BasicsLookupdataLookupDirectiveDefinition'];

	function InstanccLookup(LookupFilterDialogDefinition,
		BasicsLookupdataLookupDirectiveDefinition) {

		let defaults = {
			lookupType: 'PpsFormulaInstance',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Translated',
			version: 3,
			uuid: '0e8e82f08f69411cb26c4379d6405c03',
			columns: [
				{
					field: 'Code',
					formatter: 'code',
					id: 'Code',
					name: 'Code',
					name$tr$: 'cloud.common.entityCode'
				},
				{ id: 'Description', field: 'DescriptionInfo', name: 'Description', width: 300, formatter: 'translation', name$tr$: 'cloud.common.entityDescription' }
			],
			disableCache: true,
			width: 300,
			height: 200
		};
		return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults);
	}
})(angular);