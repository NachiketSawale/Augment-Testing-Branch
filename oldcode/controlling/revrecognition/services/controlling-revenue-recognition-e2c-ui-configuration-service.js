/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'controlling.revrecognition';
	var cloudCommonModule = 'cloud.common';
	/**
     * @ngdoc service
     * @name controllingRevenueRecognitionUIConfigurationService
     * @function
     * @requires
     *
     * @description
     * The UI configuration service for the module.
     */
	angular.module(moduleName).factory('controllingRevenueRecognitionE2cLayout', [
		function controllingRevenueRecognitionE2cLayout() {
			return {
				fid: 'controlling.revenuerecognition.e2cForm',
				version: '1.0.0',
				showGrouping: true,
				addValidationAutomatically: true,
				groups: [
					{
						'gid': 'baseGroup',
						'attributes': ['code','description','totalcost','estimatedcost','actualcost','actualcostpercent','contractedvalue','calculatedrevenue','calculatedrevenuepercent','actualrevenue','revenueaccrual','revenueaccrualpercent','revenuetocomplete']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [moduleName, cloudCommonModule],
					'extraWords': {
						'Code': {location: cloudCommonModule, identifier: 'entityCode', initial: 'Code'},
						'EstimatedCost': {location: moduleName, identifier: 'entityTotalCost', initial: 'Baseline Total Cost'},
						'TotalCost': {location: moduleName, identifier: 'entityEstimatedCost', initial: 'Estimated Total cost'},
						'ActualCost': {location: moduleName, identifier: 'entityActualCost', initial: 'Actual Cost to Period'},
						'ActualCostPercent': {location: moduleName, identifier: 'entityActualCostPercent', initial: '% Used Cost'},
						'ContractedValue': {location: moduleName, identifier: 'entityContractedValue', initial: 'Contracted Price (Sales)'},
						'CalculatedRevenue': {location: moduleName, identifier: 'entityCalculatedRevenue', initial: 'Accrued Revenue (Cumulative)'},
						'CalculatedRevenuePercent': {location: moduleName, identifier: 'entityCalculatedRevenuePercent', initial: '% Accrued Revenue (Cumulative)'},
						'ActualRevenue': {location: moduleName, identifier: 'entityActualRevenue', initial: 'Accrued Revenue(Prior Periods)'},
						'RevenueAccrual': {location: moduleName, identifier: 'entityRevenueAccrual', initial: 'Accrued Revenue(Current Periods)'},
						'RevenueAccrualPercent': {location: moduleName, identifier: 'entityRevenueAccrualPercent', initial: '% Accrued Revenue(Current Periods)'},
						'RevenueToComplete': {location: moduleName, identifier: 'entityRevenueToComplete', initial: 'Remaining to Complete'},
					}
				}
			};
		}
	]);


	angular.module(moduleName).factory('controllingRevenueRecognitionE2cUIStandardService',

		['platformUIStandardConfigService', 'controllingRevenueRecognitionTranslationService', 'platformSchemaService', 'controllingRevenueRecognitionE2cLayout', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, platformSchemaService, controllingRevenueRecognitionE2cLayout, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'PrrItemE2cDto',
					moduleSubModule: 'Controlling.RevRecognition'
				});

				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}

				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				var service = new BaseService(controllingRevenueRecognitionE2cLayout, domainSchema, translationService);

				platformUIStandardExtentService.extend(service, controllingRevenueRecognitionE2cLayout.addition, domainSchema);

				return service;
			}
		]);
})(angular);
