( function (angular) {
	'use strict';
	var moduleName = 'productionplanning.cadimportconfig';
	angular.module(moduleName).directive('ppsCadImportMessageLevelCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'CadImportMessageLevel',
				valueMember: 'Id',
				displayMember: 'Description',
				imageSelector: 'platformStatusIconService',
				version: 3
			};
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);
		}]);
})(angular);
