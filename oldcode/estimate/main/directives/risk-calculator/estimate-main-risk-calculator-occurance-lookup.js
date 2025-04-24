/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	let moduleName = 'estimate.main';
	angular.module(moduleName).directive('estimateMainRiskCalculatorOccuranceLookup', [
		'BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			let defaults = {
				lookupType: 'ProbabilityRisk',
				valueMember: 'Id',
				displayMember: 'Description',
				isDataUpdatedPopup: true,
				showClearButton: true
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit',defaults,{
				dataProvider: 'estimateMainRiskOccuranceDataService'
			});
		}
	]);
})(angular);
