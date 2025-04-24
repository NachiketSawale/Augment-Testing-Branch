(function (angular, globals) {
	'use strict';

	var moduleName = 'procurement.common';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	globals.lookups.prcItemEvaluation = function prcItemEvaluation() {
		return {
			lookupOptions: {
				version:3,
				lookupType: 'PrcItemEvaluation',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated',
				showClearButton: true
			}
		};
	};

	/**
	 * @ngdoc directive
	 * @name procurementCommonPrcItemEvaluationCombobox
	 * @element div
	 * @restrict A
	 * @description
	 *
	 *
	 */
	angular.module(moduleName).directive('procurementCommonPrcItemEvaluationCombobox', [
		'BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.prcItemEvaluation().lookupOptions);
		}
	]);

})(angular, globals);
