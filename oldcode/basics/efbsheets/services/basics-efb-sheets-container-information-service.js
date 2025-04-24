/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	let moduleName = 'basics.efbsheets';
	let basicsEfbSheetsModule = angular.module(moduleName);

	/**
     * @ngdoc service
     * @name basicsEfbsheetsContainerInformationService
     * @function
     *
     * @description
     *
     */
	basicsEfbSheetsModule.factory('basicsEfbsheetsContainerInformationService', ['$injector',
		function ($injector) {

			let service = {};

			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				let config = {};
				let layServ = null;
				switch (guid) { 
					case 'c4feed8d0ff34ff3a540c3ed642cf67c': // basicsEfbsheetsListController
						layServ = $injector.get('basicsEfbsheetsUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsEfbsheetsUIStandardService';
						config.dataServiceName = 'basicsEfbsheetsMainService';
						config.validationServiceName = 'basicsEfbsheetsValidationService';
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case '2d3a55b0f9694b51a4580a1d362439a4': // basicsEfbsheetsDetailController
						layServ = $injector.get('basicsEfbsheetsUIStandardService');
						config.layout = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'basicsEfbsheetsUIStandardService';
						config.dataServiceName = 'basicsEfbsheetsMainService';
						config.validationServiceName = 'basicsEfbsheetsValidationService';
						break;
					case 'c9b63a888cfb4fb9b856e8f00bb57391': // basicsEfbsheetsAverageWageController
						layServ = $injector.get('basicsEfbsheetsAverageWageUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsEfbsheetsAverageWageUIStandardService';
						config.dataServiceName = 'basicsEfbsheetsAverageWageService';
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case '0b75353e6eb94790a745035590538792': // basicsEfbsheetsAverageWageDetailController
						layServ = $injector.get('basicsEfbsheetsAverageWageUIStandardService');
						config.layout = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'basicsEfbsheetsAverageWageUIStandardService';
						config.dataServiceName = 'basicsEfbsheetsAverageWageService';
						break;
					case '9d015027696b4f369c5191cf37d1e608': // basicsEfbsheetsCrewmixAfController
						layServ = $injector.get('basicsEfbsheetsCrewMixAfUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsEfbsheetsCrewMixAfUIStandardService';
						config.dataServiceName = 'basicsEfbsheetsCrewMixAfService';
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case 'eaf4a35143104547adf57cd5ffe3adfc': // basicsEfbsheetsCrewMixAfDetailController
						layServ = $injector.get('basicsEfbsheetsCrewMixAfUIStandardService');
						config.layout = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'basicsEfbsheetsCrewMixAfUIStandardService';
						config.dataServiceName = 'basicsEfbsheetsCrewMixAfService';
						break;
					case 'd452c853f5ef40b181a43c4ff5752a5e': // basicsEfbsheetsCrewMixAfsnController
						layServ = $injector.get('basicsEfbsheetsCrewMixAfsnUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsEfbsheetsCrewMixAfsnUIStandardService';
						config.dataServiceName = 'basicsEfbsheetsCrewMixAfsnService';
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case '8dd9387c993743999e66a63e3ac0ea9c': // basicsEfbsheetsCrewMixAfsnDetailController
						layServ = $injector.get('basicsEfbsheetsCrewMixAfsnUIStandardService');
						config.layout = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'basicsEfbsheetsCrewMixAfsnUIStandardService';
						config.dataServiceName = 'basicsEfbsheetsCrewMixAfsnService';
						break;
					case '90f4fa0bd6d249d0a2b7d3112f8ae03f': // basicsEfbsheetsCrewMixCostCodeController
						layServ = $injector.get('basicsEfbsheetsCrewMixCostCodeUIStandardService');
						config.layout = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsEfbsheetsCrewMixCostCodeUIStandardService';
						config.dataServiceName = 'basicsEfbsheetsCrewMixCostCodeService';
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case '2b2193f79ef74177a34a2345cd5d9e25': // basicsEfbsheetsCrewMixCostCodeDetailController
						layServ = $injector.get('basicsEfbsheetsCrewMixCostCodeUIStandardService');
						config.layout = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'basicsEfbsheetsCrewMixCostCodeUIStandardService';
						config.dataServiceName = 'basicsEfbsheetsCrewMixCostCodeService';
						break;
				}

				return config;
			};

			return service;
		}
	]);
})(angular);