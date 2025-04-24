/**
 * Created by anl on 8/1/2019.
 */

/* globals angular */
(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.accounting';
	angular.module(moduleName).constant('ComponentTypesResult', {
		Material: 1,
		CostCode: 2,
		properties: {
			1: {
				directive: 'basics-material-material-lookup',
				lookupType: 'MaterialCommodity',
				displayMember: 'Code',
				descriptionPropertyName: 'DescriptionInfo.Translated',
				property: 'selectedMaterial'
			},
			2: {
				directive: 'basics-cost-codes-lookup',
				lookupType: 'costcode',
				displayMember: 'Code',
				descriptionPropertyName: 'DescriptionInfo.Translated',
				property: 'selectedCostCode',
				version: 3,
			}
		}
	});
})(angular);