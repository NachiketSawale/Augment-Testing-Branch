/**
 * Created by wwa on 8/12/2015.
 */
(function (angular, globals) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	globals.lookups.packageStatus = function packageStatus() {
		return {
			lookupOptions: {
				version: 3,
				'lookupType': 'PackageStatus',
				'valueMember': 'Id',
				'displayMember': 'DescriptionInfo.Translated',
				'imageSelector': 'platformStatusIconService'
			}
		};
	};

	angular.module('procurement.common').directive('procurementPackageStatusCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.packageStatus().lookupOptions);
		}]);

})(angular, globals);
