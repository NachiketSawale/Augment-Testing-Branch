/*
 * $Id$
 * Copyright (c) RIB Software SE
 */
// eslint-disable-next-line no-redeclare
/* global angular */
(function (angular) {

	'use strict';
	var procurementInventoryModule = angular.module('procurement.inventory');

	/**
	 * @ngdoc service
	 * @name procurementInventoryContainerInformationService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	procurementInventoryModule.factory('procurementInventoryContainerInformationService', ['$injector', 'procurementInventoryHeaderUIStandardService', 'procurementInventoryUIStandardService',
		'inventoryDocumentUIStandardService',
		function ($injector, procurementInventoryHeaderUIStandardService, procurementInventoryUIStandardService, inventoryDocumentUIStandardService) {
			var service = {};

			/* jshint -W074 */ // There is no complexity; try harder, J.S.Hint.
			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				var config = {};

				switch (guid) {
					case '307631CD2A13454FA89AD6BAE489254B':// procurementInvoiceHeaderGridController
						config.layout = procurementInventoryHeaderUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementInventoryHeaderUIStandardService';
						config.dataServiceName = 'procurementInventoryHeaderDataService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case 'E68C57F4311249548A2C8553780D0E24':// inventoryHeaderDetailController
						config.layout = procurementInventoryHeaderUIStandardService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementInventoryHeaderUIStandardService';
						config.dataServiceName = 'procurementInventoryHeaderDataService';
						config.validationServiceName = 'inventoryHeaderElementValidationService';
						break;
					case '414D9E8881C648FAA99FFC2B9BD17CB4':// inventoryController
						config.layout = procurementInventoryUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementInventoryUIStandardService';
						config.dataServiceName = 'procurementInventoryDataService';
						config.validationServiceName = 'inventoryElementValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;

					case '814DD84A43DE4C0FB6549AAF202C66A8':// inventoryDetailController
						config.layout = procurementInventoryUIStandardService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementInventoryUIStandardService';
						config.dataServiceName = 'procurementInventoryDataService';
						config.validationServiceName = 'inventoryElementValidationService';
						break;

					case '23297D263B684366BF16AF7DB11A039E':// inventoryDocumentListController
						config.layout = inventoryDocumentUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'inventoryDocumentUIStandardService';
						config.dataServiceName = 'inventoryDocumentDataService';
						config.validationServiceName = 'inventoryDocumentValidationService';
						break;

					case '2FB3CD3E924246328F450E317CF65581':// inventoryDocumentDetailController
						config.layout = inventoryDocumentUIStandardService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'inventoryDocumentUIStandardService';
						config.dataServiceName = 'inventoryDocumentDataService';
						config.validationServiceName = 'inventoryDocumentValidationService';
						break;
				}
				return config;
			};

			return service;
		}
	]);
})(angular);
