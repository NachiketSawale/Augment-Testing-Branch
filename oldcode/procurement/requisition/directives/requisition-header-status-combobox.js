(function (angular/* , Platform */, globals) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	globals.lookups.reqStatus = function reqStatus() {
		return {
			lookupOptions: {
				version:3,
				lookupType: 'ReqStatus',
				valueMember: 'Id',
				displayMember: 'Description',
				imageSelector: 'platformStatusIconService'
			}
		};
	};

	/**
	 * @ngdoc directive
	 * @name procurement.requisition.directive:procurementRequisitionHeaderStatusCombobox
	 * @element div
	 * @restrict A
	 * @description
	 * Strategy combobox.
	 *
	 */
	angular.module('procurement.common').directive('procurementRequisitionHeaderStatusCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.reqStatus().lookupOptions);
		}]);

})(angular, globals);
