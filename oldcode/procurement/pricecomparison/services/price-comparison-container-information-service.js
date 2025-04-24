(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';
	angular.module(moduleName).factory('procurementPricecomparisonContainerInformationService', [
		'$injector',
		'platformLayoutHelperService',
		'basicsCommonContainerInformationServiceUtil',
		function (
			$injector,
			platformLayoutHelperService,
			containerInformationServiceUtil
		) {
			var service = {};

			service.getContainerInfoByGuid = function (guid) {
				var config = {};

				switch (guid) {
					case '1ec440875e364e8684f0ad25f0d94510':  // Request For Quotes grid
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'procurementPriceComparisonHeaderUIStandardService',
							dataSvc: 'procurementPriceComparisonMainService'
						}, null);
						break;

					case 'f9b0a5b7e1724150abc418ea83b507db': // Request For Quotes detail
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'procurementPriceComparisonHeaderUIStandardService',
							dataSvc: 'procurementPriceComparisonMainService'
						}, null);
						break;

					case 'ef496d027ad34b1f8fe282b1d6692ded':  // price comparison item
						var itemHelperService = $injector.get('procurementPriceComparisonItemHelperService');
						var itemConfigService = $injector.get('procurementPriceComparisonItemConfigService');
						var defaultColumns = itemHelperService.getDefaultColumns(itemConfigService);
						config.layout = {
							columns: defaultColumns
						};
						config.ContainerType = 'Grid';
						config.dataServiceName = 'procurementPriceComparisonItemService';
						config.listConfig = {initCalled: false, columns: []};
						break;

					case '8b9a53f0a1144c03b8447a99f7b38448':  // price comparison boq
						var boqHelperService = $injector.get('procurementPriceComparisonBoqHelperService');
						var boqConfigService = $injector.get('procurementPriceComparisonBoqConfigService');
						var boqDefaultColumns = boqHelperService.getDefaultColumns(boqConfigService);
						config.layout = {
							columns: boqDefaultColumns
						};
						config.ContainerType = 'Grid';
						config.dataServiceName = 'procurementPriceComparisonBoqService';
						config.listConfig = {initCalled: false, columns: []};
						break;

					case 'deb620733c7e494b8f4d261c4aa01c6b': // small price comparison header
						var quoteByRequestUiConfigService = $injector.get('procurementPriceComparisonQuoteByRequestUiConfigService');
						config = quoteByRequestUiConfigService.getStandardGridConfig();
						config.layout.columns = $injector.get(config.standardConfigurationService).getStandardConfigForListView().columns;
						break;

				}
				return config;
			};

			return service;
		}
	]);
})(angular);