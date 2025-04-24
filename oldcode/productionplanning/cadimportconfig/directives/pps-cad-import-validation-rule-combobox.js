( function (angular) {
	'use strict';
	var moduleName = 'productionplanning.cadimportconfig';
	angular.module(moduleName).directive('ppsCadImportValidationRuleCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'CadImportValidationRule',
				valueMember: 'Id',
				displayMember: 'Description',
				imageSelector: 'platformStatusIconService',
				version: 3
			};
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);
		}]);
})(angular);
