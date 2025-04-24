(function (angular) {

	'use strict';
	let controllingGeneralContractorModule = angular.module('controlling.generalcontractor');
	controllingGeneralContractorModule.factory('controllingGeneralcontractorContainerInformationService', ['$injector', 'controllingGeneralContractorUIConfigurationService',
		function ($injector, controllingGeneralContractorUIConfigurationService) {
			let service = {};

			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				let config = {};
				switch (guid) {
					case '363147351C1A426B82E3890CF661493D':
						config.layout = controllingGeneralContractorUIConfigurationService.getCostControlDetailLayout();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'controllingGeneralContractorCostControlConfigurationService';
						config.dataServiceName = 'controllingGeneralcontractorCostControlDataService';
						config.validationServiceName = null;
						config.listConfig = {
							initCalled: false, columns: [],
							parentProp: 'MdcControllingUnitFk',
							childProp: 'CostControlVChildren',
							childSort: true,
							sortOptions: {
								initialSortColumn: {field: 'Code', id: 'code'},
								isAsc: false
							}
						};
						break;
					case '69601B8F4A7D4C519C8E2D7781A7AABC':
						config.layout = controllingGeneralContractorUIConfigurationService.getSalesContractsDetailLayout();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'controllingGeneralContractorSalesContractsConfigurationService';
						config.dataServiceName = 'controllingGeneralContractorSalesContractsDataService';
						config.validationServiceName = null;
						config.listConfig = {
							initCalled: false,
							columns: [],
							type : 'controlling.generalcontractor.salescontracts',
							dragDropService : $injector.get('controllingCommonClipboardService')
						};
						break;
					case 'B299831694EE4B2B9DE7623FB894EB1C':
						config.layout = controllingGeneralContractorUIConfigurationService.getLineItemsDetailLayout();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'controllingGeneralContractorLineItemsConfigurationService';
						config.dataServiceName = 'controllingGeneralContractorLineItemsDataService';
						config.validationServiceName = null;
						config.listConfig = {initCalled: false, columns: []};
						break;
				}
				return config;
			};

			return service;
		}
	]);
})(angular);
