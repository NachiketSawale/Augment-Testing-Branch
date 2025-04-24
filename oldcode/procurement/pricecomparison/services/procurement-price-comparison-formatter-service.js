(function (angular) {
	'use strict';
	let moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).factory('procurementPriceComparisonFormatterService', [
		'_',
		'platformDataServiceFactory',
		'platformDataServiceActionExtension',
		'procurementPriceComparisonCommonHelperService',
		function (
			_,
			platformDataServiceFactory,
			platformDataServiceActionExtension,
			commonHelperService) {

			let serviceCache = {};

			function createService() {
				let serviceName = 'procurementPriceComparisonFormatterService';
				if (serviceName && serviceCache[serviceName]) {
					return serviceCache[serviceName];
				}

				let serviceOption = {
					module: angular.module(moduleName),
					serviceName: serviceName,
					httpRead: {
						useLocalResource: true,
						resourceFunction: loadData
					},
					httpCreate: {
						useLocalResource: true,
						resourceFunction: createItem
					},
					entitySelection: {},
					presenter: {list: {}},
					modification: {simple: {}},
					actions: {
						delete: {},
						create: 'flat'
					}
				};

				let container = platformDataServiceFactory.createNewComplete(serviceOption);
				let service = container.service;
				let data = container.data;

				// avoid console error: service.parentService() is not a function (see: platformDataServiceModificationTrackingExtension line 300)
				data.onCreateSucceeded = function () {
				};
				service.markItemAsModified = function () {
				};

				service.deleteItem = function (entity) {
					let deleteParams = {};
					deleteParams.entity = entity;
					deleteParams.index = data.itemList.indexOf(entity);

					data.onDeleteDone(deleteParams, data, null);
				};
				service.canDelete = function canDelete() {
					return data.itemList.length > 0;
				};

				service.validateReduplicateField = function (item) {
					let rs = false,
						arrScripts = _.map(service.getList(), 'Script'),
						objScript2Count = _.groupBy(arrScripts, function (e) {
							return e;
						});
					try {
						if (_.isArray(objScript2Count[item.Script]) && objScript2Count[item.Script].length > 1) {
							rs = true;
						}
					} catch (e) {
						rs = true;
					}

					return rs;
				};

				service.rowId = 1;

				function loadData() {
					let formatterList = commonHelperService.getConditionalFormatterList(service.conditionalFormat) || {};
					_.map(formatterList, function (obj) {
						obj.Id = service.rowId++; // Id (not id).
						return obj;
					});
					return formatterList;
				}

				function createItem() {
					let newItem = {
						Id: service.rowId++,
						Script: 'MAX()',
						Style: 'color:red;'
					};

					data.itemList.push(newItem);
					platformDataServiceActionExtension.fireEntityCreated(data, newItem);
				}

				if (serviceName) {
					serviceCache[serviceName] = service;
				}

				return service;
			}

			return {
				getService: createService
			};
		}
	]);
})(angular);
