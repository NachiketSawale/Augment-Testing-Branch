/**
 * Created by wwa on 8/28/2015.
 */
(function (angular, globals) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	globals.lookups.prcPackageType = function prcPackageType() {
		return {
			lookupOptions: {
				version:3,
				'lookupType': 'PrcPackageType',
				'valueMember': 'Id',
				'displayMember': 'DescriptionInfo.Translated'
			}
		};
	};

	angular.module('procurement.common').directive('procurementPackageTypeCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.prcPackageType().lookupOptions);
		}]);

})(angular, globals);