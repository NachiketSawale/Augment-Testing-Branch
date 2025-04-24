(function (angular, globals) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	globals.lookups.reqType = function reqType() {
		return {
			lookupOptions: {
				version:3,
				lookupType: 'reqtype',
				valueMember: 'Id',
				displayMember: 'Description'
			}
		};
	};

	/**
	 * @ngdoc directive
	 * @name procurement.requisition.directive:prcReqHeaderRequisitionTypeCombobox
	 * @element div
	 * @restrict A
	 * @description
	 * Requisition type lookup.
	 *
	 */
	angular.module('procurement.requisition').directive('prcReqHeaderRequisitionTypeCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {

			/* jshint -W053 */
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.reqType().lookupOptions);
		}]);

})(angular, globals);