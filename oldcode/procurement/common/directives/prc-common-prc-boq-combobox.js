/**
 * Created by wuj on 2014/8/1.
 */
(function (angular, globals) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	var moduleName = 'procurement.common';

	globals.lookups.prcBoq = function prcBoq() {
		return {
			lookupOptions: {
				lookupType: 'PrcBoq',
				valueMember: 'Id',
				displayMember: 'Description'
			}
		};
	};

	/**
     * @ngdoc directive
     * @name procurement.requisition.directive:procurementCommonAwardMethodCombobox
     * @element div
     * @restrict A
     * @description
     * Strategy combobox.
     *
     */
	angular.module(moduleName).directive('procurementCommonPrcBoqCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.prcBoq().lookupOptions);
		}]);

})(angular, globals);
