/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	let projectCostCodesModule = angular.module('project.costcodes');

	/**
	 * @ngdoc service
	 * @name projectCostCodesContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	projectCostCodesModule.factory('projectCostcodesContainerInformationService', ['$injector',
		/* jshint -W072 */ // many parameters because of dependency injection
		function ($injector) {

			let service = {};

			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				let config = {};
				let layServ = null;
				switch (guid) {
					case '99E75030E41F11E4B5710800200C9A66': // projectCostCodesListController
						config = getCostCodesListConfig(config);
						break;
					case 'EBB7B20BD41047179D2FA0610423C1B1': // projectCostCodesListController
						config = getCostCodesListConfig(config);
						break;
					case 'BAFA6A50E41F11E4B5710800200C9A66': // projectCostCodesDetailController
						config = getCostCodesDetailConfig(config);
						break;
					case '01970505BE4B428288EE23567DEEED58': // projectCostCodesDetailController
						config = getCostCodesDetailConfig(config);
						break;
					case 'efbb019d03b541538ff24ef67dc683dc': // projectCostCodesJobRateListController
						layServ = $injector.get('projectCostCodesJobRateDynamicConfigurationService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'projectCostCodesJobRateDynamicConfigurationService';
						config.dataServiceName = 'projectCostCodesJobRateMainService';
						config.validationServiceName = 'projectCostCodesJobRateValidationService';
						config.listConfig = { initCalled: false,
							columns: [],
							cellChangeCallBack: function cellChangeCallBack(arg) {
								let field = arg.grid.getColumns()[arg.cell].field;
								let item = arg.item;
								let projectCostCodesJobRateDynamicUserDefinedColumnService = $injector.get('projectCostCodesJobRateDynamicUserDefinedColumnService');

								let jobRateService = $injector.get('projectCostCodesJobRateMainService');

								if(projectCostCodesJobRateDynamicUserDefinedColumnService.isUserDefinedColumnField(field)){
									projectCostCodesJobRateDynamicUserDefinedColumnService.fieldChange(item, field, item[field]);
								}else {
									if (field === 'LgmJobFk') {
										projectCostCodesJobRateDynamicUserDefinedColumnService.onJobChanged(item, field, item[field]);
									} else if (!jobRateService.isRecalculate(field)) {
										jobRateService.sysncPrjCostCode(field, item);
									}

									if(field === 'Rate') {
										$injector.get('projectCostCodesMainService').updateEstimatePrice();
									}
								}
							}};
						break;
					case 'a6005785aa2b40179b87c8caf833fa9b': // projectCostCodesJobRateDetailController
						layServ = $injector.get('projectCostCodesJobRateDynamicConfigurationService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'projectCostCodesJobRateDynamicConfigurationService';
						config.dataServiceName = 'projectCostCodesJobRateMainService';
						config.validationServiceName = 'projectCostCodesJobRateValidationService';
						break;
				}

				function getCostCodesListConfig(config) {
					layServ = $injector.get('projectCostCodesDynamicConfigurationService');
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'projectCostCodesDynamicConfigurationService';
					config.dataServiceName = 'projectCostCodesMainService';
					config.validationServiceName = 'projectCostCodesValidationService';
					config.listConfig = { initCalled: false,
						columns: [],
						parentProp: 'CostCodeParentFk',
						childProp: 'ProjectCostCodes',
						childSort: true,
						cellChangeCallBack: function cellChangeCallBack(arg) {
							$injector.get('projectCostCodesMainService').calcRealFactors(arg);

							let field = arg.grid.getColumns()[arg.cell].field;
							let item = arg.item;
							
							$injector.get('projectCostCodesMainService').fieldChanged(arg.item, field);
							let projectCostCodesDynamicUserDefinedColumnService = $injector.get('projectCostCodesDynamicUserDefinedColumnService');
							projectCostCodesDynamicUserDefinedColumnService.fieldChange(item, field, item[field]);

						}};
					return config;
				}

				function getCostCodesDetailConfig(config) {
					layServ = $injector.get('projectCostCodesDynamicConfigurationService');
					config = layServ.getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'projectCostCodesDynamicConfigurationService';
					config.dataServiceName = 'projectCostCodesMainService';
					config.validationServiceName = 'projectCostCodesValidationService';
					return config;
				}

				return config;
			};

			return service;
		}
	]);
})(angular);