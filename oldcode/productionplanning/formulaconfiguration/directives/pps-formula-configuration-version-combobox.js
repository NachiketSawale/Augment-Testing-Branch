
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.formulaconfiguration';
	angular.module(moduleName).directive('ppsFormulaConfigurationVersionCombobox', Lookup);

	Lookup.$inject = ['BasicsLookupdataLookupDirectiveDefinition'];

	function Lookup(BasicsLookupdataLookupDirectiveDefinition) {
		var defaults = {
			version: 3,
			lookupType: 'PpsFormulaVersion',
			valueMember: 'Id',
			displayMember: 'FormulaVersion'
			//disableDataCaching: true
		};

		return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);

	}
})(angular);
