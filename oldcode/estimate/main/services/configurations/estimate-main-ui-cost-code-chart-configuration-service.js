/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {


	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainCostCodeUIConfigurationService
	 * @function
	 *
	 * @description
	 * estimateMainUIConfigurationService is the config service for all estimate views.
	 */
	angular.module(moduleName).factory('estimateMainUICostCodeChartConfigurationService', ['$injector', 'platformUIStandardConfigService', 'platformSchemaService', 'estimateMainTranslationService',
		function ($injector, platformUIStandardConfigService, platformSchemaService, estimateMainTranslationService) {


			let getEstimateMainLineItemDetailLayout = function () {
				return {
					'fid': 'estimate.main.lineItem.detailform',
					'version': '1.0.2',
					'showGrouping': true,
					'change': 'change',
					addValidationAutomatically: true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['descriptioninfo', 'checked', 'color']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					]
				};
			};

			let BaseService = platformUIStandardConfigService;
			let estLineItemDomainSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'EstLineItemDto',
				moduleSubModule: 'Estimate.Main'
			});

			if (estLineItemDomainSchema) {
				estLineItemDomainSchema = estLineItemDomainSchema.properties;
				estLineItemDomainSchema.Checked = {domain: 'boolean'};
				estLineItemDomainSchema.Color = {domain: 'color'};
			}

			function EstimateUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			EstimateUIStandardService.prototype = Object.create(BaseService.prototype);
			EstimateUIStandardService.prototype.constructor = EstimateUIStandardService;

			return new BaseService(getEstimateMainLineItemDetailLayout(), estLineItemDomainSchema, estimateMainTranslationService);
		}
	]);
})();
