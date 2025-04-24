/**
 * Created by wuj on 2014/8/1.
 */
(function (angular, globals) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	var moduleName = 'procurement.common';

	globals.lookups.milesoneType = function milesoneType() {
		return {
			lookupOptions: {
				version:3,
				lookupType: 'milestonetype',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated'
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
	angular.module(moduleName).directive('procurementCommonMilestoneTypeCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.milesoneType().lookupOptions);
		}]);

})(angular, globals);
