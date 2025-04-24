/**
 * Created by wuj on 2014/8/1.
 */
(function (angular, globals) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	globals.lookups.prcPackage2Header = function prcPackage2Header() {
		return {
			lookupOptions: {
				version:3,
				lookupType: 'PrcPackage2Header',
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
	angular.module('procurement.package').directive('procurementPackagePackage2HeaderCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.prcPackage2Header().lookupOptions);
		}]);

})(angular, globals);
