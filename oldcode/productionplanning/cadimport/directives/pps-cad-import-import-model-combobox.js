(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.cadimport';
	angular.module(moduleName).directive('ppsCadImportImportModelCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'CadImportModel',
				valueMember: 'Id',
				displayMember: 'Description',
				imageSelector: 'platformStatusIconService',
				version: 3,
				selectableCallback: function (dataItem) {
					return dataItem.Id !== 9;//custom can't selected
				}
			};
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);
		}]);
})(angular);
