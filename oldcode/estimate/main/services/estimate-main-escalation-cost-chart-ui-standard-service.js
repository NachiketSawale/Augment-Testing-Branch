/**
 * Created by Sahil on 13/04/2020.
 */
(function () {

	'use strict';
	let moduleName = 'estimate.main';
	/**
     * @ngdoc service
     * @name estimateMainEscalationCostChartUIStandardService
     * @function
     *
     */
	angular.module(moduleName).factory('estimateMainEscalationCostChartUIStandardService',

		['platformUIStandardConfigService', 'estimateMainTranslationService', 'platformSchemaService', // 'basicsLookupdataConfigGenerator', 'basicsCommonCodeDescriptionSettingsService',

			function (platformUIStandardConfigService, estimateMainTranslationService, platformSchemaService// , basicsLookupdataConfigGenerator, basicsCommonCodeDescriptionSettingsService
			) {

				function createMainDetailLayout() {
					return {
						'fid': 'estimate.main.escalationcostchartform',
						'version': '1.0.0',
						'showGrouping': true,
						'addValidationAutomatically': true,
						'groups': [
							{
								gid: 'basicData',
								attributes: ['spendperiod','escamt','escamttotal']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
					};
				}

				let getEstimateMainEscalationCostChartLayout = createMainDetailLayout();

				let BaseService = platformUIStandardConfigService;

				let estimateMainEscalationCostChartAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'EstEscalationAmountDto',
					moduleSubModule: 'Estimate.Main'
				});
				estimateMainEscalationCostChartAttributeDomains = estimateMainEscalationCostChartAttributeDomains.properties;


				function EstimateMainEscalationCostChartUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				EstimateMainEscalationCostChartUIStandardService.prototype = Object.create(BaseService.prototype);
				EstimateMainEscalationCostChartUIStandardService.prototype.constructor = EstimateMainEscalationCostChartUIStandardService;

				let service = new BaseService(getEstimateMainEscalationCostChartLayout, estimateMainEscalationCostChartAttributeDomains, estimateMainTranslationService);

				return service;
			}
		]);
})();
