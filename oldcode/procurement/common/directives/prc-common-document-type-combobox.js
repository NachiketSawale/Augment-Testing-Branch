(function (angular, globals) {
	'use strict';
	var moduleName = 'procurement.common';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	globals.lookups.prcDocumentType = function prcDocumentType() {
		return {
			lookupOptions: {
				version:3,
				lookupType: 'prcdocumenttype',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated'
			}
		};
	};

	/**
     * @ngdoc directive
     * @name procurement.common.directive:procurementCommonDocumentTypeCombobox
     * @element div
     * @restrict A
     * @description
     * Configuration combobox.
     *
     */
	angular.module(moduleName).directive('procurementCommonDocumentTypeCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.prcDocumentType().lookupOptions);
		}]);

})(angular, globals);