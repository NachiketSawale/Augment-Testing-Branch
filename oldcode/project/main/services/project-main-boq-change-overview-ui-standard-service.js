(function () {

	'use strict';

	var moduleName = 'project.main';

	/**
     * @ngdoc service
     * @name
     * @function
     *
     * @description
     *
     */
	angular.module(moduleName).factory('prjMainBoqChangeOverviewUIStandardService',
		['platformUIStandardConfigService', 'platformTranslateService', 'platformSchemaService','boqMainTranslationService','prjBoqChangeOverviewDetailFormConfigService',
			function (platformUIStandardConfigService, platformTranslateService, platformSchemaService,boqMainTranslationService,prjBoqChangeOverviewDetailFormConfigService) {

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
						groupings: [{groupcolid: 'Sales.Contract.Code:' + 'code'}]
					};

					boqItemAttributeDomains.BidCode = {
						domain: 'code'
					};

					boqItemAttributeDomains.PrjChangeId = {domain: 'integer'};
					boqItemAttributeDomains.PrjChangeStatusId = {domain: 'integer'};
				}

				function BoqMainUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				BoqMainUIStandardService.prototype = Object.create(BaseService.prototype);
				BoqMainUIStandardService.prototype.constructor = BoqMainUIStandardService;

				var service = new BaseService(prjBoqChangeOverviewDetailFormConfigService.getFormConfig(internalOption), boqItemAttributeDomains, boqMainTranslationService);

				service.setCurrentBoqMainService = function currentBoqMainService(boqMainService) {
					internalOption.currentBoqMainService = boqMainService;
				};

				return service;            }
		]);
})(angular);

