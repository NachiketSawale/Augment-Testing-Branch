/**
 * Created by wui on 11/1/2018.
 */

(function (angular, globals) {
	'use strict';

	var moduleName = 'procurement.common';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	globals.lookups.prcTexttype = function prcTexttype() {
		return {
			lookupOptions: {
				lookupType: 'PrcTexttype',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated'
			}
		};
	};

	angular.module(moduleName).directive('prcTextTypeCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.prcTexttype().lookupOptions);
		}]);

})(angular, globals);