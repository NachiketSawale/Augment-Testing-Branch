/**
 * Created by wuj on 2014/8/1.
 */
(function (angular, globals) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	globals.lookups.conType = function conType() {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'contype',
				valueMember: 'Id',
				displayMember: 'Description'
			}
		};
	};

	/**
	 * @ngdoc directive
	 * @name procurement.requisition.directive:conTypeCombobox
	 * @element div
	 * @restrict A
	 * @description
	 * Strategy combobox.
	 *
	 */
	angular.module('procurement.contract').directive('prcConTypeCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.conType().lookupOptions);
		}]);

})(angular, globals);
