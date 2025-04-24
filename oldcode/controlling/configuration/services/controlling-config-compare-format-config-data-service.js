/*
 * Copyright(c) RIB Software GmbH
 */

(function (angular) {
	'use strict';
	let moduleName = 'controlling.configuration';

	angular.module(moduleName).factory('controllingConfigCompareFormatConfigDataService', [
		'_',
		'platformDataServiceFactory',
		function (
			_,
			platformDataServiceFactory) {

			let serviceCache = {};

			function createService() {
				let serviceName = 'controllingConfigCompareFormatConfigDataService';
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
					let list = service.getList();
					_.forEach(list, function (e) {
						e.scriptGroup = e ? e.Script.toLowerCase().replace(/\s+/g, '') : e;
					});

					let rs = false,
						arrScripts = _.map(list, 'scriptGroup'),
						objScript2Count = _.groupBy(arrScripts, function (e) {
							return e;
						});
					try {
						if (_.isArray(objScript2Count[item.scriptGroup]) && objScript2Count[item.scriptGroup].length > 1) {
							rs = true;
						}
					} catch (e) {
						rs = true;
					}

					return rs;
				};

				service.rowId = 1;

				service.hasAnyError = function (){
					let list = service.getList();
					let anyEmptyOrErrorCu = false;
					_.forEach(list, function (item){
						anyEmptyOrErrorCu = anyEmptyOrErrorCu || item.hasErrors;
					});

					return anyEmptyOrErrorCu;
				};

				function loadData() {
					let formatterList = getConditionalFormatterList(service.conditionalFormat) || {};
					_.map(formatterList, function (obj) {
						obj.Id = service.rowId++;
						if(service.readonly){
							obj.__rt$data = {entityReadonly: true};
						}
						return obj;
					});
					return formatterList;
				}

				function getConditionalFormatterList(customFormatter) {
					let formatterObj;
					let formatterList = [];

					if (customFormatter && Object.getOwnPropertyNames(customFormatter).length > 0) {
						formatterObj = angular.fromJson(customFormatter);
					} else {
						formatterObj = ''; // angular.fromJson(angular.toJson({'VAL()>0': 'color:red;'}));
					}

					_.forEach(formatterObj, function (value, key) {
						formatterList.push({'Script': key, 'Style': value});
					});

					return formatterList;
				}

				function createItem() {
					let newItem = {
						Id: service.rowId++,
						Script: 'VAL()>0',
						Style: 'color:red;'
					};

					data.itemList.push(newItem);
					data.entityCreated.fire(null, newItem);
				}

				if (serviceName) {
					serviceCache[serviceName] = service;
				}

				service.readonly = false;

				return service;
			}

			return {
				getService: createService
			};
		}
	]);
})(angular);
