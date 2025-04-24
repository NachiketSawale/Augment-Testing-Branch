/**
 * Created by zos on 10/22/2015.
 */
(function () {

	// eslint-disable-next-line no-redeclare
	/* global angular */
	'use strict';
	var moduleName = 'procurement.package';

	/**
	 * @ngdoc service
	 * @name packageEstimateLineitemUIStandardService
	 * @function
	 *
	 * @description
	 * packageEstimateLineitemUIStandardService is the config service for all estimate line item views.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('packageEstimateLineitemUIStandardService',
		['platformUIStandardConfigService', 'procurementPackageTranslationService', 'platformSchemaService', 'procurementPackageUIConfigurationService',
			'platformUIStandardExtentService',
			function (platformUIStandardConfigService, translationService, platformSchemaService, procurementPackageUIConfigurationService,
				platformUIStandardExtentService) {

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
				}

				function EstimateUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				EstimateUIStandardService.prototype = Object.create(BaseService.prototype);
				EstimateUIStandardService.prototype.constructor = EstimateUIStandardService;

				var service = new BaseService(procurementPackageUIConfigurationService.getPackageEstLineItemLayout(), estLineItemDomainSchema, translationService);
				platformUIStandardExtentService.extend(service, procurementPackageUIConfigurationService.getPackageEstLineItemLayout().addition, estLineItemDomainSchema);
				return service;
			}
		]);
})();