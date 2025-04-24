/**
 * Created by Nikhil on 5/10/2023
 */

(function (angular) {
	'use strict';
	/* global globals */
	/**
	 * @ngdoc factory
	 * @name logisticsPriceConditionSideBarWizardService
	 * @description
	 * Provides wizard configuration and implementation of all wizards of logistics price condition module
	 */

	const moduleName = 'logistic.pricecondition';
	angular.module(moduleName).service('logisticsPriceConditionSideBarWizardService', LogisticsPriceConditionSideBarWizardService);

	LogisticsPriceConditionSideBarWizardService.$inject = ['$http', '$translate', 'platformModalService', 'logisticPriceConditionDataService'];
	function LogisticsPriceConditionSideBarWizardService($http, $translate, platformModalService, logisticPriceConditionDataService)
	{
		this.generatePlantCostCodes = function generatePlantCostCodes(options) {
			let pricecondtions = { PriceConditionFk: logisticPriceConditionDataService.getSelected().Id, PlantSpecificValueFk: -1 };
			$http.post(globals.webApiBaseUrl + 'logistic/pricecondition/plantcostcode/generate', pricecondtions).then(function (response) {
				if (response && response.data) {
					let costCodes = response.data.length;
					if (costCodes > 0) {
						let modalOptions;
						modalOptions = {
							showGrouping: true,
							headerText: 'Generate Plant Cost Code',
							bodyText: 'From plant groups ' + costCodes + ' Plant Cost Codes have been generated successfully.',
							iconClass: 'ico-info',
						};
						platformModalService.showDialog(modalOptions);
					} else {
						let modalOptions;
						modalOptions = {
							showGrouping: true,
							headerText: 'Generate Plant Cost Code',
							bodyText: 'There is no new record generated',
							iconClass: 'ico-info',
						};
						platformModalService.showDialog(modalOptions);
					}
				} else {
					let modalOptions;
					modalOptions = {
						showGrouping: true,
						headerText: 'Generate Plant Cost Code',
						bodyText: 'There is no new record generated',
						iconClass: 'ico-info',
					};
					platformModalService.showDialog(modalOptions);
				}
			});
		};
	}
})(angular);