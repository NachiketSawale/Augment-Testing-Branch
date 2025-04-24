/**
 * Created by wuj on 9/6/2015.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.procurementconfiguration';
	angular.module(moduleName).directive('basicsProcurementConfigurationTextTypeCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'PrcTextType',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);
		}]);

})(angular);