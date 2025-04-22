/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	var moduleName = 'sales.common';

	angular.module(moduleName).factory('salesCommonGeneralsUIStandardService',
		['$translate', 'platformUIStandardConfigService', 'salesCommonGeneralsLayout', 'platformSchemaService', 'platformUIStandardExtentService', 'salesCommonGeneralsTranslationService', 'salesCommonGeneralsFilterService', 'basicsLookupdataLookupDescriptorService',
			function ($translate, platformUIStandardConfigService, salesCommonGeneralsLayout, platformSchemaService, platformUIStandardExtentService, salesCommonGeneralsTranslationService, salesCommonGeneralsFilterService, basicsLookupdataLookupDescriptorService) {
				return function (moduleSubModuleName) {

					var BaseService = platformUIStandardConfigService;

					var domainSchema = platformSchemaService.getSchemaFromCache({
						typeName: 'GeneralsDto',
						moduleSubModule: moduleSubModuleName
					});

					if (domainSchema) {
						domainSchema = domainSchema.properties;
					}

					function UIStandardService(layout, scheme, translateService) {
						BaseService.call(this, layout, scheme, translateService);
					}

					UIStandardService.prototype = Object.create(BaseService.prototype);
					UIStandardService.prototype.constructor = UIStandardService;

					// use a copy!
					var generalsLayout = angular.copy(salesCommonGeneralsLayout);
					salesCommonGeneralsFilterService.setFilterKeys(moduleSubModuleName, generalsLayout);

					var service = new BaseService(generalsLayout, domainSchema, salesCommonGeneralsTranslationService);

					platformUIStandardExtentService.extend(service, generalsLayout.addition, domainSchema);

					// override getStandardConfigForDetailView
					var basicGetStandardConfigForDetailView = service.getStandardConfigForDetailView;
					service.getStandardConfigForDetailView = function () {
						return angular.copy(basicGetStandardConfigForDetailView());
					};

					basicsLookupdataLookupDescriptorService.attachData({
						generalsvaluetype: [
							{
								Id: 0,
								Name: 'amount',
								Description: $translate.instant('cloud.common.entityAmount')
							},
							{
								Id: 1,
								Name: 'percent',
								Description: $translate.instant('cloud.common.entityPercent')
							}
						]
					});

					return service;
				};
			}]);


})(angular);
