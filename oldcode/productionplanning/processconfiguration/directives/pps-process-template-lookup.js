(function (angular) {
	'use strict';
	/* global angular */
	var moduleName = 'productionplanning.processconfiguration';
	angular.module(moduleName).directive('ppsProcessTemplateCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'ProcessTemplate',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated',
				version: 3
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);
		}]);
})(angular);