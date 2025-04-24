/**
 * Created by sfi on 10/16/2015.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.procurementconfiguration';
	angular.module(moduleName).directive('basicsProcurementConfigurationTotalKindCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'PrcTotalKind',
				valueMember: 'Id',
				displayMember: 'Description'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);
		}]);

})(angular);
