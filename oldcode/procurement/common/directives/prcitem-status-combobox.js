/**
 * Created by wuj on 2014/8/6.
 */
(function (angular, globals) {
	'use strict';

	var moduleName = 'procurement.common';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	globals.lookups.prcItemStatus = function prcItemStatus() {
		return {
			lookupOptions: {
				version:3,
				lookupType: 'prcitemstatus',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated',
				imageSelector: 'platformStatusIconService'
			}
		};
	};

	/**
	 * @ngdoc directive
	 * @name procurement.requisition.directive:prcReqMilestonCombobox
	 * @element div
	 * @restrict A
	 * @description
	 * Strategy combobox.
	 *
	 */
	angular.module(moduleName).directive('procurementCommonPrcItemStatusCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.prcItemStatus().lookupOptions);
		}]);

})(angular, globals);
