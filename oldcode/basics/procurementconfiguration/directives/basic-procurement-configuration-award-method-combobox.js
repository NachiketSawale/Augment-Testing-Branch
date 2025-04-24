/**
 * Created by wuj on 2014/8/1.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.procurementconfiguration';
	angular.module(moduleName).directive('basicsProcurementConfigurationAwardMethodCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'PrcAwardMethod',
				valueMember: 'Id',
				displayMember: 'Description'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);
		}]);

})(angular);
