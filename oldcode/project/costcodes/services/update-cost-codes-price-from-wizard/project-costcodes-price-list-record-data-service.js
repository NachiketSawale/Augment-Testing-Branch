/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'project.costcodes';
	angular.module(moduleName).factory('projectCostCodesPriceListRecordDataService', projectCostCodesPriceListForJobDataService);
	projectCostCodesPriceListForJobDataService.$inject = [
		'_',
		'$http',
		'$translate',
		'$injector',
		'globals',
		'platformDataServiceFactory',
		'ServiceDataProcessDatesExtension',
		'projectCostCodesPriceListForJobDataService'
	];
	function projectCostCodesPriceListForJobDataService(
		_,
		$http,
		$translate,
		$injector,
		globals,
		platformDataServiceFactory,
		ServiceDataProcessDatesExtension,
		projectCostCodesPriceListForJobDataService
	) {
		let serviceOptions = {
			module: angular.module(moduleName),
			serviceName: 'projectCostCodesPriceListRecordDataService',
			httpRead: {
				useLocalResource: true,
				resourceFunction: function () {
					let parentSelected = projectCostCodesPriceListForJobDataService.getSelected();
					if (parentSelected) {
						return parentSelected.PriceListForUpdate || [];
					}
					return [];
				}
			},
			presenter: {
				list: {
					incorporateDataRead: incorporateDataRead
				}
			},
			entitySelection: {},
			modification: {},
			actions: {
				delete: false,
				create: false
			},
			dataProcessor: [
				new ServiceDataProcessDatesExtension(['ValidFrom', 'ValidTo'])
			]
		};

		function incorporateDataRead(responseData, data) {
			let basCostCodes = _.filter(responseData, function(item){
				return item.Id === -1;
			});
			let basCostCodesColumnService = $injector.get('projectCostCodesPriceListRecordBasCostCodesColumnService');
			basCostCodesColumnService.attachDataToColumn(basCostCodes).then(function(){
				service.gridRefresh();
			});
			let costCodesPriceList = _.filter(responseData, function(item){
				return item.Id !== -1;
			});
			let dynamicColumnService = $injector.get('projectCostCodesPriceListRecordDynColumnService');
			dynamicColumnService.attachDataToColumn(costCodesPriceList).then(function(){
				service.gridRefresh();
			});
			return data.handleReadSucceeded(responseData, data);
		}

		let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
		let service = serviceContainer.service ? serviceContainer.service : {};
		let data = serviceContainer.data;
		data.markItemAsModified = function () {};
		service.markItemAsModified = function () {};
		service.setSeletedToAll = function setSeletedToAll(selected) {
			let list = service.getList();
			_.forEach(list, function (item) {
				item.Selected = selected;
			});
		};
		return service;
	}
})(angular);