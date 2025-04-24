/**
 * Created by zos on 9/6/2015.
 */
(function (angular, globals) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	globals.lookups.prcPackageTemplate = function prcPackageTemplate() {
		return {
			lookupOptions: {
				version:3,
				lookupType: 'PrcPackageTemplate',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated'
			}
		};
	};

	angular.module('procurement.package').directive('packageTemplateCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.prcPackageTemplate().lookupOptions);
		}]);

})(angular, globals);