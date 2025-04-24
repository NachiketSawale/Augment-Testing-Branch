/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainUpdatePackageBoqPackageDataService', estimateMainUpdatePackageBoqPackageDataService);

	estimateMainUpdatePackageBoqPackageDataService.$inject = ['_', 'globals', 'platformDataServiceFactory', 'ServiceDataProcessDatesExtension',
		'platformRuntimeDataService'];

	function estimateMainUpdatePackageBoqPackageDataService(_, globals, platformDataServiceFactory, ServiceDataProcessDatesExtension,
		platformRuntimeDataService) {
		let packages = [];
		let visiblePackage = [];
		let hiddenPackages = [];
		let hidePackageOption = true;
		let packageFilter = null;
		let updateBudgetOnlyOption = false;

		let serviceOptions = {
			module: angular.module(moduleName),
			serviceName: 'estimateMainUpdatePackageBoqPackageDataService',
			httpRead: {
				route: globals.webApiBaseUrl + 'estimate/main/wizard/',
				endRead: 'getpackagesbylineitemsinscope',
				usePostForRead: true,
				initReadData: initReadData
			},
			presenter: {
				list: {
					incorporateDataRead: incorporateDataRead
				}
			},
			dataProcessor: [new ServiceDataProcessDatesExtension(['PlannedStart', 'PlannedEnd', 'ActualStart', 'ActualEnd'])],
			entitySelection: {},
			modification: {multi: {}},
			actions: {
				create: false,
				delete: false
			}
		};


		let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
		let service = serviceContainer.service;
		let data = serviceContainer.data;
		data.markItemAsModified = angular.noop;
		service.markItemAsModified = angular.noop;
		service.reset = reset;
		service.updateListByHidePackageOption = updateListByHidePackageOption;
		service.updatePackage = updatePackage;
		service.updateListByUpdateBudgetOnlyOption = updateListByUpdateBudgetOnlyOption;

		Object.defineProperties(service, {
			'hidePackageOption': {
				set: function (value) {
					hidePackageOption = value;
				},
				enumerable: true
			},
			'packageFilter': {
				get: function () {
					return packageFilter;
				},
				set: function (value) {
					packageFilter = value;
				},
				enumerable: true
			},
			'packages': {
				get: function () {
					return packages;
				},
				enumerable: true
			}
		});

		return service;

		// ///////////////////////////////

		function initReadData(readData) {
			readData.EstimateScope = packageFilter.estimateScope;
			readData.FilterRequest = packageFilter.filterRequest;
			readData.LineItemIds = packageFilter.selectedIds;
		}

		function incorporateDataRead(readItems, data) {
			let packagesTemp = readItems;
			_.forEach(packagesTemp, function (item) {
				item.isSelected = item.IsService || (!item.IsService && !item.IsMaterial);
				item.updateStatus = {code: 0, description: ''};
				if ((!item.IsService && item.IsMaterial)||!item.ConfigurationIsService) {
					item.isSelected = false;
					hiddenPackages.push(item);
				}
				else {
					visiblePackage.push(item);
				}
				setItemReadonly(item);
			});

			packages = _.slice(visiblePackage);
			if (!hidePackageOption) {
				packages = _.concat(packages, hiddenPackages);
			}

			return data.handleReadSucceeded(packages, data);
		}

		function reset() {
			packages = [];
			visiblePackage = [];
			hiddenPackages = [];
			hidePackageOption = true;
			packageFilter = null;
			data.itemList.length = 0;
			updateBudgetOnlyOption = false;
		}

		function updateListByHidePackageOption(hideOption) {
			packages = _.slice(visiblePackage);
			if (!hideOption) {
				packages = _.concat(packages, hiddenPackages);
			}
			data.itemList = packages;
			data.listLoaded.fire(packages);
			hidePackageOption = hideOption;
		}

		function updatePackage(id, status) {
			let item = _.find(packages, {Id: id});
			if (item) {
				item.updateStatus = status;
				item.isSelected = false;
			}
		}

		function updateListByUpdateBudgetOnlyOption(optionValue, needRefresh) {
			updateBudgetOnlyOption = !!optionValue;
			let packages = _.concat(visiblePackage, hiddenPackages);
			_.forEach(packages, function (item) {
				setItemReadonly(item);
			});

			if (needRefresh) {
				service.gridRefresh();
			}
		}

		function setItemReadonly(item) {
			let readonly = false;
			let readonlyFields = [];
			if (updateBudgetOnlyOption) {
				let canSelect = item.IsMaterial || item.IsService;
				if (!canSelect) {
					item.isSelected = canSelect;
				}
				readonly = !canSelect;
			}

			readonlyFields.push({field: 'isSelected', readonly: readonly});
			platformRuntimeDataService.readonly(item, readonlyFields);
		}
	}

})(angular);
