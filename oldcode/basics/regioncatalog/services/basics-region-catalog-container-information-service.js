/**
 * Created by jhe on 7/23/2018.
 */
(function (angular) {

	'use strict';
	var moduleName = 'basics.regionCatalog';
	var basicsRegionCatalogModule = angular.module(moduleName);

	/**
     * @ngdoc service
     * @name basicsRegionCatalogContainerInformationService
     * @function
     *
     * @description
     *
     */
	basicsRegionCatalogModule.factory('basicsRegionCatalogContainerInformationService', ['$injector',
		function ($injector) {

			var service = {};

			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				var config = {};
				var layServ = null;
				switch (guid) {
					case '4B02A602E9504978B271011EA1B4F42E': //basicsRegionTypeListController
						layServ = $injector.get('basicsRegionTypeUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsRegionTypeUIStandardService';
						config.dataServiceName = 'basicsRegionTypeMainService';
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case 'BF11F19D012145D097E879CE5878E2DD': //basicsRegionTypeDetailController
						layServ = $injector.get('basicsRegionTypeUIStandardService');
						config.layout = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'basicsRegionTypeUIStandardService';
						config.dataServiceName = 'basicsRegionTypeMainService';
						break;
					case 'B3006840f41A4624A194bf52DDCFAAE6': //basicsRegionCatalogListController
						layServ = $injector.get('basicsRegionCatalogUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsRegionCatalogUIStandardService';
						config.dataServiceName = 'basicsRegionCatalogService';
						config.validationServiceName = 'basicsRegionCatalogValidationService';
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case '45725AAD31A34E44BB92D163A658ED7A': //basicsRegionCatalogDetailController
						layServ = $injector.get('basicsRegionCatalogUIStandardService');
						config.layout = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'basicsRegionCatalogUIStandardService';
						config.validationServiceName = 'basicsRegionCatalogValidationService';
						config.dataServiceName = 'basicsRegionCatalogService';
						break;
				}

				return config;
			};

			return service;
		}
	]);
})(angular);