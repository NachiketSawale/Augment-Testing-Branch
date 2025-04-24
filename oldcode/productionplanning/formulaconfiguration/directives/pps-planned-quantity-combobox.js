(function (angular) {
	'use strict';
	/* global angular */
	var moduleName = 'productionplanning.formulaconfiguration';
	angular.module(moduleName).directive('ppsPlannedQuantityCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'PpsPlannedQuantity',
				valueMember: 'Id',
				displayMember: 'Description',
				version: 3
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);
		}]);
})(angular);