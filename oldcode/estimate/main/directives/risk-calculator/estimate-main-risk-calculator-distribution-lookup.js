/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).directive('estimateMainRiskCalculatorDistributionLookupCombobox',[
		'BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			let defaults = {
				lookupType: 'DistributionSchema',
				valueMember: 'Id',
				displayMember: 'Description',
				isDataUpdatedPopup: true,
				showClearButton: true
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit',defaults,{
				dataProvider: 'estimateMainRiskCalculatorDistributionDataService'
			});

		}
	]);
})(angular);
