/**
 * Created by Badugula on 20.10.2020.
 */

(function () {

	'use strict';

	var moduleName = 'procurement.package';

	/**
     * @ngdoc service
     * @name
     * @function
     *
     * @description
     *prcPackageBoqChangeOverviewUIStandardService
     */
	angular.module(moduleName).factory('prcPackageBoqChangeOverviewUIStandardService',
		['platformUIStandardConfigService', 'platformTranslateService', 'platformSchemaService','boqMainTranslationService','packageBoqChangeOverviewDetailFormConfigService',
			function (platformUIStandardConfigService, platformTranslateService, platformSchemaService,boqMainTranslationService,packageBoqChangeOverviewDetailFormConfigService) {

				var BaseService = platformUIStandardConfigService;
				var internalOption = {};

				var boqItemAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'BoqItemDto',
					moduleSubModule: 'Boq.Main'
				});

				if (boqItemAttributeDomains) {
					boqItemAttributeDomains = boqItemAttributeDomains.properties;

					boqItemAttributeDomains.PrjChangeFk = {domain: 'integer'};
					boqItemAttributeDomains.PrjChangeStatusFk = {domain: 'integer'};
					boqItemAttributeDomains.Price = {domain: 'money'};

					// add transient field and map this with grouping definition...
					boqItemAttributeDomains.F = {
						domain: 'description',
						groupings: [{groupcolid: 'Basics.CostGroups.CostGroup:'+ 'f'}]
					};

					boqItemAttributeDomains.BoqRootItemReference = {domain: 'description'};

					boqItemAttributeDomains.ContractCode = {
						domain: 'code',
						groupings: [{groupcolid: 'Procurement.Contract.Code:' + 'code'}]
					};

					boqItemAttributeDomains.PrjChangeId = {domain: 'integer'};
					boqItemAttributeDomains.PrjChangeStatusId = {domain: 'integer'};
				}

				function BoqMainUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				BoqMainUIStandardService.prototype = Object.create(BaseService.prototype);
				BoqMainUIStandardService.prototype.constructor = BoqMainUIStandardService;

				var service = new BaseService(packageBoqChangeOverviewDetailFormConfigService.getFormConfig(internalOption), boqItemAttributeDomains, boqMainTranslationService);

				service.setCurrentBoqMainService = function currentBoqMainService(boqMainService) {
					internalOption.currentBoqMainService = boqMainService;
				};

				return service;            }
		]);
})(angular);

