/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function () {

	'use strict';
	var moduleName = 'sales.wip';

	/**
	 * @ngdoc service
	 * @name salesWipEstimateLineItemUIStandardService
	 * @function
	 *
	 * @description
	 * salesWipLineItemUIStandardService is the config service for all estimate line item views.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('salesWipEstimateLineItemUIStandardService',
		['platformUIStandardConfigService', 'salesWipTranslationService', 'platformSchemaService', 'salesWipConfigurationService', 'platformUIStandardExtentService',
			function (platformUIStandardConfigService, translationService, platformSchemaService, salesWipConfigurationService, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var estLineItemDomainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'EstLineItemDto',
					moduleSubModule: 'Estimate.Main'
				});

				if (estLineItemDomainSchema) {
					estLineItemDomainSchema = estLineItemDomainSchema.properties;
					estLineItemDomainSchema.Info = {domain: 'image'};
					estLineItemDomainSchema.Rule = {domain: 'imageselect'};
					estLineItemDomainSchema.Param = {domain: 'imageselect'};
					estLineItemDomainSchema.BoqRootRef = {domain: 'integer'};
					estLineItemDomainSchema.PsdActivitySchedule = {domain: 'code'};
					estLineItemDomainSchema.LiPreviousQuantity = {domain: 'quantity'};
					estLineItemDomainSchema.LiQuantity = {domain: 'quantity'};
					estLineItemDomainSchema.LiTotalQuantity = {domain: 'quantity'};
					estLineItemDomainSchema.LiPercentageQuantity = {domain: 'quantity'};
					estLineItemDomainSchema.LiCumulativePercentage = {domain: 'quantity'};
				}

				function EstimateUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				EstimateUIStandardService.prototype = Object.create(BaseService.prototype);
				EstimateUIStandardService.prototype.constructor = EstimateUIStandardService;

				var service = new BaseService(salesWipConfigurationService.getSalesWipEstLineItemLayout(), estLineItemDomainSchema, translationService);
				platformUIStandardExtentService.extend(service, salesWipConfigurationService.getSalesWipEstLineItemLayout().addition, estLineItemDomainSchema);
				return service;
			}
		]);
})();
