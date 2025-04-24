/**
 * Created by wwa on 4/8/2016.
 */
(function (angular) {
	'use strict';
	angular.module('basics.procurementconfiguration').directive('procurementConfigurationBillingSchemaCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'PrcConfig2BSchema',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);
		}]);

})(angular);